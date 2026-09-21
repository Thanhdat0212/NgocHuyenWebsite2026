(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Gift opening flow ---------- */
  var cover = document.getElementById('cover');
  var main = document.getElementById('main-content');
  var giftButton = document.getElementById('giftButton');
  var openGiftBtn = document.getElementById('openGift');
  var typedTextEl = document.getElementById('typedText');
  var fullGreeting = 'Chúc mừng sinh nhật, em bé của anh!';
  var opened = false;

  function typeGreeting(el, text, speed) {
    if (reduceMotion) {
      el.textContent = text;
      return;
    }
    var i = 0;
    (function step() {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(step, speed);
    })();
  }

  function spawnSparkleBurst() {
    if (reduceMotion) return;
    var burst = document.createElement('div');
    burst.className = 'sparkle-burst';
    var count = 10;
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      var angle = (Math.PI * 2 * i) / count;
      var dist = 70 + Math.random() * 40;
      var x = Math.cos(angle) * dist;
      var y = Math.sin(angle) * dist;
      s.style.setProperty('--spark-move', 'translate(' + x + 'px,' + y + 'px)');
      s.style.left = '50%';
      s.style.top = '38%';
      s.style.animationDelay = (Math.random() * .12) + 's';
      burst.appendChild(s);
    }
    cover.appendChild(burst);
    setTimeout(function () {
      if (burst.parentNode) burst.parentNode.removeChild(burst);
    }, 1200);
  }

  function openGift() {
    if (opened) return;
    opened = true;

    giftButton.classList.add('is-opening');
    spawnSparkleBurst();

    var leaveDelay = reduceMotion ? 0 : 480;
    var revealDelay = reduceMotion ? 0 : 900;

    setTimeout(function () {
      cover.classList.add('is-leaving');
    }, leaveDelay);

    setTimeout(function () {
      cover.setAttribute('hidden', '');
      main.removeAttribute('hidden');
      var firstChapter = main.querySelector('.chapter');
      if (firstChapter) {
        firstChapter.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
      typeGreeting(typedTextEl, fullGreeting, 55);
      initReveal();
    }, revealDelay);
  }

  giftButton.addEventListener('click', openGift);
  openGiftBtn.addEventListener('click', openGift);

  /* ---------- Scroll reveal ---------- */
  var revealInitialized = false;

  function initReveal() {
    if (revealInitialized) return;
    revealInitialized = true;
    var targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(function (t) { observer.observe(t); });
  }

  /* ---------- Candle / wish ---------- */
  var candleBtn = document.getElementById('candleBtn');
  var flame = document.getElementById('flame');
  var smoke = document.getElementById('smoke');
  var wishText = document.getElementById('wishText');
  var confettiField = document.getElementById('confettiField');
  var candleLit = true;

  var confettiColors = ['#6E2A3A', '#C9A24B', '#ECC9CB'];

  function spawnConfetti() {
    if (reduceMotion) return;
    for (var i = 0; i < 14; i++) {
      var piece = document.createElement('span');
      piece.style.left = (10 + Math.random() * 80) + '%';
      piece.style.background = confettiColors[i % confettiColors.length];
      piece.style.animationDelay = (Math.random() * .25) + 's';
      piece.style.animationDuration = (1.2 + Math.random() * .6) + 's';
      confettiField.appendChild(piece);
      (function (el) {
        el.addEventListener('animationend', function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        });
      })(piece);
    }
  }

  candleBtn.addEventListener('click', function () {
    if (!candleLit) return;
    candleLit = false;
    flame.classList.add('out');
    smoke.hidden = false;
    candleBtn.classList.add('is-blown');
    spawnConfetti();
    setTimeout(function () {
      wishText.classList.add('is-shown');
    }, 350);
  });

  /* ---------- Final message ---------- */
  var sendLoveBtn = document.getElementById('sendLove');
  var notSent = document.getElementById('notSent');
  var loveSent = document.getElementById('loveSent');

  sendLoveBtn.addEventListener('click', function () {
    notSent.hidden = true;
    loveSent.classList.add('is-shown');
  }, { once: true });

  /* ---------- Lightbox gallery ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.memory-card'));
  var currentIndex = 0;
  var lastFocused = null;

  function openLightbox(index) {
    currentIndex = index;
    var card = cards[currentIndex];
    lightboxImg.src = card.getAttribute('data-src');
    lightboxImg.alt = card.getAttribute('data-caption');
    lightboxCaption.textContent = card.getAttribute('data-caption');
    lastFocused = document.activeElement;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function showRelative(delta) {
    currentIndex = (currentIndex + delta + cards.length) % cards.length;
    var card = cards[currentIndex];
    lightboxImg.src = card.getAttribute('data-src');
    lightboxImg.alt = card.getAttribute('data-caption');
    lightboxCaption.textContent = card.getAttribute('data-caption');
  }

  cards.forEach(function (card, index) {
    card.addEventListener('click', function () { openLightbox(index); });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', function () { showRelative(-1); });
  lightboxNext.addEventListener('click', function () { showRelative(1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hasAttribute('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });
})();
