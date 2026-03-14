/* ═══════════════════════════════════════════════════════
   MAIN.JS — Lost in the Scroll
   V2 cleanup
   ═══════════════════════════════════════════════════════ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function rnd(max) {
  return (Math.random() - 0.5) * max * 2;
}

function scrollToTarget(target) {
  if (!target) return;

  if (window.scrollToSection) {
    window.scrollToSection(target);
  } else {
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  }
}

function spawnSparkle(x, y, size = 3 + Math.random() * 4.5, variant = '') {
  const sparkle = document.createElement('div');
  sparkle.className = `cursor-sparkle ${variant}`.trim();
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;
  document.body.appendChild(sparkle);
  return sparkle;
}

function burstSparkles(x, y, options = {}) {
  const {
    count = 14,
    spread = 72,
    duration = 0.8,
    variant = 'cursor-sparkle--warm'
  } = options;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 10 + Math.random() * spread;
    const sparkle = spawnSparkle(x, y, 2.5 + Math.random() * 5, variant);

    gsap.to(sparkle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - (8 + Math.random() * 16),
      opacity: 0,
      scale: 0,
      duration: duration + Math.random() * 0.35,
      ease: 'power2.out',
      onComplete: () => sparkle.remove()
    });
  }
}

let restartSpellActive = false;

function playRestartStoryAnimation(btn, target) {
  if (!btn || !target) return;

  if (restartSpellActive || prefersReducedMotion || typeof gsap === 'undefined') {
    scrollToTarget(target);
    return;
  }

  restartSpellActive = true;
  btn.classList.add('is-restarting');
  btn.setAttribute('aria-disabled', 'true');

  const buttonRect = btn.getBoundingClientRect();
  const origin = {
    x: buttonRect.left + buttonRect.width / 2,
    y: buttonRect.top + buttonRect.height / 2
  };

  const logo = document.querySelector('.nav__logo');
  const logoRect = logo ? logo.getBoundingClientRect() : null;
  const destination = logoRect
    ? {
      x: logoRect.left + logoRect.width / 2,
      y: logoRect.top + logoRect.height / 2
    }
    : {
      x: window.innerWidth * 0.5,
      y: 76
    };

  burstSparkles(origin.x, origin.y, { count: 20, spread: 90, duration: 0.9 });

  const comet = spawnSparkle(origin.x, origin.y, 14, 'restart-comet');
  const trailPoint = { x: origin.x, y: origin.y };

  gsap.fromTo(btn, {
    scale: 1
  }, {
    scale: 0.92,
    duration: 0.14,
    yoyo: true,
    repeat: 1,
    ease: 'power1.inOut'
  });

  gsap.to(trailPoint, {
    x: destination.x,
    y: destination.y,
    duration: 1.05,
    ease: 'power2.inOut',
    onUpdate: () => {
      comet.style.left = `${trailPoint.x}px`;
      comet.style.top = `${trailPoint.y}px`;

      if (Math.random() < 0.75) {
        const tail = spawnSparkle(
          trailPoint.x + rnd(8),
          trailPoint.y + rnd(8),
          2 + Math.random() * 3,
          'cursor-sparkle--warm'
        );

        gsap.to(tail, {
          x: rnd(20),
          y: rnd(20),
          opacity: 0,
          scale: 0,
          duration: 0.38 + Math.random() * 0.24,
          ease: 'power2.out',
          onComplete: () => tail.remove()
        });
      }
    },
    onComplete: () => {
      burstSparkles(destination.x, destination.y, { count: 12, spread: 54, duration: 0.72 });
      comet.remove();
    }
  });

  gsap.delayedCall(0.14, () => {
    scrollToTarget(target);
  });

  gsap.delayedCall(1.36, () => {
    restartSpellActive = false;
    btn.classList.remove('is-restarting');
    btn.removeAttribute('aria-disabled');
  });
}

function createCodeTypewriter(block) {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.nodeValue || !node.nodeValue.length) continue;

    textNodes.push({
      node,
      fullText: node.nodeValue
    });
  }

  if (!textNodes.length) return null;

  const totalChars = textNodes.reduce((sum, part) => sum + part.fullText.length, 0);
  const progress = { chars: 0 };
  const originalMinHeight = block.style.minHeight;
  const lockedHeight = block.offsetHeight;
  let hasPlayed = false;

  block.style.minHeight = `${lockedHeight}px`;

  const render = () => {
    let remaining = progress.chars;

    textNodes.forEach((part) => {
      if (remaining <= 0) {
        part.node.nodeValue = '';
        return;
      }

      if (remaining >= part.fullText.length) {
        part.node.nodeValue = part.fullText;
        remaining -= part.fullText.length;
        return;
      }

      part.node.nodeValue = part.fullText.slice(0, remaining);
      remaining = 0;
    });
  };

  render();

  const tween = gsap.to(progress, {
    chars: totalChars,
    duration: Math.max(1.2, Math.min(5, totalChars / 28)),
    ease: 'none',
    snap: { chars: 1 },
    paused: true,
    onStart: () => {
      block.classList.add('is-typing');
    },
    onUpdate: render,
    onComplete: () => {
      block.classList.remove('is-typing');
      block.style.minHeight = originalMinHeight;
    }
  });

  return {
    play() {
      if (hasPlayed) return;
      hasPlayed = true;
      tween.play(0);
    }
  };
}

/* THEME */
const ThemeManager = {
  KEY: 'tale-theme',

  init() {
    const saved = localStorage.getItem(this.KEY);

    if (saved) {
      this.apply(saved);
    } else {
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.apply(sysDark ? 'dark' : 'light');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.KEY)) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    if (theme === 'dark') {
      btn.textContent = '☀ Dawn';
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      btn.textContent = '☽ Dusk';
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(this.KEY, next);
    this.apply(next);
  }
};

