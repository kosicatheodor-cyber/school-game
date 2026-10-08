// Společný skript pro všechny hry. Stačí do hry vložit do <head> řádek:
//   <script src="/hra.js"></script>
// a hra dostane tlačítko „Domů“ (zpět na hlavní stránku) a sváteční ozdoby.
//
// Svátky a roční období: podle dnešního data se web i hry obléknou do svátečního.
//
// Vyzkoušet jiný svátek: přidej do adresy ?svatek=vanoce (nebo halloween, velikonoce…).
// Vypnout ozdoby: ?svatek=zadny
(function () {
  // Velikonoční neděle (gregoriánský kalendář).
  function easter(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
    const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }
  const plus = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  // Rozsah „den.měsíc – den.měsíc“ v daném roce.
  const dm = (d1, m1, d2, m2) => y => [new Date(y, m1 - 1, d1), new Date(y, m2 - 1, d2)];

  // Pořadí je důležité: vyhrává první svátek, do kterého dnešek padne.
  const SVATKY = [
    {
      id: 'novy-rok', when: [dm(31, 12, 31, 12), dm(1, 1, 2, 1)],
      nazev: 'Nový rok', pozdrav: 'Šťastný nový rok! 🎆',
      ozdoby: ['🎉', '✨', '🎊', '🎆'], pohyb: 'fall',
      bart: 'Haf! Šťastný nový rok!',
      chat: ['Na Silvestra se bojím rachejtlí, tak jsem pod peřinou. Ale šťastný nový rok! 🎆', 'Moje novoroční předsevzetí: víc pamlsků!'],
    },
    {
      id: 'valentyn', when: [dm(12, 2, 14, 2)],
      nazev: 'Valentýn', pozdrav: 'Hezkého Valentýna! 💖',
      ozdoby: ['💖', '💕', '💘', '🌹'], pohyb: 'fall',
      bart: 'Haf! Mám tě rád!',
      chat: ['Na Valentýna mám rád úplně všechny. I kočky. Skoro. 💖', 'Pusinka od psa = olíznutí. Chceš? 💕'],
    },
    {
      id: 'masopust', when: [y => [plus(easter(y), -52), plus(easter(y), -47)]],
      nazev: 'Masopust', pozdrav: 'Masopust a karneval! Jakou máš masku? 🎭',
      ozdoby: ['🎭', '🎉', '🎊', '🍩'], pohyb: 'fall',
      bart: 'Haf! Poznáš mě v masce?',
      chat: ['Mám masku, takže mě nikdo nepozná! …Ty jo? Haf! 🎭', 'Na masopust se jedí koblihy. Jednu si dám, ne pět. Možná šest. 🍩'],
    },
    {
      id: 'zima', when: [dm(3, 1, 28, 2)],
      nazev: 'Zima', pozdrav: 'Zima je tu! Hurá na sníh ⛄',
      ozdoby: ['❄️', '❅', '❆', '⛄'], pohyb: 'fall',
      bart: 'Haf! Jdeme bobovat?',
      chat: ['Sníh je nejlepší! Válím se v něm, dokud ze mě není sněhulák. ⛄', 'Leonbergeři mají kožich na zimu. Čepici mám jen pro parádu.'],
    },
    {
      id: 'velikonoce', when: [y => [plus(easter(y), -7), plus(easter(y), 1)]],
      nazev: 'Velikonoce', pozdrav: 'Veselé Velikonoce! 🐣',
      ozdoby: ['🥚', '🐣', '🌷', '🐰', '🐥'], pohyb: 'fall',
      bart: 'Haf! Kde jsou vajíčka?',
      chat: ['Jsem velikonoční zajíček! Teda pes. S ušima. 🐰', 'Našel jsem vajíčko! …a už ho nemám. Mňam. 🥚', 'Hody, hody, doprovody, dejte vejce malovaný! 🐣'],
    },
    {
      id: 'carodejnice', when: [dm(27, 4, 30, 4)],
      nazev: 'Pálení čarodějnic', pozdrav: 'Pálení čarodějnic! 🧹🔥',
      ozdoby: ['🧹', '🔥', '✨', '🌙'], pohyb: 'rise',
      bart: 'Haf! Čáry máry!',
      chat: ['Dneska jsem čaroděj! Umím vyčarovat buřt z ohně. 🔥', 'Na koštěti jsem nelétal, ale za koštětem jsem běhal! 🧹'],
    },
    {
      id: 'den-deti', when: [dm(30, 5, 1, 6)],
      nazev: 'Den dětí', pozdrav: 'Všechno nejlepší ke Dni dětí! 🎈',
      ozdoby: ['🎈', '🎈', '🍭', '⭐'], pohyb: 'rise',
      bart: 'Haf! Mám balonek!',
      chat: ['Den dětí! Dneska si hraju celý den. Teda jako vždycky. 🎈', 'Nesmím balonek kousnout, jinak bouchne. Už se mi to stalo… 💥'],
    },
    {
      id: 'prazdniny', when: [dm(26, 6, 31, 8)],
      nazev: 'Prázdniny', pozdrav: 'Hurá, prázdniny! ☀️',
      ozdoby: ['☀️', '🍦', '🏖️', '🌊', '🍉'], pohyb: 'float',
      bart: 'Haf! Prázdniny!',
      chat: ['Prázdniny! Jdeme k vodě? Já skočím první! 🌊', 'V létě mám brýle proti slunci. Vypadám cool, že jo? 😎'],
    },
    {
      id: 'skola', when: [dm(1, 9, 8, 9)],
      nazev: 'Začátek školy', pozdrav: 'Hurá do školy! 📚',
      ozdoby: ['📚', '✏️', '🍎', '📐'], pohyb: 'fall',
      bart: 'Haf! Učím se taky!',
      chat: ['Taky jdu do školy! Do psí. Umím už „sedni“ i „lehni“. 🎓', 'Úkol mi sežral pes. Teda… já. Promiň! 📚'],
    },
    {
      id: 'halloween', when: [dm(17, 10, 2, 11)],
      nazev: 'Halloween', pozdrav: 'Strašidelný Halloween! 🎃👻',
      ozdoby: ['🎃', '🦇', '👻', '🕯️', '⚡', '🦉', '🕯️', '🦇'], pohyb: 'float',
      bart: 'Haf! Wingardium Leviosa!',
      chat: ['Moudrý klobouk mě zařadil do Nebelvíru! Haf! ⚡', 'Wingardium Leviosa! …pamlsek se nevznesl. Asi to říkám špatně. 🪄', 'Bububu! 👻 Lekl ses? Já taky, z dýně. 🎃', 'Jsem Bart Potter, pes, který přežil… koupání. 🦉'],
      klic: /halloween|dýn|dyn|strašid|strasid|harry|potter|bradavic|kouzl|čaroděj|carodej|hůlk|hulk/,
    },
    {
      id: 'podzim', when: [dm(20, 9, 16, 10), dm(3, 11, 8, 11), dm(13, 11, 24, 11)],
      nazev: 'Podzim', pozdrav: 'Barevný podzim je tu! 🍂',
      ozdoby: ['🍂', '🍁', '🍃', '🌰'], pohyb: 'fall',
      bart: 'Haf! Hromada listí!',
      chat: ['Na podzim skáču do hromad listí. Pak jsem celý barevný! 🍂', 'Pouštíš draka? Já za ním běžím! 🪁'],
    },
    {
      id: 'martin', when: [dm(9, 11, 12, 11)],
      nazev: 'Svatý Martin', pozdrav: 'Martin přijíždí na bílém koni! 🐴❄️',
      ozdoby: ['❄️', '🐴', '🥐', '❅'], pohyb: 'fall',
      bart: 'Haf! Jede Martin!',
      chat: ['Martin přijel na bílém koni. Já bych přijel na skateboardu! 🛹', 'Svatomartinské rohlíčky… dáš mi jeden? 🥐'],
    },
    {
      id: 'mikulas', when: [dm(4, 12, 6, 12)],
      nazev: 'Mikuláš', pozdrav: 'Mikuláš, anděl a čert jdou! 😇😈',
      ozdoby: ['😇', '😈', '⭐', '🍬', '❄️'], pohyb: 'fall',
      bart: 'Haf! Byl jsi hodný?',
      chat: ['Já jsem dneska čert! Ale hodný čert. Grrr… haf! 😈', 'Byl jsem celý rok hodný. Skoro. Ten gauč se nepočítá. 😇', 'Mikuláši, nezlob se, že jsem snědl uhlí. 🍬'],
      klic: /mikul|čert|cert|anděl|andel/,
    },
    {
      id: 'vanoce', when: [dm(25, 11, 30, 12)],
      nazev: 'Vánoce', pozdrav: 'Veselé Vánoce! 🎄',
      ozdoby: ['❄️', '❅', '🎄', '⭐', '🎁', '❆'], pohyb: 'fall',
      bart: 'Haf! Veselé Vánoce!',
      chat: ['Veselé Vánoce! Pod stromečkem chci kost. Velkou. 🎁', 'Ozdoby na stromečku vypadají jako míčky. Nesmím je honit… 🎄', 'Ježíšek mi letos nese pamlsky, viď? 🎅'],
      klic: /vánoc|vanoc|ježíš|jezis|stromeč|stromec|dárk|dark|sníh|snih/,
    },
  ];

  function vyber(date) {
    const y = date.getFullYear();
    const t = new Date(y, date.getMonth(), date.getDate()).getTime();
    return SVATKY.find(s => s.when.some(range => {
      const [from, to] = range(y);
      return t >= from.getTime() && t <= to.getTime();
    })) || null;
  }

  let svatek;
  try {
    const want = new URLSearchParams(location.search).get('svatek');
    svatek = want ? SVATKY.find(s => s.id === want) || null : vyber(new Date());
  } catch { svatek = vyber(new Date()); }

  window.SVATEK = svatek;
  if (svatek) document.documentElement.dataset.svatek = svatek.id;

  // Padající / plovoucí ozdoby. Nedají se chytit myší, takže hraní nepřekáží.
  const css = `
.sz-domu{position:fixed;left:8px;top:8px;z-index:2147483001;display:flex;align-items:center;gap:6px;padding:6px 14px 6px 10px;border-radius:999px;background:rgba(255,255,255,.9);color:#14315e;border:2px solid #2563c9;box-shadow:0 2px 8px rgba(0,0,0,.18);font:800 15px/1.2 "Nunito","Trebuchet MS",Arial,sans-serif;text-decoration:none;opacity:.85;transition:opacity .2s,transform .2s}
.sz-domu:hover,.sz-domu:focus-visible{opacity:1;transform:translateY(-1px)}
.sz-domu:focus-visible{outline:3px solid #22994f;outline-offset:2px}
@media (max-width:600px){.sz-domu{padding:6px 9px}.sz-domu b{display:none}}
@media print{.sz-domu,.sz-prepinac,.sz-ozdoby{display:none!important}}
.sz-ozdoby{position:fixed;inset:0;pointer-events:none;z-index:2147483000;overflow:hidden}
.sz-ozdoby span{position:absolute;top:0;left:0;line-height:1;opacity:.85;will-change:transform;user-select:none}
.sz-fall span{animation:sz-fall linear infinite}
.sz-rise span{animation:sz-rise linear infinite}
.sz-float span{animation:sz-float ease-in-out infinite alternate}
@keyframes sz-fall{from{transform:translate(0,-12vh) rotate(0)}to{transform:translate(var(--dx),112vh) rotate(var(--rot))}}
@keyframes sz-rise{from{transform:translate(0,112vh)}to{transform:translate(var(--dx),-12vh)}}
@keyframes sz-float{from{transform:translate(0,0) rotate(-6deg)}to{transform:translate(var(--dx),18px) rotate(6deg)}}
.sz-prepinac{position:fixed;left:8px;bottom:8px;z-index:2147483001;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.75);box-shadow:0 2px 8px rgba(0,0,0,.2);font-size:18px;line-height:34px;padding:0;cursor:pointer;opacity:.55;transition:opacity .2s}
.sz-prepinac:hover,.sz-prepinac:focus-visible{opacity:1}
.sz-skryte .sz-ozdoby{display:none}
@media (prefers-reduced-motion:reduce){.sz-ozdoby span{animation:none!important}}
`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  const KEY = 'svatek-ozdoby-vypnute';
  function start() {
    const home = !!document.querySelector('[data-svatek-domov]');
    if (!home) {
      const a = document.createElement('a');
      a.className = 'sz-domu';
      a.href = '/';
      a.innerHTML = '<span aria-hidden="true">🏠</span><b>Domů</b>';
      a.setAttribute('aria-label', 'Zpět na hlavní stránku');
      a.title = 'Zpět na hlavní stránku';
      // Hra spuštěná v náhledu na hlavní stránce tlačítko nepotřebuje.
      if (window.top === window) document.body.append(a);
    }
    if (!svatek) return;
    const layer = document.createElement('div');
    layer.className = 'sz-ozdoby sz-' + svatek.pohyb;
    layer.setAttribute('aria-hidden', 'true');
    const count = svatek.pohyb === 'float' ? (home ? 14 : 9) : (home ? 22 : 14);
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.textContent = svatek.ozdoby[i % svatek.ozdoby.length];
      const size = 16 + Math.random() * 18;
      s.style.fontSize = size + 'px';
      s.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
      if (svatek.pohyb === 'float') {
        // Plovoucí svíčky a dýně se drží u okrajů, aby nezakrývaly hru.
        const edge = i % 2 ? 80 + Math.random() * 16 : Math.random() * 14;
        s.style.left = edge + 'vw';
        s.style.top = (4 + Math.random() * 84) + 'vh';
        s.style.setProperty('--dx', (Math.random() * 20 - 10) + 'px');
        s.style.animationDuration = (2.5 + Math.random() * 3) + 's';
        s.style.animationDelay = (-Math.random() * 5) + 's';
      } else {
        s.style.left = (Math.random() * 100) + 'vw';
        s.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
        s.style.animationDuration = (9 + Math.random() * 10) + 's';
        s.style.animationDelay = (-Math.random() * 19) + 's';
      }
      layer.append(s);
    }
    document.body.append(layer);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sz-prepinac';
    btn.textContent = svatek.ozdoby[0];
    const set = off => {
      document.documentElement.classList.toggle('sz-skryte', off);
      btn.title = off ? 'Zapnout sváteční ozdoby' : 'Vypnout sváteční ozdoby';
      btn.setAttribute('aria-label', btn.title);
      btn.setAttribute('aria-pressed', String(!off));
    };
    let off = false;
    try { off = localStorage.getItem(KEY) === '1'; } catch {}
    set(off);
    btn.addEventListener('click', () => {
      off = !off;
      set(off);
      try { localStorage.setItem(KEY, off ? '1' : '0'); } catch {}
    });
    document.body.append(btn);
  }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
