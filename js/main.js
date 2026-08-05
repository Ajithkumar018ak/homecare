document.addEventListener('DOMContentLoaded', () => {
  // Execute preloader animation
  initPreloader();

  // Inject shared layout elements (Header and Footer)
  injectHeaderFooter();

  // Initialize interactive UI components
  initScrollEffects();
  initCounters();
  initTestimonialSlider();
  initAccordion();
  initModals();
  initFormHandlers();
  initRippleEffect();
});

/* ==========================================================================
   PRELOADER LOGIC
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const percentEl = document.querySelector('.loading-percent');
  const fillEl = document.querySelector('.progress-bar-fill');

  if (!preloader || !percentEl || !fillEl) return;

  let progress = 0;
  const duration = 1500; // 1.5 seconds
  const stepTime = Math.abs(Math.floor(duration / 100));

  const timer = setInterval(() => {
    progress += 1;
    percentEl.textContent = `${progress}%`;
    fillEl.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.style.overflowY = 'auto'; // Re-enable scroll
      }, 300);
    }
  }, stepTime);
}

/* ==========================================================================
   DYNAMIC HEADER & FOOTER INJECTION
   ========================================================================== */
function injectHeaderFooter() {
  const headerContainer = document.getElementById('global-header');
  const footerContainer = document.getElementById('global-footer');

  // Determine current page path to highlight active state
  const path = window.location.pathname;
  const pageName = path.split("/").pop() || "index.html";

  if (headerContainer) {
    const isLightHeader = headerContainer.classList.contains('header-light');

    headerContainer.innerHTML = `
      <div class="container nav-container">
       <a href="index.html" class="logo">
    <img src="assets/logo.webp" alt="AuraCare Logo" class="logo-img">
</a>
   <nav class="nav-links">
  <a href="index.html" class="nav-link ${pageName === 'index.html' ? 'active' : ''}">Home</a>
  <a href="about.html" class="nav-link ${pageName === 'about.html' ? 'active' : ''}">About</a>
  <a href="services.html" class="nav-link ${pageName === 'services.html' ? 'active' : ''}">Services</a>
  <a href="doctors.html" class="nav-link ${pageName === 'doctors.html' ? 'active' : ''}">Doctors</a>
  <a href="blog.html" class="nav-link ${pageName === 'blog.html' ? 'active' : ''}">Blog</a>
  <a href="careers.html" class="nav-link ${pageName === 'careers.html' ? 'active' : ''}">Careers</a>
  <a href="contact.html" class="nav-link ${pageName === 'contact.html' ? 'active' : ''}">Contact</a>

  <!-- Mobile Menu Extra -->
  <div class="mobile-menu-extra">
    <button class="btn btn-primary btn-sm login-trigger">
      Login
    </button>

    <a href="mailto:stackly@healthcare.com" class="mobile-contact">
      <i class="fa-solid fa-envelope"></i>
      <span>stackly@healthcare.com</span>
    </a>


    <a href="https://maps.google.com/?q=Chennai,Tamil+Nadu,India" class="mobile-contact" target="_blank">
  <i class="fa-solid fa-location-dot"></i>
  <span>Chennai, Tamil Nadu, India</span>
</a>

    <a href="tel:+919875409805" class="mobile-contact">
      <i class="fa-solid fa-phone"></i>
      <span>+91 98754-09805</span>
    </a>
  </div>
</nav>

<div class="nav-actions">
  <button class="btn btn-outline-light btn-sm login-trigger" style="padding: 0.6rem 1.4rem; font-size: 0.85rem;">Login</button>
  <a href="404.html" class="btn btn-primary btn-sm" style="padding: 0.6rem 1.4rem; font-size: 0.85rem;">Book Now</a>

  <button class="mobile-toggle" aria-label="Toggle Navigation">
    <span></span>
    <span></span>
    <span></span>
  </button>
</div>
      </div>
      <div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>
    `;

    // Handle Light Header specifics
    if (isLightHeader) {
      const loginBtn = headerContainer.querySelector('.login-trigger');
      if (loginBtn) {
        loginBtn.classList.remove('btn-outline-light');
        loginBtn.classList.add('btn-outline-dark');
      }
    }

    // Scroll header styling
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        headerContainer.classList.add('scrolled');
      } else {
        headerContainer.classList.remove('scrolled');
      }
    });

    // Mobile menu toggle
    const toggle = headerContainer.querySelector('.mobile-toggle');
    const menu = headerContainer.querySelector('.nav-links');
    const overlay = headerContainer.querySelector('#mobile-nav-overlay');

    function closeMenu() {
      if (toggle) toggle.classList.remove('active');
      if (menu) menu.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
    }

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');

        // Lock / Unlock background scroll
        if (menu.classList.contains('active')) {
          document.body.classList.add('menu-open');
          document.documentElement.classList.add('menu-open');
        } else {
          document.body.classList.remove('menu-open');
          document.documentElement.classList.remove('menu-open');
        }
      });

      if (overlay) {
        overlay.addEventListener('click', closeMenu);
      }

      // Close menu after clicking any menu item
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
      });
    }


  }

  if (footerContainer) {
    footerContainer.innerHTML = `
      <!-- Ambient Lighting Pseudo Gradient --

      <!-- 5-COLUMN LAYOUT -->
      <div class="container">
        <div class="footer-grid-5">
          <!-- COLUMN 1: Brand & Badges -->
          <div class="footer-brand reveal-left">
           <a href="index.html" class="logo" style="margin-bottom: 1.5rem;">
    <img src="assets/logo.webp" alt="AuraCare Logo" class="footer-logo">
 
</a>
            <p>Premium international clinical care brought safely to your home. Empowering recovery and daily life with Apple-level clinical quality and telemetry oversight.</p>
            
            <div class="footer-badge-container">
              <span class="footer-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                Trusted Partner
              </span>
              <span class="footer-badge">
                <span class="footer-badge-dot"></span>
                Available 24/7
              </span>
            </div>

            <div class="footer-social-links">
              <a href="404.html" class="footer-social-icon" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>
              <a href="404.html" class="footer-social-icon" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
              <a href="404.html" class="footer-social-icon" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
              <a href="404.html" class="footer-social-icon" aria-label="X"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg></a>
              <a href="404.html" class="footer-social-icon" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 15 15 12 10 9"/></svg></a>
            </div>
          </div>

          <!-- COLUMN 2: Quick Links -->
          <div class="reveal delay-100">
            <h4 class="footer-title">Navigation</h4>
            <div class="footer-links-item">
              <a href="index.html">Home</a>
              <a href="about.html">About Us</a>
              <a href="services.html">Services</a>
              <a href="doctors.html">Our Doctors</a>
              <a href="blog.html">Medical Blog</a>
              <a href="careers.html">Careers & Culture</a>
              <a href="contact.html">Contact Us</a>
            </div>
          </div>

          <!-- COLUMN 3: Clinical Services -->
          <div class="reveal delay-200">
            <h4 class="footer-title">Services</h4>
            <div class="footer-services-list">
              <a href="404.html" class="footer-services-link"><i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></i> Home Nursing</a>
              <a href="404.html" class="footer-services-link"><i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></i> Doctor Visit</a>
              <a href="404.html" class="footer-services-link"><i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></i> Elder Care</a>
              <a href="404.html" class="footer-services-link"><i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></i> ICU Care at Home</a>
              <a href="404.html" class="footer-services-link"><i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></i> Physiotherapy</a>
              <a href="404.html" class="footer-services-link"><i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></i> Mother & Baby</a>
              <a href="404.html" class="footer-services-link"><i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></i> Device Rental</a>

            </div>
          </div>

          <!-- COLUMN 4: Contact Info Card -->
          <div class="reveal delay-300">
            <h4 class="footer-title">Contact Directory</h4>
            <div class="footer-contact-card-list">
              <div class="footer-contact-card">
                <div class="footer-contact-icon-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div class="footer-contact-details">
                  <strong>Head Office</strong>
                  <span>3/12,chennai,india</span>
                </div>
              </div>
              <div class="footer-contact-card">
                <div class="footer-contact-icon-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div class="footer-contact-details">
                  <strong>S Email</strong>
                  <a href="mailto:support@auracare.com">stackly@healthcare.com</a>
                </div>
              </div>
              <div class="footer-contact-card">
                <div class="footer-contact-icon-box" style="background: rgba(239, 68, 68, 0.08); color: var(--color-danger);">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div class="footer-contact-details">
                  <strong style="color: var(--color-danger);">ph:No</strong>
                  <a href="tel:+18005557788" style="color: var(--color-danger); font-weight: 700;">+91 98754-09805</a>
                </div>
              </div>
            </div>
          </div>

          <!-- COLUMN 5: Subscription Form -->
          <div class="footer-newsletter-premium reveal-right">
            <h4 class="footer-title">Newsletter</h4>
            <p>Subscribe to our accredited health summaries and weekly telehealth columns.</p>
            <form class="footer-newsletter-box" onsubmit="event.preventDefault(); showToast('Subscription verified. Welcome to AuraCare Insights!'); this.reset();">
              <div class="footer-newsletter-input-wrapper">
                <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></i>
                <input type="email" placeholder="professional@clinic.com" class="footer-newsletter-input" required>
              </div>
              <button type="submit" class="btn btn-primary ripple" style="width: 100%; border-radius: var(--border-pill);">Subscribe to Insights</button>
            </form>
            <span class="footer-newsletter-privacy">Your email is kept confidential. Opt-out at any time.</span>
          </div>
        </div>
      </div>

      <!-- PREMIUM BOTTOM BAR -->
      <div class="container">
        <div class="footer-bottom-premium">
          <div>
            <p>&copy; 2026 stackly healthCare Inc. All Rights Reserved.</p>
          </div>
          <div class="footer-bottom-links">
            <a href="404.html">Privacy Policy</a>
            <a href="404.html">Terms & Conditions</a>
          </div>
          <div>
            <p>Designed & Developed by stacklyhealthcare</p>
          </div>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   SCROLL REVEAL EFFECTS
   ========================================================================== */
function initScrollEffects() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .scale-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach((el) => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   COUNTER STATS ANIMATION
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-value');

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const speed = 100; // Lower numbers are faster
    const increment = Math.ceil(target / speed);

    let count = 0;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.textContent = count;
        setTimeout(updateCount, 15);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    updateCount();
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
  } else {
    counters.forEach((counter) => animateCounter(counter));
  }
}

/* ==========================================================================
   TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const wrapper = document.querySelector('.slider-wrapper');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.slider-btn-prev');
  const nextBtn = document.querySelector('.slider-btn-next');

  if (!wrapper || slides.length === 0) return;

  let currentIndex = 0;

  const updateSlider = () => {
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    });
  }

  // Auto play
  let autoPlay = setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }, 7000);

  const resetAutoplay = () => {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    }, 7000);
  };

  if (prevBtn) prevBtn.addEventListener('click', resetAutoplay);
  if (nextBtn) nextBtn.addEventListener('click', resetAutoplay);
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isOpen = item.classList.contains('active');

      // Close other open accordions
      document.querySelectorAll('.accordion-item.active').forEach((activeItem) => {
        if (activeItem !== item) {
          activeItem.classList.remove('active');
          activeItem.querySelector('.accordion-content').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

/* ==========================================================================
   MODAL DIALOG LOGIC
   ========================================================================== */
let modalOverlay = null;

function initModals() {
  // Check if modal container already exists. If not, inject it dynamically!
  if (!document.getElementById('login-modal')) {
    const modalHTML = `
      <div id="login-modal" class="modal-overlay">
        <div class="modal-box">
          <div class="modal-close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg></div>
          <div class="modal-tabs">
            <div class="modal-tab active" data-pane="pane-user">User Access</div>
            <div class="modal-tab" data-pane="pane-admin">Admin Portal</div>
            <div class="modal-tab" data-pane="pane-register">Register</div>
          </div>
          <div class="modal-body">
            <!-- USER PORTAL -->
            <div id="pane-user" class="modal-pane active">
              <form class="auth-form" id="user-login-form">
                <div class="form-group">
                  <label>Patient ID / Email</label>
                  <div class="form-control-wrapper">
                    <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></i>
                    <input type="email" placeholder="Enter Your Email" class="form-control" >
                  </div>
                </div>
                <div class="form-group">
                  <label>Access Code</label>
                  <div class="form-control-wrapper">
                    <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></i>
                    <input type="password" placeholder="••••••••" class="form-control" >
                  </div>
                </div>
                <div class="form-options">
                  <label class="form-checkbox">
                    <input type="checkbox" checked>
                    <span>Keep me authenticated</span>
                  </label>
                  <a href="404.html">Recover Pin</a>
                </div>
                <button type="submit" class="btn btn-primary ripple" style="width: 100%;">Sign In Patient Dashboard</button>
              </form>
            </div>

            <!-- ADMIN PORTAL -->
            <div id="pane-admin" class="modal-pane">
              <form class="auth-form" id="admin-login-form">
                <div class="form-group">
                  <label>Clinical Code</label>
                  <div class="form-control-wrapper">
                    <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></i>
                    <input type="email" placeholder="administrator@auracare.com" class="form-control" >
                  </div>
                </div>
                <div class="form-group">
                  <label>Security Key</label>
                  <div class="form-control-wrapper">
                    <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></i>
                    <input type="password" placeholder="••••••••" class="form-control" >
                  </div>
                </div>
                <div class="form-options">
                  <label class="form-checkbox">
                    <input type="checkbox" checked>
                    <span>Secure connection</span>
                  </label>
                  <a href="404.html" class="form-link forgot-trigger">Forgot Key</a>
                </div>
                <button type="submit" class="btn btn-secondary ripple" style="width: 100%;">Sign In Admin Console</button>
              </form>
            </div>

            <!-- REGISTRATION -->
            <div id="pane-register" class="modal-pane">
              <form class="auth-form" id="register-form" onsubmit="event.preventDefault(); showToast('Account application submitted! Our team will contact you shortly.'); closeModal();">
                <div class="form-group">
                  <label>Full Patient Name</label>
                  <div class="form-control-wrapper">
                    <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></i>
                    <input type="text" placeholder="John Doe" class="form-control" required>
                  </div>
                </div>
                <div class="form-group">
                  <label>Contact Email</label>
                  <div class="form-control-wrapper">
                    <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></i>
                    <input type="email" placeholder="john@example.com" class="form-control" required>
                  </div>
                </div>
                <div class="form-group">
                  <label>Mobile Number</label>
                  <div class="form-control-wrapper">
                    <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></i>
                    <input type="tel" placeholder="+1 (555) 000-0000" class="form-control" required>
                  </div>
                </div>

                <div class="form-group">
  <label>Password</label>
  <div class="form-control-wrapper">
    <i>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </i>
    <input type="password" placeholder="Create password" class="form-control" required>
  </div>
</div>

<div class="form-options" style="margin-bottom: 1rem;">
  <label style="display:flex; align-items:center; gap:8px; font-size:14px; cursor:pointer;">
    <input type="checkbox" required>
    <span>I agree to the terms and conditions</span>
  </label>
</div>
                <button type="submit" class="btn btn-primary ripple" style="width: 100%;">Submit Care Application</button>
              </form>
            </div>
            
            <!-- FORGOT PANEL -->
            <div id="pane-forgot" class="modal-pane">
              <form class="auth-form" onsubmit="event.preventDefault(); showToast('Security pin recovery instructions dispatched via SMS/Email.'); switchPane('pane-user');">
                <div class="form-group">
                  <label>Registered Phone / Email</label>
                  <div class="form-control-wrapper">
                    <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></i>
                    <input type="email" placeholder="john@example.com" class="form-control" required>
                  </div>
                </div>
                <button type="404.html" class="btn btn-primary ripple" style="width: 100%; margin-bottom: 1.5rem;">Request Reset Key</button>
                <div style="text-align: center;"><a href="404.html" class="form-link back-to-login" style="font-size: 0.9rem;">Back to Authentication</a></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  modalOverlay = document.getElementById('login-modal');
  const closeBtn = modalOverlay.querySelector('.modal-close');
  const tabs = modalOverlay.querySelectorAll('.modal-tab');
  const panes = modalOverlay.querySelectorAll('.modal-pane');

  const switchPane = (paneId) => {
    panes.forEach(pane => pane.classList.remove('active'));
    tabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-pane') === paneId) {
        tab.classList.add('active');
      }
    });
    const targetPane = document.getElementById(paneId);
    if (targetPane) targetPane.classList.add('active');
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchPane(tab.getAttribute('data-pane'));
    });
  });

  const forgotTriggers = modalOverlay.querySelectorAll('.forgot-trigger');
  forgotTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      panes.forEach(pane => pane.classList.remove('active'));
      tabs.forEach(tab => tab.classList.remove('active'));
      document.getElementById('pane-forgot').classList.add('active');
    });
  });

  const backTriggers = modalOverlay.querySelectorAll('.back-to-login');
  backTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      switchPane('pane-user');
    });
  });

  const openModal = () => {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Attach triggers to headers (including dynamically injected ones)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('login-trigger')) {
      e.preventDefault();
      openModal();
    }
  });

  // Handle Login Submits
  const userForm = document.getElementById('user-login-form');
  const adminForm = document.getElementById('admin-login-form');

  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Patient verification successful. Opening AuraCare Hub...');
      setTimeout(() => {
        window.location.href = 'dashboard-user.html';
      }, 1000);
    });
  }

  if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Administrator security cleared. Launching Command Console...');
      setTimeout(() => {
        window.location.href = 'dashboard-admin.html';
      }, 1000);
    });
  }
}

