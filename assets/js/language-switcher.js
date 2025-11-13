// Language Switcher
class LanguageSwitcher {
  constructor() {
    this.currentLang = localStorage.getItem('preferredLanguage') || 'en';
    this.translations = {};
    this.toggle = null;
    this.optionElements = {};
    this.init();
  }

  async init() {
    this.toggle = document.getElementById('language-toggle');
    this.optionElements = {
      en: document.querySelector('.lang-switch__option--en'),
      ms: document.querySelector('.lang-switch__option--ms')
    };

    await this.loadTranslations();
    this.updateControlVisual(this.currentLang);
    this.updateLanguage(this.currentLang);
    this.setupEventListeners();
    
    // Trigger WhatsApp link update after translations are loaded
    if (window.updateWhatsAppLinks) {
      setTimeout(() => window.updateWhatsAppLinks(this.currentLang), 100);
    }
  }

  async loadTranslations() {
    try {
      const pathname = window.location.pathname;
      const protocol = window.location.protocol;

      if (protocol === 'file:') {
        throw new Error('File protocol detected. Please use a local server.');
      }

      let dirPath = '';
      if (pathname.includes('/')) {
        const lastSlash = pathname.lastIndexOf('/');
        dirPath = pathname.substring(0, lastSlash + 1);
      } else {
        dirPath = '/';
      }

      dirPath = dirPath.replace(/\/+/g, '/');
      if (!dirPath.startsWith('/')) {
        dirPath = '/' + dirPath;
      }

      const pathStrategies = [
        `${dirPath}lang/en.json`,
        `${dirPath}../lang/en.json`,
        `/lang/en.json`,
        `lang/en.json`,
        `../lang/en.json`,
        `./lang/en.json`
      ];

      let loaded = false;

      for (const enPath of pathStrategies) {
        try {
          const msPath = enPath.replace('en.json', 'ms.json');
          const enResponse = await fetch(enPath);
          const msResponse = await fetch(msPath);

          if (enResponse.ok && msResponse.ok) {
            this.translations.en = await enResponse.json();
            this.translations.ms = await msResponse.json();
            loaded = true;
            break;
          }
        } catch (error) {
          console.warn(`Translation load attempt failed for ${enPath}:`, error.message);
        }
      }

      if (!loaded) {
        throw new Error('Failed to load translation files from any path');
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      this.translations.en = {};
      this.translations.ms = {};
      console.warn('⚠ Translation files could not be loaded. Language switching will not work.');
      console.warn('💡 To fix: Use a local server (e.g., `python3 -m http.server 8000` or `npx serve`)');
    }
  }

  setupEventListeners() {
    if (this.toggle) {
      this.toggle.addEventListener('change', () => {
        const lang = this.toggle.checked ? 'ms' : 'en';
        this.switchLanguage(lang);
      });
    }
  }

  switchLanguage(lang) {
    if (!lang || (lang !== 'en' && lang !== 'ms')) {
      console.error('Invalid language code:', lang);
      return;
    }

    this.currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    this.updateLanguage(lang);
    this.updateControlVisual(lang);
  }

  updateLanguage(lang) {
    const translations = this.translations[lang];
    if (!translations || Object.keys(translations).length === 0) {
      console.warn(`No translations available for language: ${lang}`);
      return;
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const value = this.getNestedValue(translations, key);
      if (value !== undefined && value !== null) {
        if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email')) {
          element.placeholder = value;
        } else {
          // Special handling for copyright text to preserve year span
          if (key === 'footer.copyright') {
            // Always replace the year in the translation with current year wrapped in span
            const currentYear = new Date().getFullYear();
            const updatedValue = value.replace(/\d{4}/, `<span id="current-year">${currentYear}</span>`);
            element.innerHTML = updatedValue;
          } else {
          element.textContent = value;
          }
        }
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const value = this.getNestedValue(translations, key);
      if (value !== undefined && value !== null) {
        element.placeholder = value;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const value = this.getNestedValue(translations, key);
      if (value !== undefined && value !== null) {
        element.innerHTML = value;
      }
    });

    document.documentElement.setAttribute('lang', lang);
  }

  updateControlVisual(lang) {
    if (!this.toggle) return;

    const isMalay = lang === 'ms';
    if (this.toggle.checked !== isMalay) {
      this.toggle.checked = isMalay;
    }

    Object.entries(this.optionElements).forEach(([key, el]) => {
      if (el) {
        el.classList.toggle('is-active', key === lang);
      }
    });
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }
}

let languageSwitcherInstance;

function initLanguageSwitcher() {
  if (!languageSwitcherInstance) {
    languageSwitcherInstance = new LanguageSwitcher();
    window.languageSwitcher = languageSwitcherInstance;
  }
  return languageSwitcherInstance;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
  initLanguageSwitcher();
}