/* STARS */
const StarsCanvas = {
  init() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    const stars = [];
    const count = 120;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.003 + 0.001,
        phase: Math.random() * Math.PI * 2
      });
    }

    const draw = (t = 0) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 213, 163, ${a})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }
};

/* FIREFLIES */
const Fireflies = {
  init() {
    if (prefersReducedMotion) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 18; i++) {
      const ff = document.createElement('div');
      ff.className = 'firefly';
      ff.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${20 + Math.random() * 70}%;
        animation: firefly-drift ${5 + Math.random() * 8}s ${Math.random() * 5}s ease-in-out infinite alternate;
      `;
      hero.appendChild(ff);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes firefly-drift {
        from { transform: translate(0, 0) scale(1); opacity: 0.7; }
        25%  { transform: translate(${rnd(30)}px, ${rnd(20)}px) scale(0.8); opacity: 0.3; }
        50%  { transform: translate(${rnd(50)}px, ${rnd(30)}px) scale(1.2); opacity: 0.9; }
        75%  { transform: translate(${rnd(20)}px, ${rnd(40)}px) scale(0.7); opacity: 0.4; }
        to   { transform: translate(${rnd(40)}px, ${rnd(25)}px) scale(1); opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
  }
};

/* CURSOR SPARKLES */
const CursorSparkle = {
  init() {
    if (prefersReducedMotion || typeof gsap === 'undefined') return;

    document.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.15) return;

      const s = document.createElement('div');
      s.className = 'cursor-sparkle';
      s.style.left = `${e.clientX}px`;
      s.style.top = `${e.clientY}px`;
      s.style.width = `${3 + Math.random() * 5}px`;
      s.style.height = s.style.width;
      document.body.appendChild(s);

      gsap.to(s, {
        y: -30 - Math.random() * 30,
        x: rnd(20),
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: () => s.remove()
      });
    });
  }
};

const Nav = {
  init() {
    const nav = document.querySelector('.nav');
    const progress = document.querySelector('.reading-progress');

    if (typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (nav) {
          nav.classList.toggle('scrolled', self.scroll() > 60);
        }

        if (progress) {
          const pct = self.progress * 100;
          progress.style.width = `${pct}%`;
          progress.setAttribute('aria-valuenow', Math.round(pct));
        }
      }
    });
  }
};

const StoryNav = {
  init() {
    const links = document.querySelectorAll('.story-nav__link');
    if (!links.length || typeof ScrollTrigger === 'undefined') return;

    links.forEach((link) => {
      const href = link.getAttribute('href');
      const section = href ? document.querySelector(href) : null;
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) {
            links.forEach((l) => l.classList.remove('is-active'));
            link.classList.add('is-active');
          }
        }
      });

      link.addEventListener('click', (e) => {
        e.preventDefault();

        if (window.scrollToSection) {
          window.scrollToSection(section);
        } else {
          section.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
};

function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  let smoother = null;

  if (!prefersReducedMotion && typeof ScrollSmoother !== 'undefined') {
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      effects: true,
      smoothTouch: 0.1
    });
  }

  window.scrollToSection = (target) => {
    if (!target) return;

    if (smoother && !prefersReducedMotion) {
      smoother.scrollTo(target, true, 'top top');
    } else {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  /* HERO */
  const heroTl = gsap.timeline({ delay: 0.2 });

  heroTl
    .from('.hero__eyebrow', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out'
    })
    .from('.hero__title', {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: 'expo.out'
    }, '-=0.4')
    .from('.hero__subtitle', {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero__desc', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power2.out'
    }, '-=0.4')
    .from('.hero__scroll-cue', {
      opacity: 0,
      y: -15,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.2')
    .from('.hero__illustration', {
      opacity: 0,
      scale: 0.8,
      rotation: -5,
      duration: 1.2,
      ease: 'elastic.out(1, 0.6)'
    }, '-=1.2');

  /* REVEALS */
  const codeTypewriters = new Map();

  if (!prefersReducedMotion) {
    gsap.utils.toArray('.spell-scroll:not(.showpiece__code)').forEach((block) => {
      const typewriter = createCodeTypewriter(block);
      if (typewriter) {
        codeTypewriters.set(block, typewriter);
      }
    });
  }

  gsap.utils.toArray('.chapter-label').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      },
      opacity: 0,
      x: -30,
      duration: 0.6,
      ease: 'power2.out'
    });
  });

  gsap.utils.toArray('.chapter__heading').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 82%'
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'expo.out'
    });
  });

  gsap.utils.toArray('.chapter__body p').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%'
      },
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  gsap.utils.toArray('.ornament').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      },
      scaleX: 0,
      opacity: 0,
      transformOrigin: 'center',
      duration: 0.9,
      ease: 'expo.out'
    });
  });

  gsap.utils.toArray('.cards-grid').forEach((grid) => {
    const cards = grid.querySelectorAll('.concept-card');

    gsap.from(cards, {
      scrollTrigger: {
        trigger: grid,
        start: 'top 82%'
      },
      opacity: 0,
      y: 60,
      scale: 0.94,
      stagger: 0.12,
      duration: 0.8,
      ease: 'back.out(1.4)'
    });
  });

  gsap.utils.toArray('.spell-scroll:not(.showpiece__code)').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const typewriter = codeTypewriters.get(el);
          if (typewriter) {
            typewriter.play();
          }
        }
      },
      opacity: 0,
      x: 30,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  gsap.utils.toArray('.illustration').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      },
      opacity: 0,
      scale: 0.75,
      rotation: -8,
      duration: 1.1,
      ease: 'elastic.out(1, 0.7)'
    });
  });

  gsap.utils.toArray('blockquote').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%'
      },
      opacity: 0,
      x: -40,
      duration: 0.9,
      ease: 'power3.out'
    });
  });

  /* SCRUBS */
  gsap.to('.hero__illustration', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    },
    y: -80,
    rotation: 8,
    opacity: 0.3,
    scale: 0.9,
    ease: 'none'
  });

  gsap.utils.toArray('.chapter').forEach((chapter) => {
    const bg = chapter.querySelector('.mist-bg');
    if (!bg) return;

    gsap.to(bg, {
      scrollTrigger: {
        trigger: chapter,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      },
      y: -60,
      ease: 'none'
    });
  });

  gsap.to('.ch-variables .illustration', {
    scrollTrigger: {
      trigger: '.ch-variables',
      start: 'top center',
      end: 'bottom top',
      scrub: 1
    },
    y: -40,
    ease: 'none'
  });

  gsap.to('.ch-loops .illustration', {
    scrollTrigger: {
      trigger: '.ch-loops',
      start: 'top center',
      end: 'bottom top',
      scrub: 2
    },
    rotation: 180,
    ease: 'none'
  });

  gsap.to('.ch-devtools .illustration', {
    scrollTrigger: {
      trigger: '.ch-devtools',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    y: -16,
    rotation: 5,
    yoyo: true,
    repeat: -1,
    duration: 2.2,
    ease: 'sine.inOut'
  });

  gsap.to('.ch-tokens .illustration', {
    scrollTrigger: {
      trigger: '.ch-tokens',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    scale: 1.04,
    rotation: 6,
    yoyo: true,
    repeat: -1,
    duration: 2.6,
    ease: 'sine.inOut'
  });

  gsap.to('.async-hourglass', {
    scrollTrigger: {
      trigger: '.ch-async',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    scaleY: 1.05,
    scaleX: 0.97,
    yoyo: true,
    repeat: -1,
    duration: 1.5,
    ease: 'sine.inOut'
  });

  /* SHOWPIECE */
  const showpiece = document.querySelector('.showpiece');
  if (showpiece) {
    const steps = gsap.utils.toArray('.showpiece__step');

    if (!steps.length) {
      ScrollTrigger.refresh();
      return;
    }

    gsap.set(steps, { autoAlpha: 0, y: 40, scale: 0.98 });
    gsap.set(steps[0], { autoAlpha: 1, y: 0, scale: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: showpiece,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: '.showpiece__sticky',
        anticipatePin: 1
      }
    });

    steps.forEach((step, i) => {
      if (i === 0) return;

      tl.to(steps[i - 1], {
        autoAlpha: 0,
        y: -32,
        scale: 0.97,
        duration: 0.9,
        ease: 'power2.inOut'
      })
        .to(step, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power2.out'
      }, '<0.08');
    });
  }

  gsap.from('.footer', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%'
    },
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'power2.out'
  });

  ScrollTrigger.refresh();
}

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  StarsCanvas.init();

  if (!prefersReducedMotion) {
    Fireflies.init();
    CursorSparkle.init();
  }

  requestAnimationFrame(() => {
    initGSAP();
    Nav.init();
    StoryNav.init();
  });

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => ThemeManager.toggle());
  }

  document.querySelectorAll('[data-scroll-to]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scrollTo);
      if (!target) return;

      if (btn.classList.contains('btn-restart')) {
        playRestartStoryAnimation(btn, target);
        return;
      }

      scrollToTarget(target);
    });
  });
});