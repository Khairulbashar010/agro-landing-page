# Akib Agro Farm Landing Page

A modern, responsive landing page for Akib Agro Farm's cattle farming investment platform. Built with pure HTML, CSS, and JavaScript with English and Malay language support.

## Features

- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **Bilingual Support**: English and Malay translations with easy language switching
- **Investment Focus**: Showcases investment packages and platform features
- **Modern UI**: Clean, professional design with smooth animations
- **SEO Friendly**: Semantic HTML structure with proper meta tags

## Project Structure

```
akib-agro-landing/
├── index.html              # Main landing page
├── assets/
│   ├── css/
│   │   ├── main.css        # Main stylesheet
│   │   └── modules/        # Modular CSS files
│   ├── js/
│   │   ├── main.js         # Main JavaScript
│   │   └── language-switcher.js  # i18n functionality
│   └── images/             # Image assets
└── lang/
    ├── en.json             # English translations
    └── ms.json             # Malay translations
```

## Getting Started

### Option 1: Using Python HTTP Server

```bash
cd akib-agro-landing
python3 -m http.server 8000
```

Then open your browser and navigate to `http://localhost:8000`

### Option 2: Using Node.js Serve

```bash
cd akib-agro-landing
npx serve
```

### Option 3: Using PHP Server

```bash
cd akib-agro-landing
php -S localhost:8000
```

## Important Notes

⚠️ **The language switcher requires a local server to work properly** due to browser security restrictions when loading JSON files. Opening `index.html` directly in a browser (file:// protocol) will not load translations.

## Sections

1. **Hero Section**: Main banner with call-to-action buttons and key statistics
2. **About Section**: Information about Akib Agro Farm and key features
3. **Investment Packages**: Three investment package options with details
4. **Platform Features**: Six key features of the investment platform
5. **How It Works**: Step-by-step process explanation
6. **Testimonials**: Investor testimonials
7. **Contact Section**: Contact form and information
8. **Footer**: Links, contact info, and social media

## Customization

### Changing Colors

The primary color (green) is defined in CSS files. Search for `#27ae60` and replace with your preferred color.

### Updating Content

- **Text Content**: Edit the JSON files in `lang/` directory
- **Images**: Replace images in `assets/images/` directory
- **Contact Information**: Update in `index.html` and translation files

### Adding New Sections

1. Add HTML structure in `index.html`
2. Add styles in appropriate CSS module file
3. Add translations in `lang/en.json` and `lang/ms.json`
4. Use `data-i18n` attribute for translatable content

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

© 2024 Akib Agro Farm. All rights reserved.



