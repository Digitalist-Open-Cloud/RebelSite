// Main JavaScript for RebelMetrics.io
class RebelMetricsApp {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = translations;
        this.init();
    }

    init() {
        this.detectLanguage();
        this.loadHeader();
        this.loadFooter();
        this.setupEventListeners();
        this.translatePage();
        this.setupMobileMenu();
        this.setupContactForm();
        this.setupSmoothScrolling();
    }

    detectLanguage() {
        // Get language from URL path
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment);
        
        if (pathSegments.length > 0) {
            const langFromPath = pathSegments[0];
            if (this.translations[langFromPath]) {
                this.currentLanguage = langFromPath;
            }
        } else {
            // Default to English for root path
            this.currentLanguage = 'en';
        }

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    loadHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        // Build the correct home URL based on current language
        let homeUrl = '/';
        if (this.currentLanguage !== 'en') {
            homeUrl = '/' + this.currentLanguage + '/';
        } else {
            homeUrl = '/en/';
        }

        header.innerHTML = `
            <div class="container">
                <div class="header-content">
                    <div class="logo-section">
                        <a href="${homeUrl}" class="logo">
                            <img src="../images/rebel.png" alt="RebelMetrics" height="40">
                            <span class="logo-text">RebelMetrics</span>
                        </a>
                        <div class="powered-by">
                            <span class="powered-by-text" data-translate="header.by">By</span>
                            <a href="https://digitalist.cloud" target="_blank" rel="noopener" class="digitalist-logo">
                                <img src="../images/Digitalist-Open Cloud-Logo.png" alt="Digitalist.cloud" height="30">
                            </a>
                        </div>
                    </div>
                    <nav>
                        <ul class="nav-menu">
                            <li><a href="${homeUrl}#services" data-translate="nav.services">Services</a></li>
                            <li><a href="${homeUrl}features.html" data-translate="nav.features">Features</a></li>
                            <li><a href="${homeUrl}#customers" data-translate="nav.customers">Customers</a></li>
                            <li><a href="${homeUrl}#contact" data-translate="nav.contact">Contact</a></li>
                        </ul>
                    </nav>
                    <div class="header-actions">
                        <div class="language-selector">
                            <button class="language-btn ${this.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">EN</button>
                            <button class="language-btn ${this.currentLanguage === 'sv' ? 'active' : ''}" data-lang="sv">SV</button>
                            <button class="language-btn ${this.currentLanguage === 'de' ? 'active' : ''}" data-lang="de">DE</button>
                        </div>
                        <button class="mobile-menu-toggle" aria-label="Toggle menu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for language switching
        const langButtons = header.querySelectorAll('.language-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            });
        });
    }

    loadFooter() {
        const footer = document.getElementById('footer');
        if (!footer) return;

        footer.innerHTML = `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3 data-translate="footer.about">About Us</h3>
                        <p>RebelMetrics delivers secure analytics services built on Matomo, with hosting in EU data centers.</p>
                    </div>
                    <div class="footer-section">
                        <h3 data-translate="footer.services">Services</h3>
                        <ul>
                            <li><a href="#services">Matomo Analytics</a></li>
                            <li><a href="#services">Premium Dashboards</a></li>
                            <li><a href="#services">Survey Forms</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3 data-translate="footer.newsletter.title">Newsletter</h3>
                        <p data-translate="footer.newsletter.description">Want to keep track of our free webinars or upcoming courses? Subscribe to our newsletter!</p>
                        <form class="newsletter-form">
                            <input type="email" placeholder="Your email" required>
                            <button type="submit" class="btn btn-primary" data-translate="footer.newsletter.subscribe">Subscribe</button>
                        </form>
                    </div>
                    <div class="footer-section">
                        <h3 data-translate="footer.social">Follow Us</h3>
                        <div class="social-links">
                            <a href="#" aria-label="LinkedIn">LinkedIn</a>
                            <a href="#" aria-label="Twitter">Twitter</a>
                            <a href="#" aria-label="GitHub">GitHub</a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <div class="footer-links">
                        <a href="#terms" data-translate="footer.terms">Terms & Conditions</a>
                        <a href="#privacy" data-translate="footer.privacy">Privacy Policy</a>
                    </div>
                    <div class="footer-info">
                        <p data-translate="footer.energy">This website is using 100% renewable energy</p>
                        <p>&copy; 2024 RebelMetrics. All rights reserved.</p>
                    </div>
                </div>
            </div>
        `;

        // Add newsletter form handler
        const newsletterForm = footer.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(e.target);
            });
        }
    }

    switchLanguage(lang) {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        // Get the base path for GitHub Pages
        function getBasePath() {
            // Check if we're on GitHub Pages with repository name
            if (currentPath.includes('/RebelSite/')) {
                return '/RebelSite';
            }
            return '';
        }
        
        const basePath = getBasePath();
        
        // Handle features page
        if (currentPage === 'features.html') {
            window.location.href = basePath + '/' + lang + '/features.html';
        } else {
            window.location.href = basePath + '/' + lang + '/index.html';
        }
    }

    translatePage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.dataset.translate;
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update placeholders
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.dataset.translatePlaceholder;
            const translation = this.getTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });
    }

    getTranslation(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                return null;
            }
        }
        
        return translation;
    }

    setupEventListeners() {
        // Smooth scrolling for anchor links with URL rewriting
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    // Update URL with hash fragment
                    const currentUrl = window.location.pathname;
                    const newUrl = currentUrl + href;
                    window.history.pushState({}, '', newUrl);
                    
                    // Smooth scroll to target
                    target.scrollIntoView({ behavior: 'smooth' });
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const mobileToggle = document.querySelector('.mobile-menu-toggle');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        mobileToggle.classList.remove('active');
                    }
                }
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            const hash = window.location.hash;
            if (hash) {
                const target = document.querySelector(hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        // Scroll to section on page load if hash exists
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }

        // Intersection Observer for animations
        this.setupAnimations();
    }

    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.header') && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        }
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e.target);
            });
        }
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    handleNewsletterSignup(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        // Simulate newsletter signup (replace with actual API call)
        setTimeout(() => {
            alert('Thank you for subscribing to our newsletter!');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    setupSmoothScrolling() {
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.service-card, .feature-card, .customer-logo');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RebelMetricsApp();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .service-card, .feature-card, .customer-logo {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .service-card.animate-in, .feature-card.animate-in, .customer-logo.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .newsletter-form {
        display: flex;
        gap: 8px;
        margin-top: 1rem;
    }
    
    .newsletter-form input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
    }
    
    .social-links {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .social-links a {
        color: var(--text-light);
        text-decoration: none;
        transition: var(--transition);
    }
    
    .social-links a:hover {
        color: white;
    }
    
    .footer-links {
        display: flex;
        gap: 2rem;
        justify-content: center;
        margin-bottom: 1rem;
    }
    
    .footer-links a {
        color: var(--text-light);
        text-decoration: none;
        transition: var(--transition);
    }
    
    .footer-links a:hover {
        color: white;
    }
    
    .footer-info {
        text-align: center;
    }
    
    .footer-info p {
        margin-bottom: 0.5rem;
    }
    
    .section-description {
        text-align: center;
        font-size: 1.125rem;
        color: var(--text-secondary);
        margin-bottom: 3rem;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }
`;
document.head.appendChild(style); 