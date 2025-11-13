// Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Smooth scroll for anchor links (exclude WhatsApp links)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Skip WhatsApp buttons
    if (anchor.hasAttribute('data-whatsapp-package') || anchor.classList.contains('whatsapp-float')) {
      return;
    }
    
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector('.header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        header.style.background = 'rgba(255, 255, 255, 0.98)';
      } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        header.style.background = 'rgba(255, 255, 255, 0.95)';
      }
    });
  }

  // Active navigation highlighting
  const navLinks = document.querySelectorAll('.nav-menu a');
  const sections = document.querySelectorAll('section[id]');

  const setActiveLink = (targetHref) => {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === targetHref) {
        link.style.color = '#27ae60';
      } else {
        link.style.color = '';
      }
    });
  };

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) {
            setActiveLink(`#${id}`);
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Here you would typically send the data to a server
      console.log('Form submitted:', data);
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
  }

  // Fade in animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Animate elements on scroll
  document.querySelectorAll('.package-card, .feature-card, .testimonial-card, .process-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Package card hover effects
  document.querySelectorAll('.package-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Set current year in footer
  const updateYear = () => {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear();
    }
  };

  // Update year initially
  updateYear();

  // Update year after language switcher runs (with a small delay to ensure translations are loaded)
  setTimeout(updateYear, 100);
  
  // WhatsApp link updater (global function)
  window.updateWhatsAppLinks = function(lang = null) {
    const currentLang = lang || window.languageSwitcher?.currentLang || 'en';
    const translations = window.languageSwitcher?.translations?.[currentLang];
    const phoneNumber = '60123456789'; // Update this with actual phone number
    
    if (!translations || !translations.whatsapp) {
      // Retry after a short delay if translations aren't loaded yet
      setTimeout(() => window.updateWhatsAppLinks(lang), 200);
      return;
    }

    // Update floating WhatsApp button (generic message)
    const floatingWhatsApp = document.querySelector('.whatsapp-float');
    if (floatingWhatsApp) {
      const genericMessage = translations.whatsapp?.genericMessage || "Hello! I'm interested in learning more about your investment packages.";
      const encodedMessage = encodeURIComponent(genericMessage);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      floatingWhatsApp.href = whatsappUrl;
      floatingWhatsApp.setAttribute('href', whatsappUrl);
    }

    // Update package-specific WhatsApp buttons
    document.querySelectorAll('[data-whatsapp-package]').forEach(button => {
      const packageType = button.getAttribute('data-whatsapp-package');
      let message = '';
      
      switch(packageType) {
        case 'package1':
          message = translations.whatsapp?.package1Message || translations.whatsapp?.genericMessage || "Hello! I'm interested in the Long-Term Sheep Investment package.";
          break;
        case 'package2':
          message = translations.whatsapp?.package2Message || translations.whatsapp?.genericMessage || "Hello! I'm interested in the Sheep Qurban Project.";
          break;
        case 'package3':
          message = translations.whatsapp?.package3Message || translations.whatsapp?.genericMessage || "Hello! I'm interested in the Kampung Chicken Farming package.";
          break;
        default:
          message = translations.whatsapp?.genericMessage || "Hello! I'm interested in learning more about your investment packages.";
      }
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      button.href = whatsappUrl;
      button.setAttribute('href', whatsappUrl);
    });
  };

  // Initialize WhatsApp links - wait for language switcher to be ready
  const initWhatsAppLinks = () => {
    if (window.languageSwitcher && window.languageSwitcher.translations && 
        Object.keys(window.languageSwitcher.translations).length > 0 &&
        window.languageSwitcher.translations[window.languageSwitcher.currentLang]?.whatsapp) {
      window.updateWhatsAppLinks();
    } else {
      // Retry if language switcher isn't ready yet (max 10 attempts = 2 seconds)
      if (typeof initWhatsAppLinks.attempts === 'undefined') {
        initWhatsAppLinks.attempts = 0;
      }
      initWhatsAppLinks.attempts++;
      if (initWhatsAppLinks.attempts < 20) {
        setTimeout(initWhatsAppLinks, 100);
      }
    }
  };

  // Add click handlers for WhatsApp buttons immediately (fallback)
  document.querySelectorAll('[data-whatsapp-package]').forEach(button => {
    button.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // If href is still "#" or not a WhatsApp URL, prevent default and try to update
      if (!href || href === '#' || !href.includes('wa.me')) {
        e.preventDefault();
        e.stopPropagation();
        // Try to update links and retry
        if (window.updateWhatsAppLinks) {
          window.updateWhatsAppLinks();
          setTimeout(() => {
            const newHref = this.getAttribute('href');
            if (newHref && newHref !== '#' && newHref.includes('wa.me')) {
              window.open(newHref, '_blank', 'noopener,noreferrer');
            } else {
              // Fallback: construct URL from package type
              const packageType = this.getAttribute('data-whatsapp-package');
              const phoneNumber = '60123456789';
              let message = "Hello! I'm interested in learning more about your investment packages.";
              if (packageType === 'package1') {
                message = "Hello! I'm interested in the Long-Term Sheep Investment package. Can you provide more information?";
              } else if (packageType === 'package2') {
                message = "Hello! I'm interested in the Sheep Qurban Project. Can you provide more information?";
              } else if (packageType === 'package3') {
                message = "Hello! I'm interested in the Kampung Chicken Farming package. Can you provide more information?";
              }
              const encodedMessage = encodeURIComponent(message);
              window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
            }
          }, 200);
        }
        return false;
      }
      // If href is valid WhatsApp URL, allow default behavior
    });
  });
  
  // Also add handler for floating WhatsApp button
  const floatingWhatsApp = document.querySelector('.whatsapp-float');
  if (floatingWhatsApp) {
    floatingWhatsApp.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || !href.includes('wa.me')) {
        e.preventDefault();
        e.stopPropagation();
        if (window.updateWhatsAppLinks) {
          window.updateWhatsAppLinks();
          setTimeout(() => {
            const newHref = this.getAttribute('href');
            if (newHref && newHref !== '#' && newHref.includes('wa.me')) {
              window.open(newHref, '_blank', 'noopener,noreferrer');
            } else {
              // Fallback
              const phoneNumber = '60123456789';
              const message = encodeURIComponent("Hello! I'm interested in learning more about your investment packages.");
              window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
            }
          }, 200);
        }
        return false;
      }
    });
  }

  // Start initialization after a short delay to ensure language switcher has started
  setTimeout(initWhatsAppLinks, 300);
  
  // Also check immediately if language switcher is already initialized
  if (window.languageSwitcher && window.languageSwitcher.translations && 
      Object.keys(window.languageSwitcher.translations).length > 0) {
    setTimeout(() => window.updateWhatsAppLinks(), 100);
  }

  // Also update year when language changes
  if (window.languageSwitcher) {
    const originalUpdateLanguage = window.languageSwitcher.updateLanguage.bind(window.languageSwitcher);
    window.languageSwitcher.updateLanguage = function(lang) {
      originalUpdateLanguage(lang);
      setTimeout(updateYear, 50);
      setTimeout(() => window.updateWhatsAppLinks(lang), 100);
    };
  }
});