// Global modal triggers helper
window.switchPane = function (paneId) {
  const tabs = document.querySelectorAll('.modal-tab');
  const panes = document.querySelectorAll('.modal-pane');
  panes.forEach(pane => pane.classList.remove('active'));
  tabs.forEach(tab => {
    tab.classList.remove('active');
    if (tab.getAttribute('data-pane') === paneId) {
      tab.classList.add('active');
    }
  });
  const targetPane = document.getElementById(paneId);
  if (targetPane) targetPane.classList.add('active');
};

window.closeModal = function () {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
};

/* ==========================================================================
   FORM HANDLING & COMPROMISES
   ========================================================================== */
function initFormHandlers() {
  // Appointment Form
  const aptForm = document.getElementById('appointment-form');
  if (aptForm) {
    aptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Booking request submitted! A clinical dispatcher will call you in 15 minutes.');
      aptForm.reset();
    });
  }

  // Careers Apply Form
  const careerForm = document.getElementById('careers-form');
  if (careerForm) {
    careerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Application registered! Our talent relations department will check details within 48 hours.');
      careerForm.reset();
    });
  }

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Query transmitted. Our support crew will follow up.');
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   BUTTON RIPPLE EFFECT
   ========================================================================== */
function initRippleEffect() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.ripple');
    if (!target) return;

    const circle = document.createElement('span');
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;

    const rect = target.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-effect');

    // Remove previous ripple
    const prevRipple = target.querySelector('.ripple-effect');
    if (prevRipple) prevRipple.remove();

    target.appendChild(circle);
  });
}

