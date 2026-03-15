/* ================================================
   AC Technical Services UAE — script.js
   ================================================ */
'use strict';

/* ===== SCROLL REVEAL ===== */
const revealAll = () => {
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // Stagger siblings
        const siblings = Array.from(
          entry.target.parentElement?.querySelectorAll('[data-reveal]:not(.visible)') || []
        );
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
  });
};
revealAll();


/* ===== STICKY NAV ===== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ===== MOBILE MENU ===== */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const navCta = document.querySelector('.nav-cta');
let menuOpen = false;

burger?.addEventListener('click', e => {
  e.stopPropagation();
  menuOpen = !menuOpen;
  burger.classList.toggle('open', menuOpen);
  navLinks?.classList.toggle('open', menuOpen);
  navCta?.classList.toggle('open', menuOpen);
});

document.querySelectorAll('#navLinks a').forEach(a => {
  a.addEventListener('click', () => {
    menuOpen = false;
    burger?.classList.remove('open');
    navLinks?.classList.remove('open');
    navCta?.classList.remove('open');
  });
});

document.addEventListener('click', e => {
  if (!header?.contains(e.target) && menuOpen) {
    menuOpen = false;
    burger?.classList.remove('open');
    navLinks?.classList.remove('open');
    navCta?.classList.remove('open');
  }
});


/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('#navLinks a');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      document.querySelector(`#navLinks a[href="#${e.target.id}"]`)?.classList.add('active');
    }
  });
}, { rootMargin: '-25% 0px -70% 0px' }).observe && sections.forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        document.querySelector(`#navLinks a[href="#${e.target.id}"]`)?.classList.add('active');
      }
    });
  }, { rootMargin: '-25% 0px -70% 0px' }).observe(s);
});


/* ===== COUNTER ANIMATION ===== */
document.querySelectorAll('.counter').forEach(el => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = '1';
      const target = +e.target.dataset.target;
      let cur = 0;
      const step = target / (1600 / 16);
      const tick = () => {
        cur = Math.min(cur + step, target);
        e.target.textContent = Math.floor(cur);
        if (cur < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 }).observe(el);
});


/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const ans = item?.querySelector('.faq-a');
    const isOpen = item?.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a')?.classList.remove('open');
    });

    // Open clicked if was closed
    if (!isOpen) {
      item?.classList.add('open');
      ans?.classList.add('open');
    }
  });
});


/* ===== CONTACT FORM → WHATSAPP ===== */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

form?.addEventListener('submit', e => {
  e.preventDefault();

  const name    = document.getElementById('c-name')?.value.trim();
  const phone   = document.getElementById('c-phone')?.value.trim();
  const city    = document.getElementById('c-city')?.value;
  const service = document.getElementById('c-service')?.value;
  const msg     = document.getElementById('c-msg')?.value.trim();

  // Validate
  if (!name) { flash('c-name'); return; }
  if (!phone) { flash('c-phone'); return; }

  // Reset borders
  ['c-name', 'c-phone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.borderColor = '';
  });

  // Build message
  let text = `Hello! I'd like to book a service with AC Technical Services.\n\n`;
  text += `👤 Name: ${name}\n📞 Phone: ${phone}\n`;
  if (city) text += `📍 City: ${city}\n`;
  if (service) text += `🔧 Service: ${service}\n`;
  if (msg) text += `📝 Details: ${msg}\n`;
  text += `\nPlease confirm my booking. Thank you!`;

  // Loading
  const orig = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Opening WhatsApp...</span>';
  submitBtn.disabled = true;

  setTimeout(() => {
    window.open(`https://wa.me/971567571868?text=${encodeURIComponent(text)}`, '_blank');

    // Success
    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Sent! We\'ll reply shortly.</span>';
    submitBtn.style.background = '#059669';

    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = orig;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 4000);
  }, 800);
});

function flash(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#ef4444';
  el.focus();
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}


/* ===== INJECT SHAKE CSS ===== */
const s = document.createElement('style');
s.textContent = `.shake{animation:shake .4s ease} @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`;
document.head.appendChild(s);


/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = (header?.offsetHeight || 68) + 8;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});


/* ===== HERO SERVICE BAR ANIMATION ===== */
let activeIdx = 0;
const hpsItems = document.querySelectorAll('.hps-item');
if (hpsItems.length > 0) {
  setInterval(() => {
    hpsItems.forEach(i => i.classList.remove('active'));
    activeIdx = (activeIdx + 1) % hpsItems.length;
    hpsItems[activeIdx].classList.add('active');
  }, 2500);
}


/* ===== FLOATING WA HIDE NEAR FOOTER ===== */
const floatWa = document.querySelector('.float-wa');
const footer = document.querySelector('.footer');
if (floatWa && footer) {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (floatWa) {
        floatWa.style.opacity = e.isIntersecting ? '0' : '1';
        floatWa.style.pointerEvents = e.isIntersecting ? 'none' : 'auto';
        floatWa.style.transition = 'opacity .3s ease';
      }
    });
  }, { threshold: 0.15 }).observe(footer);
}


console.log('%cAC Technical Services UAE', 'color:#0052CC;font-weight:800;font-size:16px');
console.log('%c+971 56 757 1868 | Dubai & All UAE', 'color:#64748b;font-size:12px');
