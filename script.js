(function () {
  const heartPath = 'M12 21s-6.716-4.35-9.428-8.485C.325 9.028 1.42 5 5.2 5c2.076 0 3.396 1.14 4.8 3 1.404-1.86 2.724-3 4.8-3 3.78 0 4.875 4.028 2.628 7.515C18.716 16.65 12 21 12 21z';

  function makeHearts(container, count) {
    const accent = '#B3445C';
    const accent2 = '#C9A24B';
    for (let i = 0; i < count; i++) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'currentColor');
      const size = 14 + (i % 4) * 6;
      svg.style.left = ((i * 37) % 100) + '%';
      svg.style.width = size + 'px';
      svg.style.height = size + 'px';
      svg.style.color = i % 2 === 0 ? accent : accent2;
      svg.style.animationDuration = (9 + (i % 5) * 2) + 's';
      svg.style.animationDelay = (((i * 1.3) % 10).toFixed(1)) + 's';
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', heartPath);
      svg.appendChild(path);
      container.appendChild(svg);
    }
  }

  function typeGreeting(el, text, speed) {
    let i = 0;
    (function step() {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(step, speed);
    })();
  }

  document.addEventListener('DOMContentLoaded', function () {
    makeHearts(document.getElementById('hearts'), 10);

    const cover = document.getElementById('cover');
    const main = document.getElementById('main');
    const openGift = document.getElementById('openGift');
    const typedText = document.getElementById('typedText');

    openGift.addEventListener('click', function () {
      cover.hidden = true;
      main.hidden = false;
      typeGreeting(typedText, 'Chúc mừng sinh nhật, em bé của anh!', 55);
    }, { once: true });

    const candleBtn = document.getElementById('candleBtn');
    const flame = document.getElementById('flame');
    const smoke = document.getElementById('smoke');
    const wishText = document.getElementById('wishText');
    let candleLit = true;

    candleBtn.addEventListener('click', function () {
      if (!candleLit) return;
      candleLit = false;
      flame.classList.add('out');
      smoke.hidden = false;
      setTimeout(function () {
        wishText.hidden = false;
      }, 400);
    });

    const sendLoveBtn = document.getElementById('sendLove');
    const notSent = document.getElementById('notSent');
    const loveSent = document.getElementById('loveSent');

    sendLoveBtn.addEventListener('click', function () {
      notSent.hidden = true;
      loveSent.hidden = false;
    }, { once: true });
  });
})();
