/**
 * MotionKit v0.5 — Demo Controller (Full Rewrite)
 * 모든 28개 모듈 · 실시간 옵션 패널 · 코드 스니펫 · 복사
 */
'use strict';

/* ══════════════════════════════════════════════════════════
   GLOBALS
══════════════════════════════════════════════════════════ */
var MKD = {
  MK: null,
  inst: {},

  onReady: function(cb) {
    var self = this;
    var check = setInterval(function() {
      if (window.MotionKit && window.MotionKit._init) {
        clearInterval(check);
        self.MK = window.MotionKit;
        cb(self.MK);
      }
    }, 40);
    setTimeout(function() {
      clearInterval(check);
      if (window.MotionKit) { self.MK = window.MotionKit; cb(self.MK); }
    }, 6000);
  },

  set: function(key, inst) {
    this.kill(key);
    this.inst[key] = inst;
    return inst;
  },

  kill: function(key) {
    var i = this.inst[key];
    if (!i) return;
    try { i.destroy && i.destroy(); } catch(e) {}
    delete this.inst[key];
  },

  glitch: function(id) {
    var key = 'gl-' + id;
    if (this.inst[key]) { this.inst[key].trigger && this.inst[key].trigger(); }
  }
};

/* ── 유틸 ─────────────────────────────────────────────── */
var $ = function(s, ctx) { return (ctx || document).querySelector(s); };
var $$ = function(s, ctx) { return Array.from((ctx || document).querySelectorAll(s)); };

function snip(id, code) {
  var el = document.getElementById(id);
  if (el) el.textContent = code;
}

function buildCode(fn, sel, opts) {
  var o = Object.assign({}, opts);
  Object.keys(o).forEach(function(k) { if (o[k] === '' || o[k] == null) delete o[k]; });
  var s = JSON.stringify(o, null, 2).replace(/"([a-zA-Z_$]\w*)"\s*:/g,'$1:').replace(/"/g,"'");
  return 'MK.' + fn + "('" + sel + "', " + s + ');';
}

function val(id, dflt) {
  var el = document.getElementById(id);
  if (!el) return dflt;
  if (el.type === 'checkbox') return el.checked;
  var v = el.value;
  if (el.type === 'range' || el.type === 'number') return parseFloat(v);
  if (v === 'true') return true;
  if (v === 'false') return false;
  return v;
}

/* ── 복사 버튼 전역 바인딩 ─────────────────────────────── */
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.mk-copy');
  if (!btn) return;
  var forId = btn.dataset.for;
  var el = document.getElementById(forId);
  if (!el) return;
  var text = el.textContent;
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(text).then(function() {
    var orig = btn.textContent;
    btn.textContent = '✓ OK';
    btn.classList.add('ok');
    setTimeout(function() { btn.textContent = orig; btn.classList.remove('ok'); }, 1500);
  });
});

/* ── 슬라이더 라벨 자동 업데이트 ──────────────────────── */
document.addEventListener('input', function(e) {
  var t = e.target;
  if (t.type !== 'range') return;
  var vId = t.id + '-v';
  var vEl = document.getElementById(vId);
  if (!vEl) return;
  var raw = parseFloat(t.value);
  // suffix 힌트
  var suffix = t.dataset.suffix || '';
  vEl.textContent = (raw % 1 === 0 ? raw : raw.toFixed(2)) + suffix;
});

/* ═══════════════════════════════════════════════════════════
   PAGE LOADER
═══════════════════════════════════════════════════════════ */
(function() {
  var bar    = document.getElementById('pbar');
  var ov     = document.getElementById('pld');
  var status = document.getElementById('pld-status');
  if (!bar || !ov) return;

  function setP(v, msg) {
    bar.style.width = (Math.min(1, v) * 100) + '%';
    if (status && msg) status.textContent = msg;
  }
  function hide() {
    ov.style.transition = 'opacity .5s ease';
    ov.style.opacity = '0';
    ov.addEventListener('transitionend', function() { ov.remove(); }, { once: true });
  }

  // 단계별 실제 로드 체크
  setP(0.1, 'HTML 파싱...');

  // Step 1: DOMContentLoaded
  function onDOM() {
    setP(0.35, 'DOM 준비...');
    // Step 2: 폰트 로드
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function() {
        setP(0.6, '폰트 로드...');
        onFonts();
      });
    } else {
      setTimeout(onFonts, 100);
    }
  }

  // Step 3: 이미지 로드 (above-the-fold)
  function onFonts() {
    setP(0.75, '이미지 로드...');
    var imgs = Array.from(document.images).filter(function(img) {
      return !img.loading || img.loading !== 'lazy';
    });
    var total = imgs.length;
    if (!total) { onLoad(); return; }
    var loaded = 0;
    function checkImg() {
      loaded++;
      setP(0.75 + (loaded / total) * 0.2, '이미지 로드... ' + loaded + '/' + total);
      if (loaded >= total) onLoad();
    }
    imgs.forEach(function(img) {
      if (img.complete) { checkImg(); }
      else { img.addEventListener('load', checkImg, { once: true }); img.addEventListener('error', checkImg, { once: true }); }
    });
  }

  // Step 4: window.load (나머지 리소스)
  function onLoad() {
    setP(0.95, 'MotionKit 초기화...');
    setTimeout(function() { setP(1, '완료'); setTimeout(hide, 180); }, 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOM, { once: true });
  } else {
    onDOM();
  }
})();

