/* Пас — лендинг. Контакти клієнта вписати тут (порожні поля на сайті не показуються). */
const CONFIG = {
  phone: '',        // напр. '+380 67 123 45 67'
  telegram: '',     // username без @, напр. 'dmitriy_barsuk'
  instagram: '',    // напр. 'pas.zaklady'
  tiktok: ''        // напр. 'pas.zaklady'
};

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const isMob = () => innerWidth <= 860;
  if (reduce) document.documentElement.classList.add('reduce');
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const go = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    lenis ? lenis.scrollTo(el, { offset: 0, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' });
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const h = a.getAttribute('href'); if (h.length < 2) return;
    e.preventDefault();
    if (h === '#kontakt' && !a.closest('.mnav')) { window.__openModal && window.__openModal(e); return; }
    if (h === '#kontakt') { document.body.classList.remove('menu-open'); window.__openModal && window.__openModal(e); return; } document.body.classList.remove('menu-open'); lenis && lenis.start(); go(h);
  }));

  /* ---------- contacts (only if filled) ---------- */
  const cbox = $('#contacts');
  const addC = (href, text) => { const a = document.createElement('a'); a.href = href; a.className = 'btn btn--ghost mag'; a.textContent = text; if (/^http/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } cbox.appendChild(a); };
  const ph = CONFIG.phone, tg = CONFIG.telegram;
  addC(ph ? 'tel:' + ph.replace(/[^+\d]/g, '') : '#call', ph || 'Подзвонити');
  addC(tg ? 'https://t.me/' + tg : '#tg', 'Telegram');
  if (CONFIG.instagram) addC('https://instagram.com/' + CONFIG.instagram, 'Instagram');
  if (CONFIG.tiktok) addC('https://www.tiktok.com/@' + CONFIG.tiktok, 'TikTok');
  $$('.js-call').forEach(a => { if (ph) { a.href = 'tel:' + ph.replace(/[^+\d]/g, ''); const s = a.querySelector('span'); if (s) s.textContent = ph; } });
  $$('.js-tg').forEach(a => { if (tg) { a.href = 'https://t.me/' + tg; a.target = '_blank'; a.rel = 'noopener'; } });
  $$('a[href="#call"],a[href="#tg"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); e.stopImmediatePropagation(); document.body.classList.remove('menu-open'); window.__openModal && window.__openModal(e); }, true));

  /* ---------- split text ---------- */
  function split(el) {
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.textContent = part; w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return $$('.w>span', el);
  }
  const css = document.createElement('style');
  css.textContent = '[data-split] .w,.h1 .w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.24em;margin-bottom:-.24em}[data-split] .w>span,.h1 .w>span{display:inline-block}';
  document.head.appendChild(css);

  const h1Words = split($('.h1'));
  if (!reduce) gsap.set(h1Words, { yPercent: 110 });
  $$('[data-split]').forEach(el => {
    const ws = split(el);
    if (reduce) return;
    gsap.set(ws, { yPercent: 110 });
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => gsap.to(ws, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.045 }) });
  });

  /* ---------- reveals ---------- */
  if (!reduce) {
    ScrollTrigger.batch('[data-r]', { start: 'top 88%', once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08, overwrite: true }) });
  }

  /* ---------- count up ---------- */
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count; const from = end > 1000 ? end - 14 : 0;
    if (reduce) { el.textContent = end; return; }
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => {
      const o = { v: from }; gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => el.textContent = Math.round(o.v) });
    } });
  });

  /* ---------- preloader + hero intro ---------- */
  const heroIntro = () => {
    if (reduce) return;
    const tl = gsap.timeline();
    tl.to(h1Words, { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.06 })
      .from('.hero .label, .hero__p, .hero__cta, .hero__meta, .hero__facts', { opacity: 0, y: 24, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.25)
      .fromTo('#heroMedia', { '--k': 0 }, { '--k': 1, duration: 1.5, ease: 'expo.out' }, 0.1)
      .from('.hero__ring', { opacity: 0, rotate: -40, scale: .8, duration: 1.6, ease: 'expo.out' }, 0.3)
      .from('.hero__chef', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' }, 0.8)
      .from('.stage--1 img', { scale: 1.4, duration: 2, ease: 'expo.out' }, 0.1);
  };
  const pre = $('.pre');
  if (document.documentElement.classList.contains('no-pre') || !pre) { heroIntro(); }
  else {
    lenis && lenis.stop();
    const wait = Math.max(0, 950 - performance.now());
    const tl = gsap.timeline({ delay: wait / 1000, onComplete: () => { pre.remove(); lenis && lenis.start(); sessionStorage.setItem('pas-pre', 1); } });
    tl.to(pre, { yPercent: -100, duration: .6, ease: 'expo.inOut' })
      .add(heroIntro, '-=.4');
  }

  /* ---------- deferred hero images ---------- */
  const loadDeferred = () => $$('img[data-defer]').forEach(i => { if (i.dataset.srcset) i.srcset = i.dataset.srcset; i.src = i.dataset.src; i.removeAttribute('data-defer'); });
  if (document.readyState === 'complete') setTimeout(loadDeferred, 200); else addEventListener('load', () => setTimeout(loadDeferred, 200));
  addEventListener('scroll', loadDeferred, { once: true, passive: true });

  /* ---------- HERO scroll story ---------- */
  const media = $('#heroMedia'), pin = $('.hero__pin');
  function heroGeo() {
    const w = innerWidth, h = Math.max(innerHeight, 640);
    if (isMob()) {
      const ph = pin.offsetHeight || h, cta = $('.hero__facts') || $('.hero__cta');
      const cb = cta.offsetTop + cta.offsetHeight + $('.hero__copy').offsetTop;
      const r = Math.min(w * 0.42, 190, Math.max(120, (ph - cb - 40) / 1.7));
      let cy = cb + r + 68; if (ph - (cy - r) < 120) cy = ph - 120 + r;
      return { x: 50, y: cy / ph * 100, r };
    }
    return { x: 75.5, y: 53, r: Math.min(h * 0.3, w * 0.175, 320) };
  }
  let heroTL;
  function buildHero() {
    if (heroTL) { heroTL.scrollTrigger && heroTL.scrollTrigger.kill(); heroTL.kill(); }
    const g = heroGeo();
    pin.style.setProperty('--x', g.x + '%'); pin.style.setProperty('--y', g.y + '%'); pin.style.setProperty('--r0', g.r + 'px');
    media.style.setProperty('--r', g.r + 'px');
    if (reduce) return;
    const R = Math.hypot(innerWidth, innerHeight);
    gsap.set('.stage--2,.stage--3', { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set('.cap', { opacity: 0, y: 30 }); gsap.set('.hero__end', { opacity: 0 }); gsap.set('.hero__steps', { opacity: 0 });
    gsap.set('.hero__steps i b', { scaleY: 0 });
    heroTL = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.hero', refreshPriority: 10, start: 'top top', end: () => '+=' + innerHeight * (isMob() ? 3.6 : 4.2), pin: true, scrub: 0.8, anticipatePin: 1,
        onUpdate: s => document.getElementById('hdr').classList.toggle('on-dark', s.progress > 0.12 && s.progress < 0.995) }
    });
    heroTL
      .fromTo(media, { '--r': g.r + 'px', '--x': g.x + '%', '--y': g.y + '%' }, { '--r': R + 'px', '--x': '50%', '--y': '50%', duration: 1, ease: 'power2.inOut' }, 0)
      .to('.hero__copy', { opacity: 0, y: -90, duration: .55, ease: 'power1.in' }, 0)
      .to('.hero__ring', { opacity: 0, scale: 1.6, duration: .5 }, 0)
      .to('.hero__chef,.scrollhint', { opacity: 0, duration: .25 }, 0)
      .fromTo('.stage--1 img', { scale: 1.15 }, { scale: 1, duration: 1.6 }, 0)
      .fromTo('.stage--1', { '--sh': 0 }, { '--sh': 1, duration: .7 }, .25)
      .to('.cap.c1', { opacity: 1, y: 0, duration: .35 }, .75)
      .to('.hero__steps', { opacity: 1, duration: .3 }, .8)
      .to('.stage--2', { clipPath: 'inset(0% 0% 0% 0%)', duration: .9, ease: 'power2.inOut' }, 1.6)
      .fromTo('.stage--2 img', { scale: 1.3, yPercent: 8 }, { scale: 1.05, yPercent: 0, duration: 1.5 }, 1.6)
      .to('.hero__steps i:nth-of-type(1) b', { scaleY: 1, duration: .9 }, 1.6)
      .to('.cap.c1', { opacity: 0, y: -30, duration: .3 }, 1.7)
      .to('.cap.c2', { opacity: 1, y: 0, duration: .35 }, 2.1)
      .to('.stage--3', { clipPath: 'inset(0% 0% 0% 0%)', duration: .9, ease: 'power2.inOut' }, 3)
      .fromTo('.stage--3 img', { scale: 1.3, filter: 'brightness(.35) saturate(.6)' }, { scale: 1.02, filter: 'brightness(1.02) saturate(1.1)', duration: 1.5 }, 3)
      .to('.hero__steps i:nth-of-type(2) b', { scaleY: 1, duration: .9 }, 3)
      .to('.cap.c2', { opacity: 0, y: -30, duration: .3 }, 3.1)
      .to('.cap.c3', { opacity: 1, y: 0, duration: .35 }, 3.5)
      .to('.cap.c3,.hero__steps', { opacity: 0, duration: .3 }, 4.4)
      .to('.hero__end', { opacity: 1, duration: .45 }, 4.5)
      .from('.hero__end h2,.hero__end p,.hero__end .mono', { y: 40, stagger: .08, duration: .4 }, 4.5)
      .to({}, { duration: .5 });
  }
  buildHero();
  document.fonts && document.fonts.ready.then(() => { if (isMob()) buildHero(); ScrollTrigger.sort(); ScrollTrigger.refresh(); });

  /* ---------- formats rail ---------- */
  const fm = [['01', 'Шаурма', 'від 20 м²'], ['02', 'Бургерна', 'фастфуд'], ['03', 'Кав’ярня', 'кава + десерт'], ['04', 'Піцерія', 'зал + доставка'], ['05', 'Суші', 'доставка'], ['06', 'Пекарня', 'виробництво'], ['07', 'Чебуречна', 'стрітфуд'], ['08', 'Dark kitchen', 'лише доставка'], ['09', 'Кафе при ЖК', 'гості поруч'], ['10', 'Паб', 'фуд-корт / ТРЦ'], ['11', 'Ресторан', 'повний цикл'], ['12', 'Кондитерська', 'десерти'], ['13', 'Крепи', 'стрітфуд'], ['14', 'Ваш формат', 'індивідуально']];
  const rail = $('#rail');
  rail.innerHTML = [...fm, ...fm].map(f => `<div class="tk"><span>ТІКЕТ ${f[0]}</span><b>${f[1]}</b><i>${f[2]}</i></div>`).join('');
  if (!reduce) {
    const tks = $$('.tk', rail);
    const rot = gsap.quickTo(tks, 'rotation', { duration: .8, ease: 'elastic.out(1,0.35)' });
    ScrollTrigger.create({ trigger: '.rail', start: 'top bottom', end: 'bottom top', onUpdate: s => { rot(gsap.utils.clamp(-9, 9, -s.getVelocity() / 260)); clearTimeout(rail._t); rail._t = setTimeout(() => rot(0), 90); } });
  }

  /* ---------- tear-off format tickets ---------- */
  const KIND = { 'Шаурма': 'Стрітфуд', 'Бургерна': 'Стрітфуд', 'Чебуречна': 'Стрітфуд', 'Крепи': 'Стрітфуд', 'Кав’ярня': 'Кав’ярня', 'Кафе при ЖК': 'Кафе', 'Піцерія': 'Піцерія / суші', 'Суші': 'Піцерія / суші', 'Паб': 'Ресторан / паб', 'Ресторан': 'Ресторан / паб' };
  const hint = document.createElement('p'); hint.className = 'rail__hint'; hint.innerHTML = '<span>↓</span> Зірвіть тікет свого формату — і заявка готова'; $('.rail').appendChild(hint);
  let tearing = false;
  function tear(tk, ev) {
    if (tearing || tk.classList.contains('tk--torn')) return; tearing = true;
    const name = tk.querySelector('b').textContent, no = tk.querySelector('span').textContent.replace('ТІКЕТ ', '');
    const r = tk.getBoundingClientRect(), c = tk.cloneNode(true);
    Object.assign(c.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', margin: '0', zIndex: 1500, pointerEvents: 'none', animation: 'none' });
    c.classList.add('tk--fly'); document.body.appendChild(c); tk.classList.add('tk--torn');
    if (reduce) c.remove(); else gsap.timeline({ onComplete: () => c.remove() })
      .to(c, { rotation: gsap.utils.random(-9, 9), y: -6, duration: .12, ease: 'power1.out' })
      .to(c, { y: 70, rotation: gsap.utils.random(-22, 22), duration: .5, opacity: 0, ease: 'power2.in' });
    if (window.__pasSet) { const k = KIND[name] || 'Інше'; window.__pasSet(window.__pasSt ? window.__pasSt.a : 1, k, window.__pasSt ? window.__pasSt.p : 'вже є'); }
    setTimeout(() => {
      window.__openModal && window.__openModal({ clientX: r.left + r.width / 2, clientY: r.top + r.height });
      const fk = document.getElementById('mf-kind'); const k = KIND[name] || 'Інше';
      if (fk) [...fk.options].forEach((o, i) => { if (o.text === k) fk.selectedIndex = i; });
      const mk = document.getElementById('m-kind'); if (mk) mk.textContent = name;
      const m = document.getElementById('mf-msg'); if (m) m.value = 'Формат: ' + name + ' (тікет ' + no + ').';
    }, reduce ? 0 : 420);
    setTimeout(() => { tk.classList.remove('tk--torn'); tearing = false; }, 3200);
  }
  let drag = null;
  rail.addEventListener('pointerdown', e => { const tk = e.target.closest('.tk'); if (tk && e.pointerType !== 'touch') drag = { tk, y: e.clientY, x: e.clientX, done: false }; });
  window.addEventListener('pointermove', e => { if (drag && !drag.done && e.clientY - drag.y > 28) { drag.done = true; tear(drag.tk, e); } });
  window.addEventListener('pointerup', () => { setTimeout(() => { drag = null; }, 0); });
  rail.addEventListener('click', e => { const tk = e.target.closest('.tk'); if (!tk || (drag && drag.done)) return; tear(tk, e); });

  /* ---------- chef parallax ---------- */
  if (!reduce) {
    $$('[data-par]').forEach(img => gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } }));
    gsap.fromTo('.chef__media .sub', { y: 80 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '#shef', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* ---------- projects horizontal ---------- */
  const track = $('#ptrack'), pnum = $('#pnum');
  const cards = $$('.pc', track);
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    if (reduce) return;
    const dist = () => track.scrollWidth - innerWidth;
    const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.proj', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: s => { pnum.textContent = String(Math.min(cards.length, Math.floor(s.progress * cards.length) + 1)).padStart(2, '0'); } } });
    $$('.pc__img img', track).forEach(img => gsap.to(img, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, containerAnimation: tw, start: 'left right', end: 'center center', scrub: true } }));
    return () => {};
  });
  mm.add('(max-width: 860px)', () => {
    const on = () => { const c = track.scrollLeft + track.clientWidth / 2; let k = 0; cards.forEach((el, i) => { if (el.offsetLeft < c) k = i; }); pnum.textContent = String(k + 1).padStart(2, '0'); };
    track.addEventListener('scroll', on, { passive: true });
    return () => track.removeEventListener('scroll', on);
  });

  /* ---------- video autoplay in view ---------- */
  $$('video[data-auto]').forEach(v => new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
  }), { threshold: .25 }).observe(v));

  /* ---------- before / after ---------- */
  const ba = $('#ba');
  if (ba) {
    let drag = false;
    const set = (p) => { p = Math.max(4, Math.min(96, p)); ba.style.setProperty('--p', p + '%'); ba.setAttribute('aria-valuenow', Math.round(p)); };
    const at = (x) => { const r = ba.getBoundingClientRect(); set((x - r.left) / r.width * 100); };
    ba.addEventListener('pointerdown', e => { drag = true; ba.setPointerCapture(e.pointerId); at(e.clientX); });
    ba.addEventListener('pointermove', e => { if (drag) at(e.clientX); else if (fine) at(e.clientX); });
    ba.addEventListener('pointerup', () => drag = false);
    ba.addEventListener('keydown', e => { const v = parseFloat(getComputedStyle(ba).getPropertyValue('--p')) || 50; if (e.key === 'ArrowLeft') set(v - 5); if (e.key === 'ArrowRight') set(v + 5); });
    if (!reduce) { const o = { p: 92 }; ScrollTrigger.create({ trigger: ba, start: 'top 70%', once: true, onEnter: () => gsap.to(o, { p: 50, duration: 1.8, ease: 'expo.inOut', onUpdate: () => set(o.p) }) }); set(92); }
  }


  /* ---------- MENU BOOK v2 ---------- */
  const DISHES = [
    ['d-duck', 'Качина ніжка з грушею', 'Глазурована ніжка, червона груша, журавлина й зелена олія.', 'ресторан', 'на тарілці'],
    ['d-tartare', 'Тартар у кокосі', 'Подача в половинці кокоса з фізалісом і чорною хрусткою «рибкою».', 'ресторан, бар', 'кокос'],
    ['d-mussels', 'Мідії з димом', 'Виносять до столу в хмарі сухого льоду — страву знімають на телефон.', 'ресторан, паб', 'шоу-подача'],
    ['d-shrimp', 'Креветки на грилі', 'Тигрові креветки з лаймом на білому камінні.', 'ресторан', 'на камінні'],
    ['d-pasta', 'Паста з креветками', 'Тальятеле, зелений соус, в’ялені томати й сир.', 'кафе, ресторан', 'глибока тарілка'],
    ['d-burger', 'Бургер на чорній булці', 'Котлета, бекон, сир, томат і листя салату.', 'бургерна, паб', 'стрітфуд'],
    ['d-camembert', 'Камамбер на грилі', 'З вишнею, мигдалем і їстівними квітами.', 'кафе, бар', 'закуска'],
    ['d-skewer', 'Шашлички з лосося', 'З черрі й лимоном, на лаваші — швидка подача.', 'стрітфуд, фуд-корт', 'на дошці'],
    ['d-canape', 'Фуршетні канапе', 'Креветка на кокосовій кульці — для подій і кейтерингу.', 'кейтеринг, кафе', 'фуршет']
  ];
  const ND = DISHES.length, bookEl = $('#book'), leavesEl = $('#leaves');
  const pad = n => String(n).padStart(2, '0');
  const ptH = (d, i) => `<div class="pt"><span class="mono">№ ${pad(i + 1)} · страва шефа</span><h3>${d[1]}</h3><p class="d">${d[2]}</p><div class="rows"><div class="mrow"><b>Формат</b><span>${d[3]}</span></div><div class="mrow"><b>Подача</b><span>${d[4]}</span></div></div><div class="ft"><span>Пас · меню</span><span>${pad(i + 1)}</span></div></div>`;
  const ppH = d => `<div class="pp"><img src="img/${d[0]}-m.webp" decoding="async" alt="${d[1]}" loading="lazy" draggable="false"><span>${d[1]}</span></div>`;
  const mDish = (d, i) => `<div class="mdish"><div class="mdish__im">${ppH(d)}</div><div class="mdish__tx">${ptH(d, i)}</div></div>`;
  const endH = `<div class="pend"><span class="mono">наступна сторінка</span><h3>Тут буде <em>ваше меню</em></h3><p>Під ваш формат і собівартість — з техкартами для команди.</p><a href="#kontakt" class="btn btn--red"><svg class="bell"><use href="#bell"/></svg>Замовити меню</a></div>`;
  const coverH = `<div class="cov"><svg><use href="#mark"/></svg><b>МЕНЮ</b><span>шефа Дмитра Барсука</span><i>відкрийте →</i></div>`;
  const insideH = `<div class="inside"><span class="mono">Пас · меню шефа</span><h3>9 страв, які відкривають заклад</h3><p>Кожну страву шеф доводить до техкарти: склад, вихід, собівартість, подача. Так само — для вашого меню.</p></div>`;
  let lv = [], bidx = 0, single = false; var bookVis = false;
  function buildBook() {
    const s = innerWidth <= 900; single = s; bidx = 0; leavesEl.innerHTML = ''; bookEl.classList.remove('open');
    $('#bookR').innerHTML = endH;
    const pages = [];
    if (!s) {
      pages.push([coverH, ppH(DISHES[0])]);
      DISHES.forEach((d, i) => pages.push([ptH(d, i), i < ND - 1 ? ppH(DISHES[i + 1]) : '<div class="pend"><span class="mono">кінець меню</span><h3>Смачного <em>відкриття</em></h3></div>']));
    } else {
      pages.push([coverH, '']);
      DISHES.forEach((d, i) => pages.push([mDish(d, i), '']));
    }
    lv = pages.map((p, i) => { const el = document.createElement('div'); el.className = 'b2__lf'; el.innerHTML = `<div class="b2__f">${p[0]}<i class="b2__sh"></i></div><div class="b2__f b2__f--b">${p[1]}<i class="b2__sh"></i></div>`; leavesEl.appendChild(el); return el; });
    lv.forEach((l, i) => { gsap.set(l, { rotationY: 0, zIndex: lv.length - i, opacity: 1 }); setR(l, 0); });
    gsap.set(bookEl, { x: s ? 0 : () => -bookEl.offsetWidth / 4 });
    $$('a[href="#kontakt"]', bookEl).forEach(a => a.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); window.__openModal(e); }));
    bupNav();
  }
  const setR = (l, r) => { gsap.set(l, { rotationY: r }); const fr = l.children[0], bk = l.children[1]; const showBack = r < -90; fr.style.visibility = showBack ? 'hidden' : 'visible'; bk.style.visibility = showBack ? 'visible' : 'hidden'; const k = Math.sin(Math.abs(r) * Math.PI / 180); $$('.b2__sh', l).forEach(x => x.style.opacity = (k * .35).toFixed(3)); };
  function bupNav() {
    $('#bkCnt').textContent = bidx === 0 ? 'Обкладинка' : bidx > ND ? 'Кінець' : `Сторінка ${pad(bidx)} / ${pad(ND)}`;
    $('#bkPrev').disabled = bidx === 0; $('#bkNext').disabled = bidx >= lv.length;
  }
  function setOpen(o) {
    if (bookEl.classList.contains('open') === o) return; bookEl.classList.toggle('open', o);
    if (!single) gsap.to(bookEl, { x: o ? 0 : -bookEl.offsetWidth / 4, duration: .9, ease: 'power3.inOut' });
  }
  function flip(i, dir, from) {
    const l = lv[i]; if (!l) return; const o = { r: from !== undefined ? from : (dir > 0 ? 0 : -180) };
    if (single && dir < 0) gsap.set(l, { opacity: 1 });
    l.style.pointerEvents = 'none';
    gsap.set(l, { zIndex: 300 + i });
    gsap.to(o, { r: dir > 0 ? -180 : 0, duration: reduce ? 0 : (i === 0 ? 1.1 : .9), ease: 'power2.inOut', onUpdate: () => setR(l, o.r),
      onComplete: () => { gsap.set(l, { zIndex: dir > 0 ? 100 + i : lv.length - i }); if (single && dir > 0) gsap.to(l, { opacity: 0, duration: .25 }); l.style.pointerEvents = (single && dir > 0) ? 'none' : ''; } });
  }
  const bNext = () => { if (bidx >= lv.length) return; if (bidx === 0) setOpen(true); flip(bidx, 1); bidx++; bupNav(); $('#bkHint').style.opacity = 0; };
  const bPrev = () => { if (bidx <= 0) return; bidx--; flip(bidx, -1); if (bidx === 0) setTimeout(() => setOpen(false), 350); bupNav(); };
  $('#bkNext').addEventListener('click', bNext); $('#bkPrev').addEventListener('click', bPrev);
  bookEl.addEventListener('keydown', e => { if (e.key === 'ArrowRight') bNext(); if (e.key === 'ArrowLeft') bPrev(); });
  // hover tease on cover
  bookEl.addEventListener('mouseenter', () => { if (bidx === 0 && fine && !reduce) { const o = { r: 0 }; gsap.to(o, { r: -16, duration: .6, ease: 'power2.out', onUpdate: () => setR(lv[0], o.r) }); } });
  bookEl.addEventListener('mouseleave', () => { if (bidx === 0 && fine && !reduce && !bdrag) { const o = { r: gsap.getProperty(lv[0], 'rotationY') }; gsap.to(o, { r: 0, duration: .7, ease: 'elastic.out(1,0.5)', onUpdate: () => setR(lv[0], o.r) }); } });
  // click / drag
  let bdrag = null;
  bookEl.addEventListener('pointerdown', e => { if (e.target.closest('a,button')) return; bdrag = { x: e.clientX, y: e.clientY, w: (single ? bookEl.offsetWidth : bookEl.offsetWidth / 2), dir: 0, l: null, r: 0, moved: false, side: e.clientX > bookEl.getBoundingClientRect().left + bookEl.offsetWidth / 2 }; });
  addEventListener('pointermove', e => {
    if (!bdrag) return; const dx = e.clientX - bdrag.x, dy = e.clientY - bdrag.y;
    if (!bdrag.dir) { if (Math.abs(dx) < 8 || Math.abs(dy) > Math.abs(dx)) { if (Math.abs(dy) > 12) bdrag = null; return; } bdrag.dir = dx < 0 ? 1 : -1; bdrag.l = bdrag.dir > 0 ? lv[bidx] : lv[bidx - 1]; if (!bdrag.l) { bdrag = null; return; } if (bdrag.dir > 0 && bidx === 0) setOpen(true); gsap.set(bdrag.l, { zIndex: 400, opacity: 1 }); }
    const p = gsap.utils.clamp(0, 1, (bdrag.dir > 0 ? -dx : dx) / (bdrag.w * 1.5));
    bdrag.r = bdrag.dir > 0 ? -180 * p : -180 * (1 - p); setR(bdrag.l, bdrag.r); bdrag.moved = true;
  });
  addEventListener('pointerup', () => {
    if (!bdrag) return; const d = bdrag; bdrag = null;
    if (!d.l) { if (!d.moved) { (single || d.side || bidx === 0) ? bNext() : bPrev(); } return; }
    const i = lv.indexOf(d.l);
    if (d.dir > 0) { if (d.r < -50) { flip(i, 1, d.r); bidx++; } else { flip(i, -1, d.r); if (bidx === 0) setOpen(false); } }
    else { if (d.r > -130) { flip(i, -1, d.r); bidx--; if (bidx === 0) setTimeout(() => setOpen(false), 350); } else flip(i, 1, d.r); }
    bupNav(); $('#bkHint').style.opacity = 0;
  });
  buildBook();
  new IntersectionObserver(es => es.forEach(e => { bookVis = e.isIntersecting; }), { rootMargin: '-10% 0px -10% 0px' }).observe(bookEl);
  let bw = innerWidth; addEventListener('resize', () => { if (Math.abs(innerWidth - bw) > 2) { bw = innerWidth; buildBook(); } });
  if (!reduce) gsap.to('.ribbon', { rotation: 3, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  /* ---------- menu rows ---------- */
  if (!reduce) ScrollTrigger.batch('.mrow', { start: 'top 92%', once: true, onEnter: b => gsap.from(b, { opacity: 0, x: -20, duration: .7, stagger: .05, ease: 'power3.out' }) });

  /* ---------- step tickets drop ---------- */
  if (!reduce) {
    gsap.set('.st', { y: -90, opacity: 0, rotation: i => (i % 2 ? 9 : -9) });
    ScrollTrigger.create({ trigger: '.steps', start: 'top 80%', once: true, onEnter: () => gsap.to('.st', { y: 0, opacity: 1, rotation: 0, duration: 1.6, ease: 'elastic.out(1,0.45)', stagger: .12 }) });
    if (fine) $$('.st').forEach(s => { s.addEventListener('mouseenter', () => gsap.to(s, { rotation: gsap.utils.random(-4, 4), duration: .9, ease: 'elastic.out(1,0.3)' })); s.addEventListener('mouseleave', () => gsap.to(s, { rotation: 0, duration: 1.2, ease: 'elastic.out(1,0.3)' })); });
  }

  /* ---------- calculator ---------- */
  const PRICE = [2800, 3300, 3600, 4800];
  const INV = ['$10 000 – 18 000', '$15 000 – 25 000', '$20 000 – 40 000', '$35 000 – 65 000'];
  const AREA = ['до 20 м²', '20–40 м²', '40–60 м²', '60–80 м²'];
  const st8 = { a: 0, k: 'Стрітфуд', p: 'вже є' };
  const bill = $('#bill'), bp = $('#b-price');
  const mask = document.createElement('div'); mask.style.cssText = 'overflow:hidden;padding:0 0 14px;margin-top:-9px'; bill.parentNode.insertBefore(mask, bill); mask.appendChild(bill); bill.style.margin = '0 auto';
  let shown = PRICE[0], priceTw = null;
  const mini = $('#mini');
  const fmt$ = v => '$' + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  let prev = { a: 0, k: 'Стрітфуд', p: 'вже є' };
  function render(print) {
    const changed = []; if (prev.a !== st8.a) changed.push('#b-area', '#b-inv'); if (prev.k !== st8.k) changed.push('#b-kind'); if (prev.p !== st8.p) changed.push('#b-place');
    prev = { ...st8 };
    changed.forEach(id => { const r = $(id).parentNode; r.classList.remove('hl'); void r.offsetWidth; r.classList.add('hl'); });
    $('#mi-sum').textContent = AREA[st8.a] + ' · ' + st8.k;
    $('#b-area').textContent = AREA[st8.a]; $('#b-kind').textContent = st8.k; $('#b-place').textContent = st8.p; $('#b-inv').textContent = INV[st8.a];
    const no = String(1000 + Math.floor(Math.random() * 8999)); $('#bno').textContent = no; $('#mi-no').textContent = no;
    const o = { v: shown }; priceTw && priceTw.kill(); priceTw = gsap.to(o, { v: PRICE[st8.a], duration: .8, ease: 'power2.out', onUpdate: () => { bp.textContent = fmt$(o.v); $('#mi-price').textContent = fmt$(o.v); } }); shown = PRICE[st8.a];
    if (print && !reduce && mini.classList.contains('show')) { gsap.fromTo(mini, { y: -14, rotation: gsap.utils.random(-2.5, 2.5) }, { y: 0, rotation: 0, duration: 1, ease: 'elastic.out(1,0.35)' }); gsap.fromTo('#mi-price', { color: '#E9A94B' }, { color: '#C93A20', duration: .8 }); }
    if (print && !reduce) gsap.fromTo(bill, { yPercent: -100 }, { yPercent: 0, duration: 1.1, ease: 'steps(9)' });
  }
  const segs = (id, fn) => $$(`#${id} button`).forEach((b, i) => b.addEventListener('click', () => { $$(`#${id} button`).forEach(x => x.classList.remove('on')); b.classList.add('on'); fn(b, i); render(true); }));
  segs('area', (b, i) => st8.a = i); segs('kind', b => st8.k = b.textContent); segs('place', b => st8.p = b.textContent.toLowerCase());
  render(false);
  if (!reduce) { gsap.set(bill, { yPercent: -100 }); ScrollTrigger.create({ trigger: '.printer', start: 'top 75%', once: true, onEnter: () => gsap.to(bill, { yPercent: 0, duration: 1.4, ease: 'steps(10)' }) }); }
  $('#sendBill').addEventListener('click', (e) => {
    e.preventDefault(); e.stopImmediatePropagation(); openModal(e);
    const fa = $('#f-area'), fk = $('#f-kind');
    fa.selectedIndex = st8.a; [...fk.options].forEach((o, i) => { if (o.text === st8.k) fk.selectedIndex = i; });
    const m = $('#f-msg'); if (!m.value) m.value = `Приміщення: ${st8.p}. Попередній чек: ${AREA[st8.a]}, ${st8.k}, послуги $${PRICE[st8.a]}.`;
  });


  /* ---------- mini live ticket (mobile) ---------- */
  let inCalc = false, billVis = false;
  const upMini = () => { const on = inCalc && !billVis; mini.classList.toggle('show', on); document.body.classList.toggle('mini-on', on); };
  new IntersectionObserver(es => es.forEach(e => { inCalc = e.isIntersecting; upMini(); }), { rootMargin: '-25% 0px -25% 0px' }).observe($('.calc__f') || $('.phone'));
  new IntersectionObserver(es => es.forEach(e => { billVis = e.isIntersecting; upMini(); }), { threshold: .2 }).observe($('.printer'));
  $('#mi-go').addEventListener('click', e => openModal(e));
  $('#mini').addEventListener('click', e => { if (e.target.closest('#mi-go')) return; go('.printer'); });

  /* ---------- MODAL ---------- */
  const modal = $('#modal'), panel = $('.modal__panel', modal), mform = $('#mform');
  const fillTicket = (flash) => {
    const set = (id, v) => { const el = $(id); if (el.textContent !== v) { el.textContent = v; if (flash) { const r = el.parentNode; r.classList.remove('hl'); void r.offsetWidth; r.classList.add('hl'); } } };
    set('#m-kind', st8.k); set('#m-area', AREA[st8.a]); set('#m-place', st8.p); set('#m-inv', INV[st8.a]); set('#m-price', fmt$(PRICE[st8.a]));
    $('#mf-area').selectedIndex = st8.a;
    [...$('#mf-kind').options].forEach((o, i) => { if (o.text === st8.k) $('#mf-kind').selectedIndex = i; });
    $('#mf-place').selectedIndex = st8.p === 'вже є' ? 0 : 1;
  };
  const syncCalcButtons = () => {
    $$('#area button').forEach((b, i) => b.classList.toggle('on', i === st8.a));
    $$('#kind button').forEach(b => b.classList.toggle('on', b.textContent === st8.k));
    $$('#place button').forEach(b => b.classList.toggle('on', b.textContent.toLowerCase() === st8.p));
  };
  $('#mf-area').addEventListener('change', e => { st8.a = e.target.selectedIndex; fillTicket(true); syncCalcButtons(); render(false); });
  $('#mf-kind').addEventListener('change', e => { st8.k = e.target.value; fillTicket(true); syncCalcButtons(); render(false); });
  $('#mf-place').addEventListener('change', e => { st8.p = e.target.value; fillTicket(true); syncCalcButtons(); render(false); });
  let lastFocus = null, isOpen = false;
  function openModal(ev) {
    if (isOpen) return; isOpen = true; lastFocus = document.activeElement;
    fillTicket(false); $('#m-no').textContent = String(Math.floor(Math.random() * 900) + 100).padStart(4, '0');
    mform.classList.remove('sent'); gsap.set('#mstamp', { opacity: 0 });
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    lenis && lenis.stop(); document.documentElement.style.overflow = 'hidden';
    const r = panel.getBoundingClientRect();
    const cx = ev && ev.clientX ? ev.clientX - r.left : r.width / 2, cy = ev && ev.clientY ? ev.clientY - r.top : r.height / 2;
    panel.style.setProperty('--cx', cx + 'px'); panel.style.setProperty('--cy', cy + 'px');
    const R = Math.hypot(Math.max(cx, r.width - cx), Math.max(cy, r.height - cy)) + 20;
    if (reduce) { gsap.set('.modal__bg', { opacity: 1 }); gsap.set(panel, { clipPath: 'none' }); $('#mf-name').focus(); return; }
    gsap.timeline()
      .to('.modal__bg', { opacity: 1, duration: .45, ease: 'power2.out' }, 0)
      .fromTo(panel, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${R}px at ${cx}px ${cy}px)`, duration: .85, ease: 'expo.inOut' }, 0)
      .fromTo('.modal__left > .mono, .modal__left h3', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: .07, duration: .7, ease: 'power3.out' }, .35)
      .fromTo('#mbill', { yPercent: -102 }, { yPercent: 0, duration: 1.1, ease: 'steps(9)' }, .55)
      .fromTo('.modal__right > *, #mform > *:not(.ok)', { y: 26, opacity: 0 }, { y: 0, opacity: 1, stagger: .05, duration: .6, ease: 'power3.out' }, .45)
      .fromTo('.chips span', { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, duration: .5 }, 1)
      .add(() => { if (fine) $('#mf-name').focus({ preventScroll: true }); }, .9);
  }
  function closeModal() {
    if (!isOpen) return; isOpen = false;
    const done = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.documentElement.style.overflow = ''; lenis && lenis.start(); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); };
    if (reduce) return done();
    const r = panel.getBoundingClientRect();
    gsap.timeline({ onComplete: done })
      .to(panel, { clipPath: `circle(0px at ${r.width / 2}px ${r.height / 2}px)`, duration: .6, ease: 'expo.in' }, 0)
      .to('.modal__bg', { opacity: 0, duration: .5 }, .15);
  }
  window.__openModal = openModal;
  $$('.hero__cta a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); e.stopImmediatePropagation(); openModal(e); }, true));
  window.__pasSet = (a, k, p) => { st8.a = a; st8.k = k; st8.p = p; syncCalcButtons(); render(false); };
  window.__pasChat = (st, known, print) => {
    st8.a = st.a; st8.k = st.k; st8.p = st.p; render(print);
    const dash = '—';
    if (!known.k) { $('#b-kind').textContent = dash; }
    if (!known.a) { $('#b-area').textContent = known.aSkip ? 'уточнимо' : dash; $('#b-inv').textContent = known.aSkip ? 'залежить від площі' : dash; }
    if (!known.a && !known.aSkip) { priceTw && priceTw.kill(); bp.textContent = '$ —'; $('#mi-price').textContent = '$ —'; shown = PRICE[0]; }
    if (known.aSkip) { priceTw && priceTw.kill(); bp.textContent = 'від ' + fmt$(PRICE[0]); $('#mi-price').textContent = 'від ' + fmt$(PRICE[0]); }
    if (!known.p) $('#b-place').textContent = dash;
    $('#b-when').textContent = known.w || dash;
    const bf = $('#b-for'); bf.textContent = known.n ? 'для «' + known.n + '»' : ''; bf.classList.toggle('on', !!known.n);
    $('#mi-sum').textContent = [known.n ? '«' + known.n + '»' : (known.k ? st.k : ''), known.a ? AREA[st.a] : ''].filter(Boolean).join(' · ') || 'Відповідайте шефу';
  };
  $$('[data-close]', modal).forEach(b => b.addEventListener('click', closeModal));
  addEventListener('keydown', e => {
    if (!isOpen) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') { const f = $$('button,input,select,textarea,a[href]', panel).filter(x => x.offsetParent); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  mform.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#mf-name'), tel = $('#mf-tel'); let ok = true;
    [name, tel].forEach(f => { const bad = !f.value.trim() || (f === tel && f.value.replace(/\D/g, '').length < 9); f.style.borderColor = bad ? 'var(--red)' : ''; if (bad) ok = false; });
    if (!ok) { gsap.fromTo('.modal__right', { x: -10 }, { x: 0, duration: .6, ease: 'elastic.out(1,0.3)' }); return; }
    const text = `Заявка з сайту «Пас»\nІм’я: ${name.value}\nТелефон: ${tel.value}\nФормат: ${st8.k}\nПлоща: ${AREA[st8.a]}\nПриміщення: ${st8.p}\nПослуги: ${fmt$(PRICE[st8.a])}\n${$('#mf-msg').value}`;
    if (CONFIG.telegram) window.open('https://t.me/' + CONFIG.telegram + '?text=' + encodeURIComponent(text), '_blank');
    const tl = gsap.timeline();
    tl.fromTo('#mstamp', { opacity: 0, scale: 3.2, rotation: -32 }, { opacity: 1, scale: 1, rotation: -14, duration: .45, ease: 'back.out(2.5)' })
      .fromTo('#mbill', { x: 0 }, { keyframes: { x: [-6, 5, -3, 0] }, duration: .35 }, '-=.12')
      .add(() => { mform.classList.add('sent'); gsap.from('#mform .ok', { y: 30, opacity: 0, duration: .7, ease: 'back.out(2)' }); gsap.fromTo('#mform .ok .bell', { rotation: 0 }, { keyframes: { rotation: [18, -14, 9, -5, 0] }, duration: .9, delay: .2 }); }, '+=.15');
  });

  /* ---------- FAQ ---------- */
  $$('.q').forEach(q => {
    const btn = $('button', q), a = $('.q__a', q);
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const open = !q.classList.contains('open');
      $$('.q.open').forEach(o => { if (o !== q) { o.classList.remove('open'); $('button', o).setAttribute('aria-expanded', 'false'); gsap.to($('.q__a', o), { height: 0, duration: .5, ease: 'power3.inOut' }); } });
      q.classList.toggle('open', open); btn.setAttribute('aria-expanded', open);
      gsap.to(a, { height: open ? 'auto' : 0, duration: .55, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() });
    });
  });

  /* ---------- form ---------- */
  const form = $('#form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#f-name'), tel = $('#f-tel');
    let ok = true;
    [name, tel].forEach(f => { const bad = !f.value.trim() || (f === tel && f.value.replace(/\D/g, '').length < 9); f.style.borderColor = bad ? 'var(--red)' : ''; if (bad) ok = false; });
    if (!ok) { gsap.fromTo(form, { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1,0.3)' }); return; }
    const text = `Заявка з сайту «Пас»\nІм’я: ${name.value}\nТелефон: ${tel.value}\nФормат: ${$('#f-kind').value}\nПлоща: ${$('#f-area').value}\n${$('#f-msg').value}`;
    if (CONFIG.telegram) window.open('https://t.me/' + CONFIG.telegram + '?text=' + encodeURIComponent(text), '_blank');
    form.classList.add('sent');
    gsap.from('.ok', { scale: .8, opacity: 0, duration: .7, ease: 'back.out(2)' });
    gsap.fromTo('.ok .bell', { rotation: 0 }, { keyframes: { rotation: [18, -14, 9, -5, 0] }, duration: .9 });
  });

  /* ---------- header ---------- */
  const hdr = $('#hdr'); let lastY = 0, acc = 0;
  const onScroll = () => {
    const y = scrollY; const heroEnd = (heroTL && heroTL.scrollTrigger) ? heroTL.scrollTrigger.end : $('.hero').offsetTop + $('.hero').offsetHeight;
    hdr.classList.toggle('is-solid', y > heroEnd - 80);
    const d = y - lastY;
    if (d && Math.sign(d) !== Math.sign(acc)) acc = 0;
    acc += d;
    if (y <= heroEnd || document.body.classList.contains('menu-open')) { hdr.classList.remove('is-hidden'); acc = 0; }
    else if (acc > 40) hdr.classList.add('is-hidden');
    else if (acc < -70) hdr.classList.remove('is-hidden');
    lastY = y;
    $('#fab').classList.toggle('show', y > heroEnd && !document.body.classList.contains('mini-on') && !bookVis && $('#kontakt').getBoundingClientRect().top > innerHeight * .6);
  };
  lenis ? lenis.on('scroll', onScroll) : addEventListener('scroll', onScroll, { passive: true });
  $$('.dark').forEach(sec => ScrollTrigger.create({ trigger: sec, start: 'top 40px', end: 'bottom 40px', toggleClass: { targets: hdr, className: 'on-dark' } }));
  $('.burger').addEventListener('click', () => { const o = document.body.classList.toggle('menu-open'); o ? lenis && lenis.stop() : lenis && lenis.start(); });

  /* ---------- glow + magnetic ---------- */
  if (fine && !reduce) {
    $$('.glow').forEach(s => s.addEventListener('mousemove', e => { const r = s.getBoundingClientRect(); s.style.setProperty('--gx', e.clientX - r.left + 'px'); s.style.setProperty('--gy', e.clientY - r.top + 'px'); }));
    $$('.mag').forEach(b => {
      const xTo = gsap.quickTo(b, 'x', { duration: .6, ease: 'elastic.out(1,0.4)' }), yTo = gsap.quickTo(b, 'y', { duration: .6, ease: 'elastic.out(1,0.4)' });
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35); });
      b.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- resize ---------- */
  let rw = innerWidth;
  addEventListener('resize', () => { if (Math.abs(innerWidth - rw) < 2) return; rw = innerWidth; buildHero(); ScrollTrigger.sort(); ScrollTrigger.refresh(); });
  addEventListener('load', () => ScrollTrigger.refresh());
})();

/* v6 — losses strike on scroll */
(() => {
  const items = document.querySelectorAll('#loss li');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -30% 0px' });
  items.forEach(i => io.observe(i));
})();

/* v9 — chat with chef drives the bill in the printer */
(() => {
  const feed = document.getElementById('chatFeed'), replies = document.getElementById('chatReplies'), status = document.getElementById('chatStatus');
  if (!feed) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mob = () => innerWidth <= 860;
  const AREA = ['до 20 м²', '20–40 м²', '40–60 м²', '60–80 м²'];
  const now = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  let run = 0;
  const st = { k: 'Стрітфуд', a: 0, p: 'вже є' };
  let known = {};
  const push = print => window.__pasChat && window.__pasChat(st, known, print);
  const scroll = () => feed.scrollTo({ top: feed.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  const bubble = (who, html) => {
    const b = document.createElement('div'); b.className = `msg msg--${who}`;
    b.innerHTML = `<div class="msg__b">${html}<span class="msg__t">${now()}${who === 'me' ? ' <i>✓✓</i>' : ''}</span></div>`;
    feed.appendChild(b); requestAnimationFrame(() => b.classList.add('in')); scroll(); return b;
  };
  async function say(text, id) {
    if (id !== run) return;
    status.textContent = 'друкує…'; status.classList.add('typing');
    const t = document.createElement('div'); t.className = 'msg msg--chef in'; t.innerHTML = '<div class="msg__b typing"><i></i><i></i><i></i></div>';
    feed.appendChild(t); scroll();
    await wait(Math.min(950, 380 + text.length * 8));
    t.remove(); if (id !== run) return;
    status.textContent = 'онлайн'; status.classList.remove('typing');
    bubble('chef', text); await wait(180);
  }
  const ask = (opts, id) => new Promise(res => {
    if (id !== run) return;
    replies.innerHTML = ''; replies.classList.add('show');
    opts.forEach((o, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = o; b.addEventListener('click', () => { replies.classList.remove('show'); replies.innerHTML = ''; bubble('me', o); res(i); }); replies.appendChild(b); });
    scroll();
  });
  const esc = t => t.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const askName = (id, ph = 'Назва закладу', skipT = 'Ще не придумав(-ла)') => new Promise(res => {
    if (id !== run) return;
    replies.innerHTML = ''; replies.classList.add('show', 'inp');
    const f = document.createElement('form'); f.className = 'phone__inp';
    f.innerHTML = '<input type="text" maxlength="40" autocomplete="off"><button type="submit" aria-label="Надіслати">➤</button>'; f.querySelector('input').placeholder = ph; f.querySelector('input').setAttribute('aria-label', ph);
    const skip = document.createElement('button'); skip.type = 'button'; skip.className = 'skip'; skip.textContent = skipT;
    const done = v => { replies.classList.remove('show', 'inp'); replies.innerHTML = ''; res(v); };
    f.addEventListener('submit', e => { e.preventDefault(); const v = f.querySelector('input').value.trim().replace(/\s+/g, ' '); if (!v) { f.querySelector('input').focus(); return; } bubble('me', esc(v)); done(v); });
    skip.addEventListener('click', () => { bubble('me', esc(skipT)); done(''); });
    replies.append(f, skip); scroll();
    if (matchMedia('(hover:hover)').matches) setTimeout(() => f.querySelector('input').focus({ preventScroll: true }), 50);
  });
  const KINDS = ['Стрітфуд', 'Кав’ярня', 'Кафе', 'Піцерія / суші', 'Ресторан / паб', '💡 Своя ідея'];
  const KIND_TXT = [
    'Гарний старт: невелика площа й швидкий запуск. Але тут усе вирішує локація — її порахуємо першою.',
    'У кав’ярні гроші в каві й десертах. Меню зробимо так, щоб гість брав ще щось до чашки.',
    'Кафе — це баланс кухні й залу. Плануємо цех так, щоб на пасі не було черги.',
    'Тут половина успіху — доставка й упаковка. Закладемо їх у меню й кухню з першого дня.',
    'Великий формат — більше команди й процесів. Я запускав формати Red Cat — від фуд-корту до пивного ресторану.',
    'Люблю такі задачі! Індивідуальний формат зберемо під вашу ідею, локацію й гостя — від концепції до меню.'
  ];
  const side = () => mob() ? 'Чек друкується трохи нижче 👇' : 'Дивіться праворуч — чек уже друкується 👉';
  async function start() {
    const id = ++run; feed.innerHTML = ''; replies.innerHTML = ''; replies.className = 'phone__replies'; status.textContent = 'онлайн';
    known = {}; push(false); document.getElementById('bill').classList.remove('done');
    const day = document.createElement('div'); day.className = 'msg__day'; day.textContent = 'сьогодні'; feed.appendChild(day);
    await say('Вітаю! Я Дмитро Барсук, бренд-шеф 👨‍🍳', id);
    await say('Порахуймо ваш заклад за хвилину. Що хочете відкрити?', id);
    const k = await ask(KINDS, id); if (id !== run) return;
    st.idea = '';
    if (k === 5) {
      await say('Цікаво! Опишіть ідею кількома словами 👇', id);
      const idea = await askName(id, 'Наприклад: гриль-бар з крафтом', 'Розкажу на зустрічі'); if (id !== run) return;
      st.idea = idea; st.k = idea ? idea.charAt(0).toUpperCase() + idea.slice(1) : 'Індивідуальний формат';
    } else st.k = KINDS[k];
    known.k = 1; push(true);
    await say(KIND_TXT[k], id);
    await say('А як назвете заклад? Напишіть — впишу в чек.', id);
    const nm = await askName(id); if (id !== run) return;
    if (nm) { known.n = nm; push(true); await say(`«${esc(nm)}» — звучить! Уже бачу вивіску. ${mob() ? 'Чек друкується трохи нижче 👇' : 'Дивіться праворуч — чек уже на вас 👉'}`, id); }
    else await say(`Нічого, назву й концепцію теж розробимо разом — це входить у запуск. ${mob() ? 'Чек друкується трохи нижче 👇' : 'Дивіться праворуч — чек уже друкується 👉'}`, id);
    await say('Яка площа приміщення?', id);
    const a = await ask([...AREA, 'Ще не знаю'], id); if (id !== run) return;
    if (a < 4) { st.a = a; known.a = 1; } else { st.a = 0; known.aSkip = 1; }
    push(true);
    await say(a < 4 ? 'Під цю площу вже бачу порядок цифр — у чеку вартість послуг і середні інвестиції.' : 'Нормально, з цього багато хто починає. Площу підберемо під формат — у чеку поки мінімальна вартість.', id);
    await say('Приміщення вже є?', id);
    const p = await ask(['Так, вже є', 'Ні, треба знайти'], id); if (id !== run) return;
    st.p = p === 0 ? 'вже є' : 'треба знайти'; known.p = 1; push(true);
    await say(p === 0 ? 'Супер. Почнемо з аналізу локації й аудиторії — щоб формат точно окупився саме там.' : 'Допоможу знайти й прорахувати. Головне — не підписувати оренду, поки не зрозуміло, що там відкривати.', id);
    await say('І останнє: коли хочете відкритися?', id);
    const WHEN = ['Якнайшвидше', 'За 2–3 місяці', 'Поки думаю'];
    const w = await ask(WHEN, id); if (id !== run) return;
    known.w = ['якнайшвидше', 'за 2–3 міс', 'поки думаю'][w]; push(true);
    await say(w === 2 ? 'Чесно: так і варто — спершу цифри, потім рішення. Перша розмова ні до чого не зобов’язує.' : 'Реально: 1,5–3 місяці від договору до першої зміни. Терміни фіксуємо в договорі.', id);
    document.getElementById('bill').classList.add('done');
    await say('Чек готовий ✅ Залиште номер — зателефоную й порахую точно під вашу локацію.', id);
    if (id !== run) return;
    replies.innerHTML = ''; replies.classList.add('show', 'final');
    const go = document.createElement('button'); go.type = 'button'; go.className = 'go'; go.innerHTML = '<svg class="bell"><use href="#bell"/></svg>Передати чек шефу';
    go.addEventListener('click', e => { window.__pasSet && window.__pasSet(st.a, st.k, st.p); window.__openModal && window.__openModal(e); if (!['Стрітфуд','Кав’ярня','Кафе','Піцерія / суші','Ресторан / паб'].includes(st.k)) { const fk = document.getElementById('mf-kind'); if (fk) [...fk.options].forEach((o, i) => { if (o.text === 'Інше') fk.selectedIndex = i; }); } const mf = document.getElementById('m-for'); if (mf) { mf.textContent = known.n ? 'для «' + known.n + '»' : ''; mf.classList.toggle('on', !!known.n); } const m = document.getElementById('mf-msg'); if (m && !m.value) m.value = [st.idea ? 'Ідея: ' + st.idea : '', known.n ? 'Назва: «' + known.n + '»' : '', 'Старт: ' + (known.w || '—')].filter(Boolean).join('. ') + '.'; });
    const again = document.createElement('button'); again.type = 'button'; again.textContent = 'Почати спочатку'; again.addEventListener('click', start);
    replies.append(go, again); scroll();
  }
  document.getElementById('chatRestart').addEventListener('click', start);
  push(false);
  let started = false;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !started) { started = true; start(); io.disconnect(); } }), { threshold: .35 });
  io.observe(document.querySelector('.phone'));
})();
(() => { const ph = document.querySelector('.phone'); if (!ph) return; new IntersectionObserver(es => es.forEach(e => document.body.classList.toggle('chat-on', e.isIntersecting)), { threshold: .15 }).observe(ph); })();
(() => {
  const t = document.getElementById('themeT'); if (!t) return;
  const root = document.documentElement, meta = document.querySelector('meta[name="theme-color"]');
  const sync = () => { const d = root.classList.contains('theme-dark'); t.setAttribute('aria-label', d ? 'Світла тема' : 'Темна тема'); if (meta) meta.content = d ? '#221E1A' : '#F3EEE5'; };
  sync(); requestAnimationFrame(() => root.classList.add('theme-ready'));
  t.addEventListener('click', () => { root.classList.toggle('theme-dark'); try { localStorage.setItem('pas-theme', root.classList.contains('theme-dark') ? 'dark' : 'light'); } catch (e) {} sync(); });
})();

/* v13 — rotating venue type in hero H1 */
(() => {
  const em = document.getElementById('rot'); if (!em) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const W = ['ваш заклад', 'кав’ярню', 'піцерію', 'бургерну', 'пекарню', 'суші-бар', 'паб', 'ресторан', 'шаурму'];
  let i = 0, busy = false;
  const tick = () => {
    if (busy || document.hidden || typeof gsap === 'undefined') return;
    const cur = em.querySelector('.w'); if (!cur) return;
    busy = true; i = (i + 1) % W.length;
    const n = document.createElement('span'); n.className = 'w rot__n'; n.innerHTML = '<span></span>'; n.firstChild.textContent = W[i];
    em.appendChild(n);
    gsap.set(n.firstChild, { yPercent: 110 });
    gsap.to(cur.firstChild, { yPercent: -110, duration: .55, ease: 'power3.in' });
    gsap.to(n.firstChild, { yPercent: 0, duration: .75, ease: 'power3.out', delay: .35, onComplete: () => { cur.remove(); n.classList.remove('rot__n'); busy = false; } });
  };
  setTimeout(() => { em.innerHTML = '<span class="w"><span></span></span>'; em.querySelector('.w>span').textContent = W[0]; setInterval(tick, 2100); }, 2600);
})();
