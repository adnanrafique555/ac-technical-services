/**
 * AC Technical Services - Main JavaScript
 * Modern, responsive website with smooth animations
 */

// ============================================
// DOM Elements
// ============================================

const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const bookingForm = document.getElementById('booking-form');
const navLinks = document.querySelectorAll('.nav-link');

// ============================================
// Navigation - Sticky & Mobile Menu
// ============================================

/**
 * Handle sticky navigation on scroll
 */
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/**
 * Toggle mobile menu
 */
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

/**
 * Close mobile menu when nav link is clicked
 */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

/**
 * Smooth scroll to section
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href !== '#') {
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const topOffset = 80; // Account for sticky navbar
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - topOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// Form Handling
// ============================================

/**
 * Handle booking form submission
 */
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(bookingForm);
    const name = bookingForm.querySelector('input[type="text"]').value;
    const phone = bookingForm.querySelector('input[type="tel"]').value;
    const serviceType = bookingForm.querySelector('select').value;
    const message = bookingForm.querySelector('textarea').value;
    
    // Validate form
    if (!name || !phone || !serviceType || !message) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    // Phone number validation (basic)
    if (!isValidPhone(phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    // Create WhatsApp message
    const whatsappMessage = `Hello! I would like to book a service.
    
Name: ${name}
Phone: ${phone}
Service Type: ${serviceType}
Details: ${message}`;
    
    // Send via WhatsApp
    const whatsappLink = `https://wa.me/0567571868?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappLink, '_blank');
    
    // Reset form
    bookingForm.reset();
    
    showNotification('Your request has been sent! We will contact you soon.', 'success');
});

// ============================================
// Utility Functions
// ============================================

/**
 * Validate phone number
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(phone);
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 px-6 py-4 rounded-lg font-semibold text-white z-50 animation-fade-in ${
        type === 'success' 
            ? 'bg-green-500 shadow-lg' 
            : 'bg-red-500 shadow-lg'
    }`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    notification.style.animation = 'slideInRight 0.3s ease-out';
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Counter animation for statistics
 */
function animateCounter(element, target, duration = 2000) {
    let current =