/* ==========================================================================
   TOAST NOTIFICATION COMPONENT
   ========================================================================== */
window.showToast = function (message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '2rem';
    container.style.right = '2rem';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.8rem';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.background = 'rgba(7, 17, 31, 0.9)';
  toast.style.color = '#fff';
  toast.style.padding = '1rem 1.8rem';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
  toast.style.border = '1px solid rgba(255, 255, 255, 0.08)';
  toast.style.backdropFilter = 'blur(10px)';
  toast.style.fontSize = '0.95rem';
  toast.style.fontWeight = '500';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '0.8rem';
  toast.style.transform = 'translateY(20px)';
  toast.style.opacity = '0';
  toast.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

  // Icon
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" stroke-width="3" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation reflow
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.style.transform = 'translateY(-20px)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
};

// Dynamic scroll observer for pre-footer cards
document.addEventListener('DOMContentLoaded', () => {
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('#book .container, #apply .container').forEach(card => {
      cardObserver.observe(card);
    });
  } else {
    document.querySelectorAll('#book .container, #apply .container').forEach(card => {
      card.classList.add('card-visible');
    });
  }
});



document.addEventListener("input", function (e) {

  // Name - Alphabets only
  if (e.target.classList.contains("name-only")) {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  }


  // Phone - Numbers only
  if (e.target.classList.contains("phone-only")) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  }

});