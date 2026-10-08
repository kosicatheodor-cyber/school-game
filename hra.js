// Společný skript pro všechny hry. Stačí do hry vložit do <head> řádek:
//   <script src="/hra.js"></script>
// a hra dostane tlačítko „Domů“ (zpět na hlavní stránku) a sváteční ozdoby.
//
// Svátky a roční období: podle dnešního data se web i hry obléknou do svátečního.
// pozdrav = krátký pozdrav, theo = co říká Theo v bublině na hlavní stránce, bart = Bartova bublina.
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
      id: 'den-ucitelu', when: [dm(28, 3, 28, 3)],
      nazev: 'Den učitelů', pozdrav: 'Dnes je Den učitelů! 🍎',
      theo: 'Den učitelů! Díky, paní učitelky a páni učitelé! 🍎',
      ozdoby: ['🍎', '✏️', '⭐', '📚'], pohyb: 'fall',
      bart: 'Haf! Díky, učitelé!',
      chat: ['Komenský řekl, že škola má být hrou. Proto Theo dělá hry! 🎓', 'Já mám taky učitele – Thea. Naučil mě „podej pac“. 🐾'],
    },
    {
      id: 'maj', when: [dm(1, 5, 1, 5)],
      nazev: '1. máj', pozdrav: 'Je 1. máj, lásky čas! 🌸',
      theo: 'Je 1. máj – lásky čas! 🌸',
      ozdoby: ['🌸', '🌸', '💕', '🌼'], pohyb: 'fall',
      bart: 'Haf! Lásky čas!',
      chat: ['Pod rozkvetlou třešní dávám olíznutí. To je psí pusa! 🌸', 'Byl pozdní večer – první máj… a já chtěl ven. 🌙'],
    },
    {
      id: 'den-vitezstvi', when: [dm(8, 5, 8, 5)],
      nazev: 'Den vítězství', pozdrav: 'Den vítězství 🕊️',
      theo: 'Den vítězství – v roce 1945 skončila válka. 🕊️',
      ozdoby: ['🌷', '🕊️', '✨'], pohyb: 'fall',
      bart: 'Haf! Ať je mír!',
      chat: ['Holubice je znak míru. Neboj, nehoním ji. 🕊️', 'Mír je, když se všichni mají rádi. I psi a kočky. Skoro. 🌷'],
    },
    {
      id: 'cyril-metodej', when: [dm(5, 7, 5, 7)],
      nazev: 'Cyril a Metoděj', pozdrav: 'Svatý Cyril a Metoděj 📜',
      theo: 'Cyril a Metoděj nám přinesli písmo hlaholici! 📜',
      ozdoby: ['📜', '✨', '☀️'], pohyb: 'fall',
      bart: 'Haf! Umím hlaholici!',
      chat: ['Cyril vymyslel písmo hlaholici. Já umím jen „haf“. 📜', 'Bez Cyrila a Metoděje bychom možná neměli knížky! 📚'],
    },
    {
      id: 'hus', when: [dm(6, 7, 6, 7)],
      nazev: 'Mistr Jan Hus', pozdrav: 'Mistr Jan Hus 📖',
      theo: 'Mistr Jan Hus říkal: Hledej pravdu! 📖',
      ozdoby: ['✨', '📖', '🕯️'], pohyb: 'fall',
      bart: 'Haf! Hledej pravdu!',
      chat: ['Jan Hus kázal v Betlémské kapli v Praze. Česky, aby mu všichni rozuměli! ⛪', 'Hledej pravdu! A taky pamlsky. Ty hledám pořád. 📖'],
    },
    {
      id: 'svaty-vaclav', when: [dm(27, 9, 28, 9)],
      nazev: 'Svatý Václav', pozdrav: 'Svatý Václav – Den české státnosti 🇨🇿',
      theo: 'Dneska je svatý Václav, patron české země! 🐴🇨🇿',
      ozdoby: ['🍂', '⭐', '🍁', '👑'], pohyb: 'fall',
      bart: 'Haf! Jsem kníže Bart!',
      chat: ['Mám svatováclavskou korunu! No… skoro. 👑', 'Svatý Václave, vévodo české země… haf! 🇨🇿', 'Svatý Václav je patron Čech. Já jsem patron gauče. 🛋️'],
      klic: /v[aá]clav|koruna|kn[ií]že|st[aá]tnost/,
    },
    {
      id: 'vznik-csr', when: [dm(27, 10, 28, 10)],
      nazev: 'Vznik Československa', pozdrav: 'Narozeniny republiky! 🇨🇿',
      theo: 'Republika má narozeniny! Vznikla 28. října 1918. 🇨🇿🎉',
      ozdoby: ['🇨🇿', '✨', '🎉'], pohyb: 'fall',
      bart: 'Haf! Ať žije republika!',
      chat: ['Republika má narozeniny! Dostane dort? Já bych si dal kousek. 🎂', 'Prvním prezidentem byl Tomáš Garrigue Masaryk. Měl prý rád koně! 🐎'],
      klic: /republik|[čc]eskoslov|masaryk|28/,
    },
    {
      id: '17-listopad', when: [dm(16, 11, 17, 11)],
      nazev: '17. listopad', pozdrav: 'Den boje za svobodu a demokracii 🇨🇿',
      theo: 'Den boje za svobodu! V roce 1989 lidé zvonili klíči. 🔑',
      ozdoby: ['🔑', '✨', '🕯️'], pohyb: 'fall',
      bart: 'Haf! Cinky cink!',
      chat: ['V roce 1989 lidi zvonili klíči. Já umím zvonit známkou na obojku! 🔑', 'Svoboda je, když můžeš říct, co si myslíš. Já si myslím: pamlsek! 🇨🇿'],
      klic: /listopad|svobod|demokrac|kl[ií][čc]|1989/,
    },
    {
      id: 'novy-rok', when: [dm(31, 12, 31, 12), dm(1, 1, 2, 1)],
      nazev: 'Nový rok', pozdrav: 'Šťastný nový rok! 🎆',
      ozdoby: ['🎉', '✨', '🎊', '🎆'], pohyb: 'fall',
      theo: 'Šťastný nový rok! Ať se vám daří ve škole i v mých hrách. 🎆',
      bart: 'Haf! Šťastný nový rok!',
      chat: ['Na Silvestra se bojím rachejtlí, tak jsem pod peřinou. Ale šťastný nový rok! 🎆', 'Moje novoroční předsevzetí: víc pamlsků!'],
    },
    {
      id: 'valentyn', when: [dm(12, 2, 14, 2)],
      nazev: 'Valentýn', pozdrav: 'Hezkého Valentýna! 💖',
      ozdoby: ['💖', '💕', '💘', '🌹'], pohyb: 'fall',
      theo: 'Hezkého Valentýna! Pošli srdíčko někomu, koho máš rád. 💖',
      bart: 'Haf! Mám tě rád!',
      chat: ['Na Valentýna mám rád úplně všechny. I kočky. Skoro. 💖', 'Pusinka od psa = olíznutí. Chceš? 💕'],
    },
    {
      id: 'masopust', when: [y => [plus(easter(y), -52), plus(easter(y), -47)]],
      nazev: 'Masopust', pozdrav: 'Masopust a karneval! Jakou máš masku? 🎭',
      ozdoby: ['🎭', '🎉', '🎊', '🍩'], pohyb: 'fall',
      theo: 'Je masopust! Jakou masku si letos vezmeš ty? 🎭',
      bart: 'Haf! Poznáš mě v masce?',
      chat: ['Mám masku, takže mě nikdo nepozná! …Ty jo? Haf! 🎭', 'Na masopust se jedí koblihy. Jednu si dám, ne pět. Možná šest. 🍩'],
    },
    {
      id: 'zima', when: [dm(3, 1, 28, 2)],
      nazev: 'Zima', pozdrav: 'Zima je tu! Hurá na sníh ⛄',
      ozdoby: ['❄️', '❅', '❆', '⛄'], pohyb: 'fall',
      theo: 'Je zima! Po škole jdu bobovat a pak si zahraju nějakou hru. ⛄',
      bart: 'Haf! Jdeme bobovat?',
      chat: ['Sníh je nejlepší! Válím se v něm, dokud ze mě není sněhulák. ⛄', 'Leonbergeři mají kožich na zimu. Čepici mám jen pro parádu.'],
    },
    {
      id: 'velikonoce', when: [y => [plus(easter(y), -7), plus(easter(y), 1)]],
      nazev: 'Velikonoce', pozdrav: 'Veselé Velikonoce! 🐣',
      ozdoby: ['🥚', '🐣', '🌷', '🐰', '🐥'], pohyb: 'fall',
      theo: 'Veselé Velikonoce! Kolik vajíček jsi vykoledoval? 🐣',
      bart: 'Haf! Kde jsou vajíčka?',
      chat: ['Jsem velikonoční zajíček! Teda pes. S ušima. 🐰', 'Našel jsem vajíčko! …a už ho nemám. Mňam. 🥚', 'Hody, hody, doprovody, dejte vejce malovaný! 🐣'],
    },
    {
      id: 'carodejnice', when: [dm(27, 4, 30, 4)],
      nazev: 'Pálení čarodějnic', pozdrav: 'Pálení čarodějnic! 🧹🔥',
      ozdoby: ['🧹', '🔥', '✨', '🌙'], pohyb: 'rise',
      theo: 'Dneska se pálí čarodějnice! Uvidíme se u ohně? 🧹🔥',
      bart: 'Haf! Čáry máry!',
      chat: ['Dneska jsem čaroděj! Umím vyčarovat buřt z ohně. 🔥', 'Na koštěti jsem nelétal, ale za koštětem jsem běhal! 🧹'],
    },
    {
      id: 'den-deti', when: [dm(30, 5, 1, 6)],
      nazev: 'Den dětí', pozdrav: 'Všechno nejlepší ke Dni dětí! 🎈',
      ozdoby: ['🎈', '🎈', '🍭', '⭐'], pohyb: 'rise',
      theo: 'Všechno nejlepší ke Dni dětí! Dneska se hraje celý den. 🎈',
      bart: 'Haf! Mám balonek!',
      chat: ['Den dětí! Dneska si hraju celý den. Teda jako vždycky. 🎈', 'Nesmím balonek kousnout, jinak bouchne. Už se mi to stalo… 💥'],
    },
    {
      id: 'prazdniny', when: [dm(26, 6, 31, 8)],
      nazev: 'Prázdniny', pozdrav: 'Hurá, prázdniny! ☀️',
      ozdoby: ['☀️', '🍦', '🏖️', '🌊', '🍉'], pohyb: 'float',
      theo: 'Hurá, prázdniny! Ale zahrát si můžeš i v létě. ☀️',
      bart: 'Haf! Prázdniny!',
      chat: ['Prázdniny! Jdeme k vodě? Já skočím první! 🌊', 'V létě mám brýle proti slunci. Vypadám cool, že jo? 😎'],
    },
    {
      id: 'skola', when: [dm(1, 9, 8, 9)],
      nazev: 'Začátek školy', pozdrav: 'Hurá do školy! 📚',
      ozdoby: ['📚', '✏️', '🍎', '📐'], pohyb: 'fall',
      theo: 'Škola začala! Moje hry ti pomůžou s učením. 📚',
      bart: 'Haf! Učím se taky!',
      chat: ['Taky jdu do školy! Do psí. Umím už „sedni“ i „lehni“. 🎓', 'Úkol mi sežral pes. Teda… já. Promiň! 📚'],
    },
    {
      id: 'halloween', when: [dm(17, 10, 2, 11)],
      nazev: 'Halloween', pozdrav: 'Strašidelný Halloween! 🎃👻',
      ozdoby: ['🎃', '🦇', '👻', '🕷️', '🍬', '🍂'], pohyb: 'fall',
      theo: 'Strašidelný Halloween! Bububu… bojíš se? 🎃👻',
      bart: 'Haf! Bububu! 👻',
      chat: ['Bububu! 👻 Lekl ses? Já taky, z dýně. 🎃', 'Dneska jsem upír! Ale piju jen vodu z misky. 🧛', 'Koledu, nebo vám vyvedu! Nejradši koleduju pamlsky. 🍬', 'Netopýři jsou jako malí létající psi. Haf! 🦇'],
      klic: /halloween|dýn|dyn|strašid|strasid|duch|upír|upir|netopýr|netopyr|koled/,
    },
    {
      id: 'vesmir', when: [dm(4, 10, 10, 10)],
      nazev: 'Světový týden vesmíru', pozdrav: 'Světový týden vesmíru! 🚀',
      theo: 'Je Světový týden vesmíru! Už v roce 1957 letěl první Sputnik. 🚀',
      ozdoby: ['⭐', '✨', '🌟', '☄️'], pohyb: 'fall',
      bart: 'Haf! Letím ke hvězdám!',
      chat: ['Do vesmíru letěla i fenka Lajka. Byla to první psí kosmonautka! 🐕‍🦺🚀', 'Na Měsíci bych skákal šestkrát výš. Hop! 🌕', 'Ze všech planet mám nejradši Saturn. Má kolem sebe obojek! 🪐', 'Prvním Čechem ve vesmíru byl Vladimír Remek. 🇨🇿🚀'],
      klic: /vesm[ií]r|raket|planet|hv[ěe]zd|m[ěe]s[ií]c|kosmonaut|astronaut|ufo|mimozem/,
    },
    {
      id: 'podzim', when: [dm(20, 9, 16, 10), dm(3, 11, 8, 11), dm(13, 11, 24, 11)],
      nazev: 'Podzim', pozdrav: 'Barevný podzim je tu! 🍂',
      ozdoby: ['🍂', '🍁', '🍃', '🌰'], pohyb: 'fall',
      theo: 'Venku je barevný podzim! Pouštěli jste už draka? 🍂',
      bart: 'Haf! Hromada listí!',
      chat: ['Na podzim skáču do hromad listí. Pak jsem celý barevný! 🍂', 'Pouštíš draka? Já za ním běžím! 🪁'],
    },
    {
      id: 'martin', when: [dm(9, 11, 12, 11)],
      nazev: 'Svatý Martin', pozdrav: 'Martin přijíždí na bílém koni! 🐴❄️',
      ozdoby: ['❄️', '🐴', '🥐', '❅'], pohyb: 'fall',
      theo: 'Martin přijíždí na bílém koni! Uvidíme, jestli přiveze sníh. ❄️',
      bart: 'Haf! Jede Martin!',
      chat: ['Martin přijel na bílém koni. Já bych přijel na skateboardu! 🛹', 'Svatomartinské rohlíčky… dáš mi jeden? 🥐'],
    },
    {
      id: 'mikulas', when: [dm(4, 12, 6, 12)],
      nazev: 'Mikuláš', pozdrav: 'Mikuláš, anděl a čert jdou! 😇😈',
      ozdoby: ['😇', '😈', '⭐', '🍬', '❄️'], pohyb: 'fall',
      theo: 'Dneska chodí Mikuláš, anděl a čert! Byli jste hodní? 😇😈',
      bart: 'Haf! Byl jsi hodný?',
      chat: ['Já jsem dneska čert! Ale hodný čert. Grrr… haf! 😈', 'Byl jsem celý rok hodný. Skoro. Ten gauč se nepočítá. 😇', 'Mikuláši, nezlob se, že jsem snědl uhlí. 🍬'],
      klic: /mikul|čert|cert|anděl|andel/,
    },
    {
      id: 'vanoce', when: [dm(25, 11, 30, 12)],
      nazev: 'Vánoce', pozdrav: 'Veselé Vánoce! 🎄',
      ozdoby: ['❄️', '❅', '🎄', '⭐', '🎁', '❆'], pohyb: 'fall',
      theo: 'Veselé Vánoce! Ať najdete pod stromečkem, co si přejete. 🎄',
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
  // Pro stránku svatky.html: všechny svátky a jejich data v daném roce.
  window.SVATKY_SEZNAM = SVATKY.map(x => ({ id: x.id, nazev: x.nazev, rozsahy: y => x.when.map(r => r(y)) }));
  if (svatek) document.documentElement.dataset.svatek = svatek.id;

  // Pohyblivé obrázky na pozadí každého svátku.
  // [obrázek, velikost v px, kde je, pohyb, délka pohybu v s, posun startu v s, { deti, bily }]
  // Pohyby: bob (houpe se nahoru a dolů), sway (kývá se), glow (svítí), twinkle (bliká),
  // spin (pomalu se točí), hop (přeskáče zprava doleva), fly (přeletí zprava doleva).
  // deti = obrázky na tom hlavním (pozice v % jeho velikosti, velikost jako díl).
  const SCENY = {
    vesmir: [
      ['🚀', 130, 'left:3vw;bottom:4vh', 'bob', 1.2, 0], ['🪐', 120, 'right:5vw;top:8vh', 'bob', 5, 0],
      ['👨‍🚀', 80, 'left:16vw;bottom:14vh', 'bob', 3, -1], ['🛸', 70, 'right:-12vw;top:26vh', 'fly', 11, 0],
      ['☄️', 60, 'right:-12vw;top:6vh', 'fly', 7, -3], ['🌍', 70, 'left:40vw;top:5vh', 'spin', 40, 0],
    ],
    'den-ucitelu': [
      ['🍎', 100, 'left:3vw;bottom:3vh', 'bob', 2, 0], ['📚', 90, 'left:14vw;bottom:2vh', 'sway', 3, 0],
      ['💐', 80, 'right:6vw;top:14vh', 'sway', 2, 0],
    ],
    maj: [
      ['🌳', 150, 'left:2vw;bottom:2vh', 'sway', 4, 0, { deti: [
        ['🌸', 0.25, 'left:20%;top:15%', 'twinkle', 1.4, 0], ['🌸', 0.22, 'left:55%;top:30%', 'twinkle', 1.6, -0.5],
        ['🌸', 0.24, 'left:38%;top:5%', 'twinkle', 1.2, -0.9],
      ] }],
      ['💕', 70, 'left:18vw;bottom:8vh', 'bob', 1.6, 0], ['🐝', 40, 'right:-12vw;top:30vh', 'fly', 12, 0],
    ],
    'den-vitezstvi': [
      ['🕊️', 90, 'right:-12vw;top:14vh', 'fly', 14, 0], ['🌷', 70, 'left:4vw;bottom:2vh', 'sway', 2.4, 0],
      ['🇨🇿', 90, 'left:12vw;bottom:3vh', 'sway', 2, -1],
    ],
    'cyril-metodej': [
      ['📜', 110, 'left:3vw;bottom:3vh', 'bob', 3, 0], ['⛪', 120, 'left:14vw;bottom:2vh', 'bob', 6, 0],
    ],
    hus: [
      ['📖', 100, 'left:3vw;bottom:3vh', 'bob', 3, 0], ['⛪', 120, 'left:14vw;bottom:2vh', 'bob', 6, 0],
      ['🕯️', 70, 'left:24vw;bottom:3vh', 'glow', 1.4, 0],
    ],
    'svaty-vaclav': [
      ['🏰', 140, 'left:2vw;bottom:2vh', 'bob', 6, 0], ['🐎', 110, 'right:-14vw;bottom:3vh', 'hop', 14, 0],
      ['🇨🇿', 80, 'right:6vw;top:12vh', 'sway', 2, 0], ['🛡️', 70, 'left:17vw;bottom:2vh', 'bob', 2.4, 0],
    ],
    'vznik-csr': [
      ['🇨🇿', 120, 'left:3vw;bottom:4vh', 'sway', 2, 0], ['🎆', 100, 'right:6vw;top:10vh', 'twinkle', 2, 0],
      ['🎆', 70, 'left:40vw;top:6vh', 'twinkle', 2.6, -1], ['🏛️', 110, 'left:16vw;bottom:2vh', 'bob', 6, 0],
    ],
    '17-listopad': [
      ['🕯️', 100, 'left:4vw;bottom:3vh', 'glow', 1.4, 0], ['🕯️', 80, 'left:12vw;bottom:3vh', 'glow', 1.7, -0.5],
      ['🇨🇿', 90, 'right:6vw;top:12vh', 'sway', 2, 0], ['🔑', 70, 'left:20vw;bottom:4vh', 'sway', 0.5, 0],
    ],
    'novy-rok': [
      ['🎆', 110, 'left:4vw;top:12vh', 'twinkle', 2.2, 0], ['🎇', 90, 'right:6vw;top:22vh', 'twinkle', 2.6, -1],
      ['🎆', 70, 'left:42vw;top:5vh', 'twinkle', 3, -1.5], ['🥂', 90, 'left:3vw;bottom:3vh', 'sway', 2.5, 0],
    ],
    valentyn: [
      ['💝', 110, 'left:3vw;bottom:4vh', 'bob', 2, 0], ['🧸', 90, 'left:14vw;bottom:3vh', 'sway', 3, -1],
      ['💌', 60, 'right:-12vw;top:14vh', 'fly', 16, 0],
    ],
    masopust: [
      ['🎭', 120, 'left:3vw;bottom:5vh', 'sway', 2.4, 0], ['🍩', 70, 'left:15vw;bottom:3vh', 'bob', 1.8, -0.5],
      ['🎺', 70, 'right:5vw;top:16vh', 'sway', 2, -1],
    ],
    zima: [
      ['⛄', 130, 'left:3vw;bottom:2vh', 'sway', 3, 0], ['🌲', 110, 'left:15vw;bottom:2vh', 'sway', 4, -1],
      ['🛷', 70, 'right:-12vw;bottom:4vh', 'hop', 14, 0],
    ],
    velikonoce: [
      ['🧺', 140, 'left:3vw;bottom:2vh', 'sway', 3, 0, { deti: [
        ['🥚', 0.34, 'left:12%;top:-4%', 'bob', 0.9, 0], ['🥚', 0.3, 'left:38%;top:-16%', 'bob', 0.9, -0.3],
        ['🥚', 0.32, 'left:62%;top:-6%', 'bob', 0.9, -0.6],
      ] }],
      ['🐣', 60, 'left:17vw;bottom:2vh', 'bob', 1.6, 0], ['🌷', 60, 'left:23vw;bottom:2vh', 'sway', 2.4, 0],
      ['🌷', 50, 'left:28vw;bottom:2vh', 'sway', 2.4, -1], ['🐇', 70, 'right:-12vw;bottom:3vh', 'hop', 12, 0],
      ['🐇', 50, 'right:-12vw;bottom:9vh', 'hop', 15, -7],
    ],
    carodejnice: [
      ['🔥', 120, 'left:4vw;bottom:2vh', 'glow', 0.8, 0], ['🌙', 100, 'right:6vw;top:10vh', 'bob', 4, 0],
      ['🧙‍♀️', 80, 'right:-12vw;top:22vh', 'fly', 13, 0],
    ],
    'den-deti': [
      ['🎈', 90, 'left:4vw;bottom:14vh', 'bob', 2, 0], ['🎈', 70, 'left:10vw;bottom:20vh', 'bob', 2.4, -1],
      ['🎠', 110, 'left:12vw;bottom:2vh', 'bob', 1.5, 0], ['🪁', 80, 'right:6vw;top:12vh', 'sway', 2, 0],
    ],
    prazdniny: [
      ['☀️', 130, 'right:5vw;top:8vh', 'spin', 30, 0], ['🏖️', 120, 'left:3vw;bottom:2vh', 'bob', 4, 0],
      ['🌴', 110, 'left:16vw;bottom:2vh', 'sway', 3, 0], ['⛵', 70, 'right:-12vw;bottom:6vh', 'fly', 20, 0],
    ],
    skola: [
      ['🎒', 110, 'left:3vw;bottom:3vh', 'bob', 2, 0], ['📚', 80, 'left:14vw;bottom:2vh', 'sway', 3, 0],
      ['✏️', 60, 'right:6vw;top:16vh', 'sway', 1.6, 0],
    ],
    podzim: [
      ['🍁', 130, 'left:3vw;bottom:3vh', 'sway', 3, 0], ['🍄', 60, 'left:15vw;bottom:2vh', 'bob', 2, 0],
      ['🪁', 90, 'right:6vw;top:10vh', 'sway', 2.2, 0], ['🦔', 60, 'right:-12vw;bottom:2vh', 'hop', 22, 0],
    ],
    halloween: [
      ['🌕', 130, 'right:5vw;top:7vh', 'glow', 3, 0], ['🏚️', 130, 'left:2vw;bottom:2vh', 'bob', 6, 0],
      ['🎃', 80, 'left:15vw;bottom:2vh', 'glow', 1.2, 0], ['🎃', 60, 'left:22vw;bottom:2vh', 'glow', 1.4, -0.6],
      ['👻', 80, 'left:6vw;top:30vh', 'bob', 2.2, 0], ['🕸️', 90, 'right:0;top:0', 'sway', 5, 0],
      ['🦇', 50, 'right:-12vw;top:18vh', 'fly', 9, 0], ['🦇', 40, 'right:-12vw;top:30vh', 'fly', 11, -5],
    ],
    martin: [
      ['🐎', 110, 'right:-14vw;bottom:3vh', 'hop', 14, 0, { bily: true }], ['❄️', 80, 'left:5vw;top:14vh', 'twinkle', 2, 0],
      ['🥐', 70, 'left:3vw;bottom:3vh', 'bob', 2, 0],
    ],
    mikulas: [
      ['👼', 100, 'left:3vw;bottom:10vh', 'bob', 2.2, 0], ['😈', 100, 'left:14vw;bottom:3vh', 'sway', 1.2, 0],
      ['⭐', 70, 'right:6vw;top:12vh', 'twinkle', 1.8, 0], ['🍬', 50, 'left:24vw;bottom:3vh', 'bob', 1.5, -0.5],
    ],
    vanoce: [
      ['🎄', 150, 'left:2vw;bottom:2vh', 'sway', 4, 0, { deti: [
        ['⭐', 0.28, 'left:36%;top:-14%', 'twinkle', 1.6, 0], ['✨', 0.22, 'left:28%;top:34%', 'twinkle', 1.1, -0.4],
        ['✨', 0.2, 'left:56%;top:58%', 'twinkle', 1.4, -0.8],
      ] }],
      ['🎁', 70, 'left:18vw;bottom:2vh', 'bob', 2, 0], ['⛄', 100, 'left:24vw;bottom:2vh', 'sway', 3, -1],
      ['🦌🦌🛷', 56, 'right:-22vw;top:12vh', 'fly', 16, 0],
    ],
  };

  // Ozdoby jsou za obsahem stránky (hru nezakrývají) a nedají se chytit myší.
  const css = `
.sz-domu{position:fixed;left:8px;top:8px;z-index:2147483001;display:flex;align-items:center;gap:6px;padding:6px 14px 6px 10px;border-radius:999px;background:rgba(255,255,255,.9);color:#14315e;border:2px solid #2563c9;box-shadow:0 2px 8px rgba(0,0,0,.18);font:800 15px/1.2 "Nunito","Trebuchet MS",Arial,sans-serif;text-decoration:none;opacity:.85;transition:opacity .2s,transform .2s}
.sz-domu:hover,.sz-domu:focus-visible{opacity:1;transform:translateY(-1px)}
.sz-domu:focus-visible{outline:3px solid #22994f;outline-offset:2px}
@media (max-width:600px){.sz-domu{padding:6px 9px}.sz-domu b{display:none}}
@media print{.sz-domu,.sz-prepinac,.sz-pozadi{display:none!important}}
.sz-pozadi{position:fixed;inset:0;pointer-events:none;z-index:-1;overflow:hidden;user-select:none}
.sz-pozadi span{position:absolute;line-height:1;white-space:nowrap}
.sz-padani span{top:0;left:0;opacity:.8;will-change:transform}
.sz-fall span{animation:sz-fall linear infinite}
.sz-rise span{animation:sz-rise linear infinite}
.sz-float span{animation:sz-float ease-in-out infinite alternate}
@keyframes sz-fall{from{transform:translate(0,-12vh) rotate(0)}to{transform:translate(var(--dx),112vh) rotate(var(--rot))}}
@keyframes sz-rise{from{transform:translate(0,112vh)}to{transform:translate(var(--dx),-12vh)}}
@keyframes sz-float{from{transform:translate(0,0) rotate(-6deg)}to{transform:translate(var(--dx),18px) rotate(6deg)}}
.sz-pozadi .sz-o{font-size:calc(var(--s) * min(1px, .11vw));display:inline-block}
.sz-pozadi .sz-o .sz-o{font-size:calc(var(--k) * 1em)}
[data-svatek-domov] .sz-pozadi .sz-o{font-size:calc(var(--s) * min(1.6px, .16vw))}
[data-svatek-domov] .sz-pozadi .sz-o .sz-o{font-size:calc(var(--k) * 1em)}
.sz-o.bily{filter:grayscale(1) brightness(1.9)}
.sz-o.a-bob{animation:sz-bob var(--t) ease-in-out var(--z) infinite alternate}
.sz-o.a-sway{transform-origin:50% 100%;animation:sz-sway var(--t) ease-in-out var(--z) infinite alternate}
.sz-o.a-glow{animation:sz-glow var(--t) ease-in-out var(--z) infinite alternate}
.sz-o.a-twinkle{animation:sz-twinkle var(--t) ease-in-out var(--z) infinite alternate}
.sz-o.a-spin{animation:sz-spin var(--t) linear var(--z) infinite}
.sz-o.a-hop,.sz-o.a-fly{animation:sz-across var(--t) linear var(--z) infinite}
.sz-o.a-hop>i,.sz-o.a-fly>i{display:inline-block;font-style:normal}
.sz-o.a-hop>i{animation:sz-hop .45s cubic-bezier(.3,0,.5,1) infinite alternate}
.sz-o.a-fly>i{animation:sz-bob 1.3s ease-in-out infinite alternate}
@keyframes sz-bob{to{transform:translateY(-12%)}}
@keyframes sz-sway{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
@keyframes sz-glow{from{transform:scale(1);filter:drop-shadow(0 0 0 rgba(255,170,40,0))}to{transform:scale(1.06);filter:drop-shadow(0 0 18px rgba(255,170,40,.9))}}
@keyframes sz-twinkle{from{opacity:.3;transform:scale(.85)}to{opacity:1;transform:scale(1.05)}}
@keyframes sz-spin{to{transform:rotate(360deg)}}
@keyframes sz-across{from{transform:translateX(0)}to{transform:translateX(-140vw)}}
@keyframes sz-hop{to{transform:translateY(-35%)}}
.sz-prepinac{position:fixed;left:8px;bottom:8px;z-index:2147483001;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.75);box-shadow:0 2px 8px rgba(0,0,0,.2);font-size:18px;line-height:34px;padding:0;cursor:pointer;opacity:.55;transition:opacity .2s}
.sz-prepinac:hover,.sz-prepinac:focus-visible{opacity:1}
.sz-skryte .sz-pozadi{display:none}
@media (max-width:700px){.sz-pozadi .sz-o{opacity:.45}}
@media (prefers-reduced-motion:reduce){.sz-pozadi span,.sz-pozadi i{animation:none!important}}
`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  function obrazek([e, size, pos, pohyb, t, z, opts = {}], dite) {
    const el = document.createElement('span');
    el.className = 'sz-o a-' + pohyb + (opts.bily ? ' bily' : '');
    el.style.cssText = pos;
    el.style.setProperty(dite ? '--k' : '--s', size);
    el.style.setProperty('--t', t + 's');
    el.style.setProperty('--z', z + 's');
    if (pohyb === 'hop' || pohyb === 'fly') {
      const inner = document.createElement('i');
      inner.textContent = e;
      el.append(inner);
    } else {
      el.textContent = e;
    }
    for (const d of opts.deti || []) el.append(obrazek(d, true));
    return el;
  }

  // Ozdoby za obsahem jsou vidět jen tam, kde stránka nemá vlastní pozadí. Když má pozadí
  // <html> i <body>, pozadí body by je zakrylo – proto se pozadí body přesune na <html>.
  function pozadiNaHtml() {
    const html = document.documentElement;
    const has = cs => cs.backgroundImage !== 'none' || !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(cs.backgroundColor);
    const b = getComputedStyle(document.body);
    if (!has(getComputedStyle(html)) || !has(b)) return;
    for (const prop of ['background-color', 'background-image', 'background-size', 'background-position', 'background-repeat', 'background-attachment']) {
      html.style.setProperty(prop, b.getPropertyValue(prop));
    }
    document.body.style.background = 'transparent';
  }

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
    pozadiNaHtml();

    const layer = document.createElement('div');
    layer.className = 'sz-pozadi';
    layer.setAttribute('aria-hidden', 'true');
    for (const item of SCENY[svatek.id] || []) layer.append(obrazek(item));

    const padani = document.createElement('div');
    padani.className = 'sz-padani sz-' + svatek.pohyb;
    const count = svatek.pohyb === 'float' ? (home ? 14 : 9) : (home ? 22 : 14);
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.textContent = svatek.ozdoby[i % svatek.ozdoby.length];
      s.style.fontSize = (16 + Math.random() * 18) + 'px';
      s.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
      if (svatek.pohyb === 'float') {
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
      padani.append(s);
    }
    layer.append(padani);
    document.body.prepend(layer);

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
