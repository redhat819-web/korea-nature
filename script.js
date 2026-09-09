(function () {
  'use strict';

  var stage = document.getElementById('stage');
  var scenes = Array.prototype.slice.call(stage.querySelectorAll('.scene')).map(function (el) {
    return { el: el, id: el.dataset.scene, layout: el.dataset.layout || null };
  });

  var currentScrollTrigger = null;
  var currentTimeline = null;
  var currentObserver = null;

  // ---------- User Story 1: CTA "back to top" ----------

  function bindCtaButton() {
    var btn = stage.querySelector('[data-action="scroll-to-top"]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  bindCtaButton();

  // ---------- User Story 2: desktop pinned journey (single pin, single master timeline) ----------

  var SLOT = 3; // arbitrary GSAP time units allotted to each scene within the master timeline

  function teardownPinnedJourney() {
    if (currentScrollTrigger) {
      currentScrollTrigger.kill();
      currentScrollTrigger = null;
    }
    if (currentTimeline) {
      currentTimeline.kill();
      currentTimeline = null;
    }
    scenes.forEach(function (scene) {
      gsap.set(scene.el, { clearProps: 'all' });
      var bg = scene.el.querySelector('.scene__bg');
      var panel = scene.el.querySelector('.scene__panel');
      var texts = scene.el.querySelectorAll(
        '.scene__name-en, .scene__name-ko, .scene__title, .scene__title-en, .scene__tagline, .scene__body, .scene__lead, .scene__keywords, .cta__button'
      );
      if (bg) gsap.set(bg, { clearProps: 'all' });
      if (panel) gsap.set(panel, { clearProps: 'all' });
      gsap.set(texts, { clearProps: 'all' });
    });
  }

  function buildPinnedJourney() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: function () {
          return '+=' + window.innerHeight * scenes.length * 1.2;
        },
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true
      }
    });

    scenes.forEach(function (scene, i) {
      var el = scene.el;
      var bg = el.querySelector('.scene__bg');
      var panel = el.querySelector('.scene__panel');
      var textEls = Array.prototype.slice.call(
        el.querySelectorAll(
          '.scene__name-en, .scene__name-ko, .scene__title, .scene__title-en, .scene__tagline'
        )
      );
      var bodyEls = Array.prototype.slice.call(el.querySelectorAll('.scene__body, .scene__lead'));
      var keywords = el.querySelector('.scene__keywords');
      var button = el.querySelector('.cta__button');
      var start = i * SLOT;
      var isFirst = i === 0;
      var isLast = i === scenes.length - 1;

      gsap.set(el, { zIndex: i + 1 });

      if (isFirst) {
        gsap.set(el, { autoAlpha: 1 });
      } else {
        gsap.set(el, { autoAlpha: 0 });
        gsap.set(bg, { scale: 1.18 });
      }

      // Foreground/background parallax + slow background drift through the whole slot
      tl.to(bg, { yPercent: -6, duration: SLOT, ease: 'none' }, start);
      if (panel) {
        tl.to(panel, { yPercent: 3, duration: SLOT, ease: 'none' }, start);
      }

      if (!isFirst) {
        // Incoming: image scales down toward 1 (approaching / "tunnel" entry), cross-fades in
        // over the tail of the previous scene's slot (20-30% overlap window)
        var enterStart = start - SLOT * 0.28;
        tl.to(el, { autoAlpha: 1, duration: SLOT * 0.4, ease: 'none' }, enterStart);
        tl.to(bg, { scale: 1, duration: SLOT * 0.55, ease: 'none' }, enterStart);
        tl.fromTo(
          el,
          { clipPath: 'inset(12% 4% 12% 4%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: SLOT * 0.4, ease: 'none' },
          enterStart
        );

        // Staggered text entrance: name -> tagline -> body/keywords
        textEls.forEach(function (node, idx) {
          tl.fromTo(
            node,
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: SLOT * 0.22, ease: 'none' },
            enterStart + SLOT * 0.1 + idx * SLOT * 0.06
          );
        });
        bodyEls.forEach(function (node, idx) {
          tl.fromTo(
            node,
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: SLOT * 0.22, ease: 'none' },
            enterStart + SLOT * 0.24 + idx * SLOT * 0.08
          );
        });
        if (keywords) {
          tl.fromTo(
            keywords,
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: SLOT * 0.22, ease: 'none' },
            enterStart + SLOT * 0.4
          );
        }
        if (button) {
          tl.fromTo(
            button,
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: SLOT * 0.22, ease: 'none' },
            enterStart + SLOT * 0.2
          );
        }
      }

      if (!isLast) {
        // Outgoing: image scales up slightly (receding "left behind") + fades out,
        // beginning late in this scene's slot so it overlaps the next scene's entrance
        var exitStart = start + SLOT * 0.72;
        tl.to(el, { autoAlpha: 0, duration: SLOT * 0.4, ease: 'none' }, exitStart);
        tl.to(bg, { scale: 1.1, duration: SLOT * 0.4, ease: 'none' }, exitStart);
      }
    });

    // Scope will-change to only the scene(s) currently animating, not every scene globally
    function updateWillChange() {
      var t = tl.time();
      scenes.forEach(function (scene, i) {
        var slotStart = i * SLOT;
        var active = t >= slotStart - SLOT && t <= slotStart + SLOT;
        var bg = scene.el.querySelector('.scene__bg');
        var panel = scene.el.querySelector('.scene__panel');
        scene.el.style.willChange = active ? 'opacity' : '';
        if (bg) bg.style.willChange = active ? 'transform' : '';
        if (panel) panel.style.willChange = active ? 'transform, opacity' : '';
      });
    }
    tl.eventCallback('onUpdate', updateWillChange);
    updateWillChange();

    currentTimeline = tl;
    currentScrollTrigger = tl.scrollTrigger;
  }

  // ---------- User Story 3 / 4: mobile & reduced-motion plain-flow fallback ----------

  function teardownPlainFlow() {
    if (currentObserver) {
      currentObserver.disconnect();
      currentObserver = null;
    }
  }

  function buildPlainFlow() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.2 }
    );
    scenes.forEach(function (scene) {
      observer.observe(scene.el);
    });
    currentObserver = observer;
  }

  // ---------- Mode detection & switching ----------

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isMobileWidth() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  function detectMode() {
    return isMobileWidth() || prefersReducedMotion() ? 'plain-flow' : 'pinned-journey';
  }

  var activeMode = null;

  function applyMode(mode) {
    if (mode === activeMode) return;

    if (activeMode === 'pinned-journey') teardownPinnedJourney();
    if (activeMode === 'plain-flow') teardownPlainFlow();

    stage.dataset.mode = mode;
    activeMode = mode;

    if (mode === 'pinned-journey') {
      buildPinnedJourney();
    } else {
      buildPlainFlow();
    }
  }

  applyMode(detectMode());

  if (window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener) {
    window
      .matchMedia('(prefers-reduced-motion: reduce)')
      .addEventListener('change', function () {
        applyMode(detectMode());
      });
  }

  // ---------- Asset-load refresh ----------

  function whenAssetsReady() {
    var imgPromises = Array.prototype.slice.call(document.images).map(function (img) {
      if (img.complete) return Promise.resolve();
      return new Promise(function (resolve) {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });
    var fontsPromise = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    return Promise.all(imgPromises.concat([fontsPromise]));
  }

  whenAssetsReady().then(function () {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  // ---------- Resize handling (debounced) ----------

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      applyMode(detectMode());
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 150);
  });
})();