/* ═══════════════════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════════════════ */
(function() {
  var btn = document.getElementById('th-btn');
  var root = document.documentElement;
  if (localStorage.getItem('mk-theme') === 'light') root.classList.add('lt');
  if (!btn) return;
  btn.addEventListener('click', function() {
    root.classList.toggle('lt');
    localStorage.setItem('mk-theme', root.classList.contains('lt') ? 'light' : 'dark');
  });
})();

/* ═══════════════════════════════════════════════════════════
   SEARCH + FILTER
═══════════════════════════════════════════════════════════ */
(function() {
  var searchEl = document.getElementById('mk-search');
  var clearBtn = document.getElementById('mk-search-clear');
  var tabs     = $$('.tab');
  var sections = $$('section[data-module]');
  var activecat = 'all';

  function apply() {
    var q = searchEl ? searchEl.value.toLowerCase().trim() : '';
    sections.forEach(function(sec) {
      var catOK = activecat === 'all' || (sec.dataset.category || '') === activecat;
      var name  = (sec.dataset.module + ' ' + (sec.dataset.tags || '')).toLowerCase();
      var txtOK = !q || name.includes(q);
      sec.hidden = !(catOK && txtOK);
      var div = sec.nextElementSibling;
      if (div && div.classList && div.classList.contains('div')) div.hidden = sec.hidden;
    });
    var hs = document.getElementById('hs-outer');
    var ss = $('section[data-module="stickyStack"]');
    if (hs && ss) hs.hidden = ss.hidden;
    var nr = document.getElementById('mk-no-result');
    if (nr) nr.hidden = sections.filter(function(s) { return !s.hidden; }).length > 0;
    // ScrollTrigger refresh after DOM change
    setTimeout(function() {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh(true);
    }, 100);
  }

  if (searchEl) {
    searchEl.addEventListener('input', apply);
    searchEl.addEventListener('keydown', function(e) { if (e.key === 'Escape') { searchEl.value = ''; apply(); }});
  }
  if (clearBtn) clearBtn.addEventListener('click', function() { if(searchEl) searchEl.value = ''; apply(); if(searchEl) searchEl.focus(); });

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('on'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('on'); tab.setAttribute('aria-selected', 'true');
      activecat = tab.dataset.cat;
      window.scrollTo({ top: 0, behavior: 'instant' });
      apply();
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   LAZY IMAGES
═══════════════════════════════════════════════════════════ */
var LAZY_SRCS = {
  li1: { s: 'https://images.unsplash.com/photo-1682687218904-ce3e4ca8cca1?w=800&q=80', e: 'skeleton'  },
  li2: { s: 'https://images.unsplash.com/photo-1682687982107-14492010e05e?w=800&q=80', e: 'blur-up'   },
  li3: { s: 'https://images.unsplash.com/photo-1706543954966-fdf54bb0e1d5?w=800&q=80', e: 'pixelate'  },
  li4: { s: 'https://images.unsplash.com/photo-1714906597702-ccae1ea1abf5?w=800&q=80', e: 'polaroid'  },
  li5: { s: 'https://images.unsplash.com/photo-1682687218904-ce3e4ca8cca1?w=800&q=80', e: 'print'     },
  li6: { s: 'https://images.unsplash.com/photo-1706543954966-fdf54bb0e1d5?w=800&q=80', e: 'noise'     },
};

window.rlLazy = function(id, effect) {
  if (!MKD.MK) return;
  var img = document.getElementById(id); if (!img) return;
  var cfg = LAZY_SRCS[id]; if (!cfg) return;
  var wrap = img.parentElement;
  // rebuild wrap
  var lf = wrap.classList.contains('mk-lazy-wrap') ? wrap.parentElement : wrap;
  lf.innerHTML = '';
  var newImg = document.createElement('img');
  newImg.id = id; newImg.alt = effect; newImg.loading = 'lazy';
  newImg.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
  lf.appendChild(newImg);
  newImg.dataset.src = cfg.s;
  MKD.MK.lazy(newImg, { effect: effect || cfg.e, rootMargin: '9999px 0px' });
  snip('lz-snippet', buildCode('lazy', '#img', { effect: effect || cfg.e }));
};

window.rlAll = function() {
  Object.keys(LAZY_SRCS).forEach(function(id, i) {
    setTimeout(function() { rlLazy(id, LAZY_SRCS[id].e); }, i * 100);
  });
};

/* ═══════════════════════════════════════════════════════════
   TEXT REVEAL HELPERS
═══════════════════════════════════════════════════════════ */
window.replayTR = function(id, mode, text) {
  if (!MKD.MK) return;
  MKD.kill(id);
  var el = document.getElementById(id); if (!el) return;
  el.innerHTML = '';
  var spEl = document.getElementById('stream-spd');
  var speed = spEl ? parseInt(spEl.value) : 50;
  var actualMode = mode;
  if (mode === 'stream' && document.getElementById('stream-hangul') && document.getElementById('stream-hangul').checked) {
    actualMode = 'hangul';
  }
  MKD.inst[id] = MKD.MK.textReveal(el, { mode: actualMode, text: text, speed: speed });
};

window.replaySplit = function() {
  if (!MKD.MK) return;
  var el = document.getElementById('ts1'); if (!el) return;
  MKD.kill('ts1');
  el.innerHTML = 'Motion First Design';
  MKD.set('ts1', MKD.MK.textSplit(el, { by: 'char', animation: 'rise', stagger: .04, duration: .7 }));
};

window.replayTW = function() {
  if (!MKD.MK) return;
  var el = document.getElementById('tw1'); if (!el) return;
  MKD.kill('tw1'); el.innerHTML = '';
  MKD.set('tw1', MKD.MK.typewriter(el, { strings: ['MotionKit v0.5','28 모듈','디자이너를 위한'], typeSpeed: 60, eraseSpeed: 30, pauseAfter: 1400, loop: true }));
};

window.replayShf = function() {
  var inst = MKD.inst['shf1'];
  if (inst && inst.start) inst.start();
};

window.rebuildCounters = function() {
  if (!MKD.MK) return;
  var to   = val('cnt-to', 2024);
  var dur  = val('cnt-dur', 2);
  var ease = val('cnt-ease', 'power2.out');
  var fmt  = val('cnt-fmt', '');
  var pre  = val('cnt-pre', '');
  var suf  = val('cnt-suf', '');
  var o    = { from: 0, to: to, duration: dur, ease: ease, format: fmt, prefix: pre, suffix: suf };
  MKD.set('c1', MKD.MK.counter('#c1', Object.assign({ style: 'slot' }, o)));
  MKD.set('c2', MKD.MK.counter('#c2', Object.assign({ style: 'plain', decimals: 2, to: 9.99 }, o)));
  MKD.set('c3', MKD.MK.counter('#c3', Object.assign({ style: 'impact', impactScale: 1.5 }, o)));
  snip('cnt-snippet', buildCode('counter', '#el', { from: 0, to: to, duration: dur, ease: ease, format: fmt, style: 'slot' }));
};

window.rebuildLightbox = function() {
  if (!MKD.MK) return;
  var opts = {
    animation: val('lb-anim','zoom'), loading: val('lb-loading','skeleton'),
    counter: val('lb-counter',true), caption: val('lb-caption',true), zoom: val('lb-zoom',true)
  };
  MKD.set('lb1', MKD.MK.lightbox(document.getElementById('lb-wrap'), opts));
  snip('lb-snippet', buildCode('lightbox', '#container', opts));
};

/* ═══════════════════════════════════════════════════════════
   PAGE REVEAL + TRANSITION
═══════════════════════════════════════════════════════════ */
window.triggerPR = function(effect) {
  if (!window.gsap) return;
  var color    = val('pr-color', '#ff5b1c');
  var duration = val('pr-dur', 0.9);
  var ease     = val('pr-ease', 'power3.inOut');
  if (MKD.MK && MKD.MK.pageReveal) {
    MKD.MK.pageReveal(document.body, { effect: effect, duration: duration, ease: ease, color: color });
  }
  snip('pr-snippet', buildCode('pageReveal', 'document.body', { effect: effect, duration: duration, color: color, ease: ease }));
};

window.triggerPT = function(effect) {
  var color = '#ff5b1c';
  if (!window.gsap) return;
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:99997;background:'+color+';pointer-events:none;';
  if (effect === 'split') {
    var t = document.createElement('div'), b = document.createElement('div');
    [t,b].forEach(function(el) { el.style.cssText='position:fixed;left:0;right:0;z-index:99997;background:'+color+';pointer-events:none;'; });
    t.style.top='0'; t.style.height='50%'; b.style.bottom='0'; b.style.height='50%';
    document.body.append(t, b);
    var tl=gsap.timeline({onComplete:function(){t.remove();b.remove();}});
    tl.fromTo(t,{scaleY:0},{scaleY:1,transformOrigin:'top',duration:.38,ease:'power3.in'},0);
    tl.fromTo(b,{scaleY:0},{scaleY:1,transformOrigin:'bottom',duration:.38,ease:'power3.in'},0);
    tl.to(t,{scaleY:0,transformOrigin:'top',duration:.38,ease:'power3.out'});
    tl.to(b,{scaleY:0,transformOrigin:'bottom',duration:.38,ease:'power3.out'},'<');
    return;
  }
  document.body.appendChild(ov);
  var tl2 = gsap.timeline({onComplete:function(){ov.remove();}});
  if (effect==='circle'){ov.style.cssText='position:fixed;z-index:99997;border-radius:50%;background:'+color+';pointer-events:none;width:0;height:0;top:50%;left:50%;transform:translate(-50%,-50%)';tl2.to(ov,{width:'200vmax',height:'200vmax',duration:.42,ease:'power3.in'});tl2.to(ov,{width:'0',height:'0',duration:.42,ease:'power3.out'});}
  else if(effect==='curtain'){tl2.fromTo(ov,{scaleY:0},{scaleY:1,transformOrigin:'bottom',duration:.4,ease:'power3.in'});tl2.to(ov,{scaleY:0,transformOrigin:'top',duration:.4,ease:'power3.out'});}
  else{tl2.fromTo(ov,{scaleX:0},{scaleX:1,transformOrigin:'left',duration:.38,ease:'power3.in'});tl2.to(ov,{scaleX:0,transformOrigin:'right',duration:.38,ease:'power3.out'});}
};

/* ═══════════════════════════════════════════════════════════
   LOADER
═══════════════════════════════════════════════════════════ */
window.dlLoader = function(style) {
  if (!MKD.MK) return;
  var spd = parseFloat((document.getElementById('ld-spd')||{}).value||10) / 10;
  var col = (document.getElementById('ld-col')||{}).value || '#ff5b1c';
  var bg  = (document.getElementById('ld-bg')||{}).value  || '#080706';
  var ov  = document.createElement('div');
  document.body.appendChild(ov);
  MKD.MK.loader(ov, { style: style, duration: 2, animSpeed: spd, color: col, bg: bg, onComplete: function() { ov.remove(); }});
  snip('ld-snippet', buildCode('loader', 'el', { style: style, duration: 2, color: col, bg: bg }));
};

/* ═══════════════════════════════════════════════════════════
   MAIN INIT
═══════════════════════════════════════════════════════════ */
MKD.onReady(function(MK) {

  /* ── Progress bar ── */
  MK.progress($('[data-mk-progress]'), { target: 'page', property: 'scaleX' });

  /* ── Reveal: hero ── */
  $$('[data-mk-reveal]').forEach(function(el) {
    MK.reveal(el, { preset: el.dataset.mkReveal, delay: parseFloat(el.dataset.mkDelay||0) });
  });

  /* ── Reveal: 13 presets grid ── */
  var presets = ['fade-up','fade-down','fade-left','fade-right','zoom','zoom-out','blur','rise','flip','flip-y','mask','mask-down','skew-up'];
  var grid = document.getElementById('reveal-grid');
  if (grid) {
    presets.forEach(function(p) {
      var d = document.createElement('div'); d.className = 'card'; d.dataset.mkReveal2 = p;
      d.innerHTML = '<span class="cl" style="margin-bottom:4px;">'+p+'</span><p style="color:var(--dim);font-size:12px;">스크롤 등장</p>';
      grid.appendChild(d);
      MK.reveal(d, { preset: p });
    });
  }
  function rebuildReveal() {
    var p    = val('rv-preset','fade-up');
    var dur  = val('rv-dur', 1);
    var dly  = val('rv-delay', 0);
    var ease = val('rv-ease', 'power3.out');
    var once = val('rv-once', true);
    if (grid) {
      $$('[data-mk-reveal2]', grid).forEach(function(el) {
        MK.reveal(el, { preset: el.dataset.mkReveal2, duration: dur, ease: ease, once: once });
      });
    }
    snip('rv-snippet', buildCode('reveal', '#el', { preset: p, duration: dur, delay: dly, ease: ease, once: once }));
  }
  ['rv-preset','rv-dur','rv-delay','rv-ease','rv-once'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.addEventListener('change', rebuildReveal);
    if (el && el.type === 'range') el.addEventListener('input', rebuildReveal);
  });
  snip('rv-snippet', buildCode('reveal', '#el', { preset: 'fade-up', duration: 1, ease: 'power3.out' }));

  /* ── Counter ── */
  rebuildCounters();
  ['cnt-to','cnt-dur','cnt-ease','cnt-fmt','cnt-pre','cnt-suf'].forEach(function(id) {
    var el = document.getElementById(id); if (!el) return;
    el.addEventListener('change', rebuildCounters);
    if (el.type === 'range') el.addEventListener('input', rebuildCounters);
  });

  /* ── 01 Cursor ── */
  var curType = 'dot';
  function rebuildCursor() {
    var col  = val('cur-color','#ff5b1c');
    var de   = val('cur-de', 1);
    var fe   = val('cur-fe', 0.1);
    var hs   = val('cur-hs', 2);
    var opts = { type: curType, color: col, dotEase: de, followerEase: fe, hoverScale: hs };
    // 타입별 옵션
    if (curType === 'text')     { opts.rotateText = val('cur-rot-text','MOTIONKIT · '); opts.hoverText = 'VIEW'; }
    if (curType === 'image')    { opts.image = 'https://images.unsplash.com/photo-1682687982107-14492010e05e?w=80&q=80'; }
    if (curType === 'custom')   { opts.html = '<div style="width:24px;height:24px;border:2px solid currentColor;border-radius:50%;position:relative;"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:4px;height:4px;background:currentColor;border-radius:50%;"></div></div>'; }
    if (curType === 'trail')    { opts.trailCount = val('cur-trail-n',8); opts.trailColor = col; opts.spring = 0.12; }
    if (curType === 'orbit')    { opts.orbitText = val('cur-orbit-text','MOTIONKIT · '); opts.textColor = col; opts.orbitRadius = 55; }
    if (curType === 'snake')    { opts.snakeText = val('cur-snake-text','MOTIONKIT'); opts.textColor = col; }
    if (curType === 'sparkle')  { opts.sparkleColor = col; opts.sparkleColor2 = '#ffd166'; }
    if (curType === 'none')     { opts = { type: 'none' }; }
    MKD.set('cursor', MK.cursor(document.body, opts));
    // 타입별 추가 옵션 패널 표시
    $$('[id^="cur-"][id$="-opt"]').forEach(function(el) { el.hidden = true; });
    var extraMap = {orbit:'cur-orbit-opt',snake:'cur-snake-opt',trail:'cur-trail-opt',text:'cur-rot-opt'};
    if (extraMap[curType]) { var eo = document.getElementById(extraMap[curType]); if(eo) eo.hidden = false; }
    // 값 동기화
    var dv=document.getElementById('cur-de-v'); if(dv) dv.textContent=de.toFixed(2);
    var fv=document.getElementById('cur-fe-v'); if(fv) fv.textContent=fe.toFixed(2);
    var hv=document.getElementById('cur-hs-v'); if(hv) hv.textContent=hs.toFixed(1);
    snip('cur-snippet', buildCode('cursor', 'document.body', opts));
  }
  $$('.ccard').forEach(function(card) {
    card.addEventListener('click', function() {
      $$('.ccard').forEach(function(c) { c.classList.remove('on'); c.setAttribute('aria-pressed','false'); });
      card.classList.add('on'); card.setAttribute('aria-pressed','true');
      curType = card.dataset.type;
      rebuildCursor();
    });
    card.addEventListener('keydown', function(e) { if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();} });
  });
  ['cur-color','cur-de','cur-fe','cur-hs','cur-trail-n','cur-orbit-text','cur-snake-text','cur-rot-text'].forEach(function(id) {
    var el = document.getElementById(id); if (!el) return;
    el.addEventListener('input', rebuildCursor);
    el.addEventListener('change', rebuildCursor);
  });
  rebuildCursor();

  /* ── 04 Parallax ── */
  function rebuildParallax() {
    var spd = val('par-spd', .4);
    var ax  = val('par-axis','y');
    var msp = val('mp-spd', .08);
    MKD.set('p1', MK.parallax('#p1', { speed: spd, axis: ax }));
    MKD.set('p2', MK.parallax('#p2', { speed: spd * 1.6, axis: ax }));
    MKD.set('mp1', MK.mouseParallax('#mp1', { speed: msp * 2, global: true }));
    MKD.set('mp2', MK.mouseParallax('#mp2', { speed: msp * 3.5, global: true }));
    MKD.set('mp3', MK.mouseParallax('#mp3', { speed: msp, global: true }));
    snip('par-snippet', buildCode('parallax', '#img', { speed: spd, axis: ax }));
  }
  ['par-spd','par-axis','mp-spd'].forEach(function(id) {
    var el=document.getElementById(id); if(!el) return;
    el.addEventListener('input', rebuildParallax);
    el.addEventListener('change', rebuildParallax);
  });
  rebuildParallax();

  /* ── 05 Lazy ── */
  Object.keys(LAZY_SRCS).forEach(function(id) {
    var img = document.getElementById(id); if (!img) return;
    img.dataset.src = LAZY_SRCS[id].s;
    MK.lazy(img, { effect: LAZY_SRCS[id].e, rootMargin: '200px 0px' });
  });

  /* ── 06 Marquee ── */
  function rebuildMarquee() {
    var spd = val('mq-spd', 55);
    var sr  = val('mq-sr', true);
    var ph  = val('mq-ph', true);
    MKD.set('mq1', MK.marquee('#mq1', { speed: spd, scrollReact: sr, pauseOnHover: ph }));
    MKD.set('mq2', MK.marquee('#mq2', { speed: spd * .7, scrollReact: sr, pauseOnHover: ph, reverse: true }));
    snip('mq-snippet', buildCode('marquee', '#el', { speed: spd, scrollReact: sr, pauseOnHover: ph }));
  }
  ['mq-spd','mq-sr','mq-ph'].forEach(function(id) {
    var el=document.getElementById(id); if(!el) return;
    el.addEventListener('input', rebuildMarquee);
    el.addEventListener('change', rebuildMarquee);
  });
  rebuildMarquee();

  /* ── 07 Text modules ── */
  // textReveal stream
  replayTR('tr1','stream','인공지능이 답변을 생성합니다. 한글도 자연스럽게 어절 단위로 나타납니다.');
  replayTR('tr2','hangul','안녕하세요. 디자이너를 위한 고품질 모션.');
  var streamRb = document.getElementById('stream-rb'); if(streamRb) streamRb.addEventListener('click', function(){ replayTR('tr1','stream','인공지능이 답변을 생성합니다.'); });
  var hangulRb = document.getElementById('hangul-rb'); if(hangulRb) hangulRb.addEventListener('click', function(){ replayTR('tr2','hangul','안녕하세요. 디자이너를 위한 고품질 모션.'); });
  var spdEl = document.getElementById('stream-spd');
  var spdV  = document.getElementById('stream-spd-v');
  if(spdEl && spdV) spdEl.addEventListener('input', function(){ spdV.textContent=spdEl.value+'ms'; });

  // textTransition
  var ttInstances = {};
  function rtt(id) {
    if(ttInstances[id]) { try{ttInstances[id].destroy();}catch(e){} }
    var el=document.getElementById(id); if(!el) return; el.innerHTML='';
    var eff = id==='tt1' ? val('tt1-eff','slide-up') : undefined;
    var cfgs = {
      tt1: { texts:['Design','Motion','Trust.'], effect:eff||'slide-up', pause:1800, duration:.5, pauseOnHover:true },
      ml1: { texts:['디자이너를 위한 모션.','Motion for designers.','デザイナーのためのモーション。'], effect:'clip', pause:2200, duration:.55, pauseOnHover:true },
      tt4: { texts:['MOTION','DESIGN','TRUST'], effect:'rise', pause:1600, duration:.5, charMode:true, stagger:.04, pauseOnHover:true },
    };
    if(id==='tt3'){
      var d1='<div style="display:flex;align-items:center;gap:10px;"><div style="width:40px;height:40px;border-radius:50%;background:var(--acc);flex-shrink:0;"></div><div><b style="font-family:var(--s);font-size:17px;font-weight:300;display:block;">첫 번째</b><span style="font-size:11px;color:var(--dim);">이미지+텍스트</span></div></div>';
      var d2='<div style="display:flex;align-items:center;gap:10px;"><div style="width:40px;height:40px;border-radius:50%;background:var(--acc2);flex-shrink:0;"></div><div><b style="font-family:var(--s);font-size:17px;font-weight:300;display:block;">두 번째</b><span style="font-size:11px;color:var(--dim);">div 전환</span></div></div>';
      var d3='<div style="display:flex;align-items:center;gap:10px;"><div style="width:40px;height:40px;border-radius:50%;background:#4fffb0;flex-shrink:0;"></div><div><b style="font-family:var(--s);font-size:17px;font-weight:300;display:block;">세 번째</b><span style="font-size:11px;color:var(--dim);">HTML 자유롭게</span></div></div>';
      el.style.overflow='hidden';
      ttInstances[id]=MK.textTransition(el,{texts:[d1,d2,d3],effect:'slide-up',pause:2000,duration:.5,isHTML:true,pauseOnHover:true});
      return;
    }
    var cfg=cfgs[id]; if(!cfg) return;
    ttInstances[id]=MK.textTransition(el, cfg);
  }
  ['tt1','ml1','tt3','tt4'].forEach(rtt);
  ['tt1','ml1','tt3','tt4'].forEach(function(id){
    var rb=document.getElementById(id+'-rb'); if(!rb) return;
    rb.addEventListener('click', function(){rtt(id);});
  });
  var tt1Eff = document.getElementById('tt1-eff');
  if(tt1Eff) tt1Eff.addEventListener('change', function(){rtt('tt1');});

  // textSplit
  replaySplit();
  var ts1Rb = document.getElementById('ts1-rb'); if(ts1Rb) ts1Rb.addEventListener('click', replaySplit);

  // blurText
  MKD.set('bt1', MK.blurText(document.getElementById('bt1'), { stagger:.04, duration:.55, once:false }));
  var bt1Rb = document.getElementById('bt1-rb'); if(bt1Rb) bt1Rb.addEventListener('click', function(){ var i=MKD.inst['bt1']; if(i&&i.replay)i.replay(); else if(i&&i.start)i.start(); });

  // typewriter
  replayTW();
  var tw1Rb = document.getElementById('tw1-rb'); if(tw1Rb) tw1Rb.addEventListener('click', replayTW);

  // shuffle
  (function(){
    var el=document.getElementById('shf1'); if(!el||!MKD.MK) return;
    el.textContent='MOTIONKIT';
    var inst=MK.shuffle(el,{speed:28,revealRate:.12,chars:'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$',trigger:'manual'});
    MKD.inst['shf1']=inst; if(inst)inst.start();
    el.addEventListener('mouseenter', function(){if(inst)inst.start();});
    var shfRb=document.getElementById('shf1-rb'); if(shfRb) shfRb.addEventListener('click', function(){if(inst)inst.start();});
  })();

  // shimmer
  (function(){
    var el=document.getElementById('shm1'); if(!el) return; el.innerHTML='';
    MKD.set('shm1', MK.textTransition(el,{texts:['AI가 생성하는 빛나는 텍스트.'],effect:'shimmer',shimColor:'var(--ink)',shimColor2:'var(--acc2)',shimSpeed:2.5}));
  })();

  // textFill
  MKD.set('tf1', MK.textFill('#tf1', { fillColor: '#ff5b1c', baseColor: 'transparent' }));

  snip('txt-snippet', "MK.textTransition('#el', { texts: ['Design','Motion'], effect: 'slide-up', pause: 1800, pauseOnHover: true });");

  /* ── 08 ScrollVelocity ── */
  function rebuildSV() {
    var sk = val('sv-skew',15); var bl = val('sv-blur',8);
    var sv1=document.getElementById('sv-skew-v'); if(sv1)sv1.textContent=sk+'°';
    var sv2=document.getElementById('sv-blur-v'); if(sv2)sv2.textContent=bl+'px';
    MKD.set('sv1', MK.scrollVelocity('#sv1', { maxSkew: sk, maxBlur: bl }));
    snip('sv-snippet', buildCode('scrollVelocity','#el',{maxSkew:sk,maxBlur:bl}));
  }
  ['sv-skew','sv-blur'].forEach(function(id){var el=document.getElementById(id);if(el){el.addEventListener('input',rebuildSV);}});
  rebuildSV();

  /* ── 09 Glitch ── */
  MKD.set('gl-gl1', MK.glitch('#gl1', { preset:'rgb',   trigger:'auto',  intensity:.7, loop:true }));
  MKD.set('gl-gl2', MK.glitch('#gl2', { preset:'noise', trigger:'hover', intensity:.65,loop:true }));
  MKD.set('gl-gl3', MK.glitch('#gl3', { preset:'crt',   trigger:'auto',  intensity:.5, loop:true }));
  // live preview
  function rebuildGlitch() {
    var opts = { preset: val('gl-preset','rgb'), trigger: val('gl-trigger','auto'), intensity: val('gl-int',.6), speed: val('gl-spd',1), loop: val('gl-loop',true) };
    MKD.set('gl-live', MK.glitch('#gl-live', opts));
    var iv=document.getElementById('gl-int-v'); if(iv)iv.textContent=opts.intensity.toFixed(2);
    var sv=document.getElementById('gl-spd-v'); if(sv)sv.textContent=opts.speed.toFixed(1)+'×';
    snip('gl-snippet', buildCode('glitch','#el',opts));
  }
  ['gl-preset','gl-trigger','gl-int','gl-spd','gl-loop'].forEach(function(id){
    var el=document.getElementById(id);if(!el)return;
    el.addEventListener('input',rebuildGlitch);el.addEventListener('change',rebuildGlitch);
  });
  rebuildGlitch();

  /* ── 10 Tilt + Magnetic ── */
  function rebuildTilt() {
    var mx=val('ti-max',18),sc=val('ti-scale',1.05),ea=val('ti-ease',.1);
    var ms=val('mag-str',.45),mr=val('mag-rad',90);
    var mv=document.getElementById('ti-max-v'); if(mv)mv.textContent=mx+'°';
    var sv2=document.getElementById('ti-scale-v'); if(sv2)sv2.textContent=sc.toFixed(2);
    var ev=document.getElementById('ti-ease-v'); if(ev)ev.textContent=ea.toFixed(2);
    var msv=document.getElementById('mag-str-v'); if(msv)msv.textContent=ms.toFixed(2);
    var mrv=document.getElementById('mag-rad-v'); if(mrv)mrv.textContent=mr+'px';
    MKD.set('ti1', MK.tilt('#ti1', { max:mx, ease:ea }));
    MKD.set('ti2', MK.tilt('#ti2', { max:mx, scale:sc, ease:ea }));
    MKD.set('mag1', MK.magnetic('#mag1', { strength:ms, radius:mr }));
    snip('ti-snippet', buildCode('tilt','#el',{max:mx,ease:ea})+'\n'+buildCode('magnetic','#btn',{strength:ms,radius:mr}));
  }
  ['ti-max','ti-scale','ti-ease','mag-str','mag-rad'].forEach(function(id){
    var el=document.getElementById(id);if(!el)return;el.addEventListener('input',rebuildTilt);
  });
  rebuildTilt();

  /* ── 11 CardGlow ── */
  var cgInst = {
    b: MK.cardGlow('#gcb',{mode:'border',   color:'#ff5b1c',color2:'#ffd166',speed:3,opacity:.85,width:1.5}),
    s: MK.cardGlow('#gcs',{mode:'spotlight',color:'#ff5b1c',size:180,opacity:.7}),
    f: MK.cardGlow('#gcf',{mode:'flow',     opacity:.45,speed:.65}),
    a: MK.cardGlow('#gca',{mode:'aurora',   color:'#ff5b1c',color2:'#ffd166',speed:4,opacity:.4}),
    g: MK.cardGlow('#gcg',{mode:'glow',     color:'#ff5b1c',color2:'#ffd166',size:100,opacity:.6}),
    r: MK.cardGlow('#gcr',{mode:'rainbow',  speed:3,opacity:.9,width:2}),
  };
  function rebuildCG() {
    var c1=val('cg-c1','#ff5b1c'),c2=val('cg-c2','#ffd166'),sp=val('cg-spd',3),op=val('cg-op',.7);
    var spv=document.getElementById('cg-spd-v'); if(spv)spv.textContent=sp;
    var opv=document.getElementById('cg-op-v'); if(opv)opv.textContent=op.toFixed(2);
    Object.values(cgInst).forEach(function(i){if(!i)return;if(i.setColor)i.setColor(c1,c2);if(i.setSpeed)i.setSpeed(sp);if(i.setOpacity)i.setOpacity(op);});
    snip('cg-snippet', buildCode('cardGlow','#el',{mode:'border',color:c1,color2:c2,speed:sp,opacity:op}));
  }
  ['cg-c1','cg-c2','cg-spd','cg-op'].forEach(function(id){var el=document.getElementById(id);if(!el)return;el.addEventListener('input',rebuildCG);});
  snip('cg-snippet', buildCode('cardGlow','#el',{mode:'border',color:'#ff5b1c',speed:3}));

  /* ── 12 StickyStack ── */
  (function(){
    var wrap=document.getElementById('ss-wrap'); if(!wrap) return;
    wrap.style.overflow='visible';
    var parent=wrap.parentElement; if(parent)parent.style.overflow='visible';
    MKD.set('ss1', MK.stickyStack('#ss-wrap', { mode:'stack', offsetY:20 }));
  })();
  // Horizontal scroll
  (function(){
    var outer=document.getElementById('hs-outer');
    var track=document.getElementById('hs-track');
    var dots=$$('.hsd');
    if(!outer||!track||!window.gsap||!window.ScrollTrigger)return;
    var nP=4;
    setTimeout(function(){
    gsap.to(track,{
      x:function(){return -(track.scrollWidth-window.innerWidth)+'px';},
      ease:'none',
      scrollTrigger:{trigger:outer,start:'top top',end:'bottom bottom',scrub:1,invalidateOnRefresh:true,fastScrollEnd:true,anticipatePin:1,
        onUpdate:function(self){var idx=Math.round(self.progress*(nP-1));dots.forEach(function(d,i){d.style.background=i===idx?'var(--acc)':'rgba(255,255,255,.2)';d.style.transform=i===idx?'scale(1.5)':'scale(1)';});}
      }
    });
    },100);
  })();

  /* ── 14 Lightbox ── */
  rebuildLightbox();

  /* ── 16 AmbientMedia ── */
  MKD.set('amb1', MK.ambientMedia(document.getElementById('a-img'), { type:'image', blur:48, scale:1.1, opacity:.6 }));
  MKD.set('amb2', MK.ambientMedia(document.getElementById('a-vid'), { type:'video', blur:50, scale:1.1, opacity:.65, fps:24, fade:.06 }));

  /* ── 17 CssScroll ── */
  MKD.set('cs1', MK.cssScroll('#cs1', {
    property:'--r', start:'top 80%', end:'bottom 20%', rangeStart:0, rangeEnd:360,
    onUpdate:function(v){var el=document.getElementById('cs1');if(el)el.style.transform='rotate('+v+'deg)';}
  }));

  /* ── 15 PageReveal ── */
  var prDurEl = document.getElementById('pr-dur');
  var prDurV  = document.getElementById('pr-dur-v');
  if(prDurEl && prDurV) prDurEl.addEventListener('input', function(){ prDurV.textContent=parseFloat(prDurEl.value).toFixed(1)+'s'; });
  snip('pr-snippet', buildCode('pageReveal','document.body',{effect:'curtain',duration:.9,color:'#ff5b1c'}));

  /* ── Vibrate: autoInit handles data-mk-vibrate ── */

}); // MKD.onReady
