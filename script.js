/* =============================================
   A/C Technical Services UAE — script.js
   ============================================= */

'use strict';

// ===== SCROLL REVEAL ANIMATION =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger sibling reveals
      const siblings = entry.target.parentElement?.querySelectorAll('.reveal:not(.visible)') || [];
      const idx = Array.from(siblings).indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const headerTop = document.querySelector('.header-top');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = scrollY;
}, { passive: true });


// ===== MOBILE HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navCta = document.querySelector('.nav-cta');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks?.classList.toggle('open');
  navCta?.classList.toggle('open');
});

// Close on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('open');
    navCta?.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar?.contains(e.target)) {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('open');
    navCta?.classList.remove('open');
  }
});


// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      active?.classList.add('active');
    }
  });
}, { rootMargin: '-30% 0px -65% 0px' });

sections.forEach(s => sectionObserver.observe(s));


// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      const target = parseInt(entry.target.dataset.target, 10);
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
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));


// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-a').classList.remove('open');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
    }
  });
});


// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name     = document.getElementById('name').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const emirate  = document.getElementById('emirate').value;
  const service  = document.getElementById('service').value;
  const message  = document.getElementById('message').value.trim();

  // Validate required fields
  if (!name || !phone) {
    shakeBtn();
    // Highlight empty fields
    if (!name)  document.getElementById('name').style.borderColor  = '#ff4757';
    if (!phone) document.getElementById('phone').style.borderColor = '#ff4757';
    return;
  }

  // Reset border colors
  document.getElementById('name').style.borderColor  = '';
  document.getElementById('phone').style.borderColor = '';

  // Build WhatsApp message
  let waMsg = `Hello! I'd like to book an AC service.\n\n`;
  waMsg += `👤 Name: ${name}\n`;
  waMsg += `📞 Phone: ${phone}\n`;
  if (emirate)  waMsg += `📍 Location: ${emirate}\n`;
  if (service)  waMsg += `🔧 Service: ${service}\n`;
  if (message)  waMsg += `📝 Details: ${message}\n`;
  waMsg += `\nPlease confirm my booking. Thank you!`;

  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    // Open WhatsApp with pre-filled message
    const waURL = `https://wa.me/971567571868?text=${encodeURIComponent(waMsg)}`;
    window.open(waURL, '_blank');

    // Show success
    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Sent! Opening WhatsApp...';
    submitBtn.style.background = '#00b894';
    submitBtn.style.boxShadow = '0 4px 16px rgba(0,184,148,0.4)';

    // Reset after 4 seconds
    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Book AC Service Now';
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      submitBtn.style.boxShadow = '';
    }, 4000);
  }, 800);
});

function shakeBtn() {
  submitBtn.style.animation = 'none';
  submitBtn.offsetHeight; // reflow
  submitBtn.style.animation = 'shake 0.5s ease';
  submitBtn.addEventListener('animationend', () => {
    submitBtn.style.animation = '';
  }, { once: true });
}


// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ===== ADD SHAKE ANIMATION =====
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);


// ===== HERO BADGE — SHOW AFTER DELAY =====
const heroBadge = document.querySelector('.hero-badge');
if (heroBadge) {
  heroBadge.style.opacity = '0';
  heroBadge.style.transform = 'translateY(-10px)';
  heroBadge.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';
  requestAnimationFrame(() => {
    heroBadge.style.opacity = '1';
    heroBadge.style.transform = 'translateY(0)';
  });
}


// ===== STAGGERED HERO REVEAL =====
const heroRevealEls = document.querySelectorAll('.hero-content .reveal');
heroRevealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.7s ease ${0.15 + i * 0.12}s, transform 0.7s ease ${0.15 + i * 0.12}s`;
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 100);
});


// ===== FLOATING BUTTON HIDE ON FORM VISIBLE =====
const floatingBtns = document.querySelector('.floating-buttons');
const contactSection = document.getElementById('contact');

if (floatingBtns && contactSection) {
  const hideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      floatingBtns.style.opacity = entry.isIntersecting ? '0' : '1';
      floatingBtns.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0.3 });
  hideObserver.observe(contactSection);
}


// ===== LOG =====
console.log('%cA/C Technical Services UAE', 'color:#0057ff;font-size:18px;font-weight:bold;');
console.log('%cProfessional HVAC Services — +971 56 757 1868', 'color:#475569;font-size:12px;');
