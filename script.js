/* ================================================
   A/C Technical Services UAE — script.js
   ================================================ */
'use strict';

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    // Stagger siblings for a wave effect
    const siblings = Array.from(
      entry.target.parentElement?.querySelectorAll('.reveal:not(.visible)') || []
    );
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), idx * 75);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));


/* ===== HERO FADE-UP ===== */
const fadeEls = document.querySelectorAll('.fade-up');
fadeEls.forEach((el, i) => {
  Object.assign(el.style, {
    opacity: '0',
    transform: 'translateY(22px)',
    transition: `opacity .7s ease ${0.1 + i * 0.1}s, transform .7s ease ${0.1 + i * 0.1}s`
  });
  requestAnimationFrame(() => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 80);
  });
});


/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ===== MOBILE NAVIGATION ===== */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navActions = document.querySelector('.nav-actions');

navToggle?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = navToggle.classList.toggle('open');
  navMenu?.classList.toggle('open', isOpen);
  navActions?.classList.toggle('open', isOpen);
});

// Close on link click
document.querySelectorAll('#navMenu a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle?.classList.remove('open');
    navMenu?.classList.remove('open');
    navActions?.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!siteHeader?.contains(e.target)) {
    navToggle?.classList.remove('open');
    navMenu?.classList.remove('open');
    navActions?.classList.remove('open');
  }
});


/* ===== ACTIVE NAV ON SCROLL ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#navMenu a');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`#navMenu a[href="#${entry.target.id}"]`);
      active?.classList.add('active');
    }
  });
}, { rootMargin: '-25% 0px -70% 0px' });
sections.forEach(s => secObs.observe(s));


/* ===== COUNTER ANIMATION ===== */
const counters = document.querySelectorAll('.counter');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = '1';
      const target = +entry.target.dataset.target;
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const tick = () => {
        current = Math.min(current + step, target);
        entry.target.textContent = Math.floor(current);
        if (current < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  });
}, { threshold: 0.6 });
counters.forEach(c => counterObs.observe(c));


/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');

    // Close all open items
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-a').classList.remove('open');
    });

    // Open this one if it was closed
    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
    }
  });
});


/* ===== SERVICE CARD ICON COLORS ===== */
document.querySelectorAll('.svc-card[data-color]').forEach(card => {
  const color = card.dataset.color;
  const icon = card.querySelector('.svc-icon');
  if (icon) {
    // Apply light bg tint using the color
    icon.style.cssText = `background:${color}18; color:${color}`;
    card.addEventListener('mouseenter', () => {
      icon.style.cssText = `background:${color}; color:#fff; transform:scale(1.1)`;
    });
    card.addEventListener('mouseleave', () => {
      icon.style.cssText = `background:${color}18; color:${color}; transform:scale(1)`;
    });
  }
});


/* ===== BOOKING FORM — SEND TO WHATSAPP ===== */
const bookingForm = document.getElementById('bookingForm');
const submitBtn = document.getElementById('submitBtn');

bookingForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('f-name').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const city    = document.getElementById('f-city').value;
  const service = document.getElementById('f-service').value;
  const msg     = document.getElementById('f-msg').value.trim();

  // Validate
  if (!name) { highlight('f-name'); return; }
  if (!phone) { highlight('f-phone'); return; }

  // Reset highlights
  ['f-name','f-phone'].forEach(id => {
    document.getElementById(id).style.borderColor = '';
  });

  // Build WhatsApp message
  let waText = `Hello A/C Technical Services!\n\nI'd like to book a service:\n\n`;
  waText += `👤 Name: ${name}\n`;
  waText += `📞 Phone: ${phone}\n`;
  if (city)    waText += `📍 City: ${city}\n`;
  if (service) waText += `🔧 Service: ${service}\n`;
  if (msg)     waText += `📝 Details: ${msg}\n`;
  waText += `\nPlease confirm my booking. Thank you!`;

  // Loading state
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Opening WhatsApp...</span>';
  submitBtn.disabled = true;
  submitBtn.style.background = '#6c63ff';

  setTimeout(() => {
    window.open(`https://wa.me/971567571868?text=${encodeURIComponent(waText)}`, '_blank');

    // Success state
    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Sent! We\'ll reply shortly.</span>';
    submitBtn.style.background = '#00b894';
    submitBtn.style.boxShadow = '0 6px 24px rgba(0,184,148,.4)';

    // Reset
    setTimeout(() => {
      bookingForm.reset();
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      submitBtn.style.boxShadow = '';
    }, 4000);
  }, 900);
});

function highlight(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#ff4757';
  el.focus();
  // Shake animation
  el.style.animation = 'shake .4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}


/* ===== FLOATING BUTTONS — HIDE NEAR FOOTER ===== */
const floatWrap = document.querySelector('.float-wrap');
const footer = document.querySelector('.site-footer');
if (floatWrap && footer) {
  const footObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      floatWrap.style.opacity = entry.isIntersecting ? '0' : '1';
      floatWrap.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
      floatWrap.style.transition = 'opacity .3s ease';
    });
  }, { threshold: 0.2 });
  footObs.observe(footer);
}


/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = (navbar?.offsetHeight || 70) + 12;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    }
  });
});


/* ===== INJECT SHAKE KEYFRAME ===== */
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-7px)}
    40%{transform:translateX(7px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
`;
document.head.appendChild(style);


/* ===== SERVICES STRIP DUPLICATION (seamless loop) ===== */
const strip = document.querySelector('.strip-inner');
if (strip) {
  strip.innerHTML += strip.innerHTML; // double for seamless scroll
}


/* ===== LOG ===== */
console.log('%cA/C Technical Services UAE', 'color:#0066ff;font-size:16px;font-weight:800;');
console.log('%c+971 56 757 1868 | Dubai & All UAE', 'color:#475569;font-size:12px');
