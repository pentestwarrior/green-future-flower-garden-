/**
 * Green Future Flower Garden
 * Premium Corporate Landscaping Website
 * Vanilla JavaScript - Production Ready
 */

(function() {
    'use strict';

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const backToTop = document.getElementById('backToTop');
    const loadingScreen = document.getElementById('loading-screen');
    const contactForm = document.getElementById('contactForm');
    const yearSpan = document.getElementById('year');
    const statNumbers = document.querySelectorAll('.stat-number');
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    // Testimonials
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderDotsContainer = document.getElementById('sliderDots');

    // ============================================
    // LOADING SCREEN
    // ============================================
    function hideLoadingScreen() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Enable scroll after loading
            document.body.style.overflow = '';
        }, 1800);
    }

    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';

    // Hide loading when page is fully loaded
    if (document.readyState === 'complete') {
        hideLoadingScreen();
    } else {
        window.addEventListener('load', hideLoadingScreen);
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    function handleNavbarScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgressBar.style.width = scrollPercent + '%';
    }

    // ============================================
    // MOBILE MENU
    // ============================================
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 150;

        navLinks.forEach(link => {
            const sectionId = link.getAttribute('data-section');
            const section = document.getElementById(sectionId);

            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // ============================================
    // SMOOTH SCROLLING FOR NAV LINKS
    // ============================================
    function handleNavClick(e) {
        const link = e.target.closest('.nav-link');
        if (!link) return;

        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            closeMobileMenu();
        }
    }

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    function handleBackToTop() {
        const scrollY = window.scrollY;

        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    function initRevealAnimations() {
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ============================================
    // ANIMATED COUNTERS
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    function initCounters() {
        statNumbers.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // ============================================
    // TESTIMONIALS SLIDER
    // ============================================
    let currentSlide = 0;
    let autoSlideInterval;

    function createSliderDots() {
        testimonialCards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            sliderDotsContainer.appendChild(dot);
        });
    }

    function updateSlider() {
        testimonialCards.forEach((card, index) => {
            card.classList.remove('active', 'prev');
            if (index === currentSlide) {
                card.classList.add('active');
            } else if (index < currentSlide) {
                card.classList.add('prev');
            }
        });

        const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
        resetAutoSlide();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        updateSlider();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // ============================================
    // CONTACT FORM
    // ============================================
    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'var(--primary-dark)';

            showNotification('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    }

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.gf-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'gf-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 24px;
            padding: 16px 24px;
            border-radius: 12px;
            font-family: var(--font-accent);
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.4s ease forwards;
            max-width: 350px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        `;

        const colors = {
            success: { bg: '#e8f5e9', border: '#2d8a4e', color: '#1e6b3a', icon: 'fa-check-circle' },
            error: { bg: '#ffebee', border: '#e74c3c', color: '#c0392b', icon: 'fa-exclamation-circle' },
            info: { bg: '#e3f2fd', border: '#3498db', color: '#2980b9', icon: 'fa-info-circle' }
        };

        const style = colors[type] || colors.info;
        notification.style.background = style.bg;
        notification.style.borderLeft = `4px solid ${style.border}`;
        notification.style.color = style.color;

        notification.innerHTML = `
            <i class="fas ${style.icon}" style="margin-right: 10px;"></i>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease forwards';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }

    // Add notification animations to head
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(notificationStyles);

    // ============================================
    // CURRENT YEAR
    // ============================================
    function updateYear() {
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    // ============================================
    // PARALLAX EFFECT (subtle)
    // ============================================
    function handleParallax() {
        const heroBg = document.querySelector('.hero-bg-img');
        if (heroBg && window.innerWidth > 768) {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            if (scrollY < heroHeight) {
                heroBg.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
            }
        }
    }

    // ============================================
    // DEBOUNCE UTILITY
    // ============================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============================================
    // THROTTLE UTILITY
    // ============================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ============================================
    // SCROLL EVENT HANDLER
    // ============================================
    function handleScroll() {
        handleNavbarScroll();
        updateScrollProgress();
        handleBackToTop();
        updateActiveNavLink();
        handleParallax();
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        // Event Listeners
        window.addEventListener('scroll', throttle(handleScroll, 16));
        hamburger.addEventListener('click', toggleMobileMenu);
        mobileOverlay.addEventListener('click', closeMobileMenu);
        navMenu.addEventListener('click', handleNavClick);
        backToTop.addEventListener('click', scrollToTop);

        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
            nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
        }

        // Initialize features
        initRevealAnimations();
        initCounters();
        updateYear();
        createSliderDots();
        startAutoSlide();

        // Initial scroll check
        handleScroll();

        // Keyboard navigation for testimonials
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { prevSlide(); resetAutoSlide(); }
            if (e.key === 'ArrowRight') { nextSlide(); resetAutoSlide(); }
        });

        // Touch swipe for testimonials
        let touchStartX = 0;
        let touchEndX = 0;
        const slider = document.getElementById('testimonialsSlider');

        if (slider) {
            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoSlide();
            }
        }

        // Handle resize
        window.addEventListener('resize', debounce(() => {
            closeMobileMenu();
        }, 250));

        console.log('%c🌿 Green Future Flower Garden', 'color: #2d8a4e; font-size: 20px; font-weight: bold;');
        console.log('%cWebsite loaded successfully!', 'color: #6b7c6b; font-size: 14px;');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();