// Seznam her pro menu na hlavní stránce.
//
// GET /api/hry → ["3-trida/akademie-nasobilky.html", "pro-zabavu/kostkovna.html", ...]
//
// Bere se z GitHubu (strom repozitáře přesně té verze, která je nasazená) a Vercel
// odpověď drží v mezipaměti, takže GitHub dostane jen pár dotazů za hodinu,
// i když web otevře celá třída najednou.

const FALLBACK_REPO = 'kosicatheodor-cyber/school-game';
const FOLDER = 'hry/';

module.exports = async (req, res) => {
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const slug = process.env.VERCEL_GIT_REPO_SLUG;
  const repo = owner && slug ? owner + '/' + slug : FALLBACK_REPO;
  const ref = process.env.VERCEL_GIT_COMMIT_SHA || 'main';
  try {
    const gh = await fetch('https://api.github.com/repos/' + repo + '/git/trees/' + ref + '?recursive=1', {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'theodorek.cz' },
    });
    if (!gh.ok) throw new Error('GitHub ' + gh.status);
    const files = (await gh.json()).tree
      .filter(f => f.type === 'blob' && f.path.startsWith(FOLDER) && f.path.endsWith('.html'))
      .map(f => f.path.slice(FOLDER.length))
      .filter(p => !p.startsWith('nahledy/') && !p.endsWith('index.html'));
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
    res.status(200).json(files);
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: String(e.message || e) });
  }
};
