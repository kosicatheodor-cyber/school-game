// Hodnocení her (1–5 hvězdiček), uložené v Upstash Redis.
// Databázi připojíš ve Vercelu: Storage → Upstash for Redis → Connect to project.
// Vercel pak sám nastaví proměnné KV_REST_API_URL a KV_REST_API_TOKEN.
//
// GET  /api/hodnoceni              → { "nazev-hry": { "avg": 4.5, "count": 2 }, ... }
// POST /api/hodnoceni {game,stars} → { "avg": 4.5, "count": 2 }
//
// Každý návštěvník (podle IP adresy) má u každé hry jeden hlas. Když hlasuje znovu,
// jeho původní hlas se jen přepíše.

const crypto = require('node:crypto');

const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const HASH = 'hodnoceni';
const MAX_GAMES = 300;
const VOTE_TTL = 60 * 60 * 24 * 365;

async function redis(...commands) {
  const res = await fetch(URL + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error('Redis ' + res.status);
  return (await res.json()).map(r => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

function stats(sum, count) {
  count = Number(count) || 0;
  return { avg: count ? Math.round((Number(sum) / count) * 10) / 10 : 0, count };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!URL || !TOKEN) return res.status(503).json({ error: 'Databáze není připojená.' });

  try {
    if (req.method === 'GET') {
      const [flat] = await redis(['HGETALL', HASH]);
      const raw = {};
      for (let i = 0; i < flat.length; i += 2) raw[flat[i]] = flat[i + 1];
      const out = {};
      for (const key of Object.keys(raw)) {
        if (!key.endsWith(':count')) continue;
        const game = key.slice(0, -6);
        out[game] = stats(raw[game + ':sum'], raw[key]);
      }
      return res.status(200).json(out);
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const game = String(body.game || '');
      const stars = Number(body.stars);
      if (!/^[a-z0-9-]{1,80}$/.test(game) || !Number.isInteger(stars) || stars < 1 || stars > 5) {
        return res.status(400).json({ error: 'Špatné hodnocení.' });
      }

      const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'neznamy';
      const voter = crypto.createHash('sha256').update(ip + '|' + TOKEN).digest('hex').slice(0, 24);
      const voteKey = 'hlas:' + game + ':' + voter;

      const [prev, exists, games] = await redis(['GET', voteKey], ['HEXISTS', HASH, game + ':count'], ['HLEN', HASH]);
      if (!exists && games / 2 >= MAX_GAMES) return res.status(429).json({ error: 'Moc her.' });

      const cmds = [['SET', voteKey, String(stars), 'EX', String(VOTE_TTL)]];
      if (prev) cmds.push(['HINCRBY', HASH, game + ':sum', String(stars - Number(prev))]);
      else cmds.push(['HINCRBY', HASH, game + ':sum', String(stars)], ['HINCRBY', HASH, game + ':count', '1']);
      cmds.push(['HMGET', HASH, game + ':sum', game + ':count']);
      const results = await redis(...cmds);
      const [sum, count] = results[results.length - 1];
      return res.status(200).json(stats(sum, count));
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Nepovolená metoda.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Hodnocení se nepodařilo načíst.' });
  }
};
