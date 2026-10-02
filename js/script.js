/**
 * ==============================================================================
 * PORTFOLIO JAVASCRIPT
 * Author: Ralph
 * Description: Clean, modular Vanilla JS for navigation, theme toggle,
 *              scroll animations, and form validation.
 * ==============================================================================
 */

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
   * 1. MOBILE NAVIGATION (HAMBURGER MENU)
   * -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    // Toggle menu open/close on hamburger click
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('show-menu');
    });

    // Close the mobile menu whenever any link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('show-menu');
      });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (event) => {
      const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
      if (!isClickInsideNav && navMenu.classList.contains('show-menu')) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('show-menu');
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('show-menu')) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('show-menu');
      }
    });
  }


  /* --------------------------------------------------------------------------
   * 2. HEADER SHADOW ON SCROLL
   * -------------------------------------------------------------------------- */
  const header = document.getElementById('header');

  const handleHeaderShadow = () => {
    if (!header) return;
    if (window.scrollY >= 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderShadow);
  handleHeaderShadow(); // Run once on initial load


  /* --------------------------------------------------------------------------
   * 3. ACTIVE NAVIGATION LINK ON SCROLL (SCROLL SPY)
   * -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  const highlightActiveNavLink = () => {
    const scrollY = window.pageYOffset || window.scrollY;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // Offset for sticky navbar
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active-link');
        } else {
          matchingLink.classList.remove('active-link');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNavLink);
  highlightActiveNavLink();


  /* --------------------------------------------------------------------------
   * 4. DARK / LIGHT THEME TOGGLE WITH LOCAL STORAGE
   * -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeStorageKey = 'ralph_portfolio_theme';

  // Check saved theme or user OS preference
  const savedTheme = localStorage.getItem(themeStorageKey);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-theme');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      
      const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      localStorage.setItem(themeStorageKey, currentTheme);
    });
  }


  /* --------------------------------------------------------------------------
   * 5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   * -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Stop observing once animated
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12, // Triggers when 12% of the element is visible
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers: show all elements directly
    revealElements.forEach((el) => el.classList.add('active'));
  }


  /* --------------------------------------------------------------------------
   * 6. BACK TO TOP BUTTON
   * -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');

  const toggleBackToTop = () => {
    if (!backToTopBtn) return;
    if (window.scrollY >= 350) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', toggleBackToTop);
  toggleBackToTop();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }


  /* --------------------------------------------------------------------------
   * 7. CONTACT FORM CLIENT-SIDE VALIDATION
   * -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const formFeedback = document.getElementById('form-feedback');

  // Standard regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Helper functions for displaying error messages
  const showError = (inputElement, errorElement, message) => {
    inputElement.classList.add('input-error');
    errorElement.textContent = message;
  };

  const clearError = (inputElement, errorElement) => {
    inputElement.classList.remove('input-error');
    errorElement.textContent = '';
  };

  // Real-time input validation on user typing
  if (nameInput && nameError) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) {
        clearError(nameInput, nameError);
      }
    });
  }

  if (emailInput && emailError) {
    emailInput.addEventListener('input', () => {
      if (emailRegex.test(emailInput.value.trim())) {
        clearError(emailInput, emailError);
      }
    });
  }

  if (messageInput && messageError) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 10) {
        clearError(messageInput, messageError);
      }
    });
  }

  // Handle Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent standard page reload

      let isValid = true;

      // Validate Name
      const nameValue = nameInput.value.trim();
      if (!nameValue) {
        showError(nameInput, nameError, 'Please enter your name.');
        isValid = false;
      } else if (nameValue.length < 2) {
        showError(nameInput, nameError, 'Name must be at least 2 characters.');
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Validate Email
      const emailValue = emailInput.value.trim();
      if (!emailValue) {
        showError(emailInput, emailError, 'Please enter your email address.');
        isValid = false;
      } else if (!emailRegex.test(emailValue)) {
        showError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Validate Message
      const messageValue = messageInput.value.trim();
      if (!messageValue) {
        showError(messageInput, messageError, 'Please enter your message.');
        isValid = false;
      } else if (messageValue.length < 10) {
        showError(messageInput, messageError, 'Message must be at least 10 characters long.');
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      // If valid, show friendly confirmation
      if (isValid) {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Thank you, ' + nameValue + '! Your message has been prepared. (Connect Formspree, EmailJS, or backend script to send live emails).';
        
        // Reset form fields
        contactForm.reset();

        // Auto-dismiss notification after 6 seconds
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 6000);
      } else {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fix the errors above before submitting.';
      }
    });
  }

});

// Manually controlled project showcase; the original grid remains a no-JS fallback.
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.project-card'));
  if (cards.length < 2) return;

  let current = 0;
  let animation;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  grid.id = 'project-showcase';
  grid.classList.add('is-showcase');
  grid.setAttribute('role', 'region');
  grid.setAttribute('aria-roledescription', 'carousel');
  grid.setAttribute('aria-label', 'Featured projects');

  const controls = document.createElement('div');
  controls.className = 'project-showcase-controls';
  controls.innerHTML = `
    <p class="project-showcase-status" aria-live="polite" aria-atomic="true"></p>
    <div class="project-showcase-buttons" role="group" aria-label="Project navigation">
      <button type="button" class="btn btn-secondary" aria-controls="project-showcase" aria-label="Previous project">
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6-6 6 6 6"/></svg>
      </button>
      <button type="button" class="btn btn-primary" aria-controls="project-showcase" aria-label="Next project">
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 6 6 6-6 6"/></svg>
      </button>
    </div>`;
  const showcase = document.createElement('div');
  showcase.className = 'project-showcase';
  grid.before(showcase);
  showcase.append(grid, controls);
  const status = controls.querySelector('.project-showcase-status');
  showcase.before(status);
  const [previous, next] = controls.querySelectorAll('button');

  cards.forEach((card, index) => {
    card.classList.remove('reveal');
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', `${index + 1} of ${cards.length}`);
    card.hidden = index !== current;
  });

  function showProject(direction = 0) {
    if (animation) animation.cancel();
    cards[current].hidden = true;
    current = (current + direction + cards.length) % cards.length;
    const card = cards[current];
    card.hidden = false;
    status.textContent = `Project ${String(current + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    if (direction && !reducedMotion.matches && card.animate) {
      animation = card.animate([
        { opacity: 0, transform: `translateX(${direction * 36}px)` },
        { opacity: 1, transform: 'translateX(0)' }
      ], { duration: 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }
  }

  previous.addEventListener('click', () => showProject(-1));
  next.addEventListener('click', () => showProject(1));
  controls.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showProject(event.key === 'ArrowLeft' ? -1 : 1);
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && animation) animation.cancel();
  });
  showProject();
});