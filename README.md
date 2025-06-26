# RebelMetrics.io

A static HTML website with JavaScript and responsive design that supports multiple languages, inspired by the Digitalist Cloud design.

## Features

- 🌍 **Multilingual Support**: English, Swedish, and German
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Clean, professional design inspired by Digitalist Cloud
- ⚡ **Fast Loading**: Static HTML with optimized assets
- 🔧 **Easy Customization**: Modular structure for easy updates

## Language Support

The website supports three languages:
- **English** (en) - Default at root `/`
- **Swedish** (sv) - Available at `/sv`
- **German** (de) - Available at `/de`

### URL Structure

The website uses path-based language switching:
- `/` - English (default)
- `/sv` - Swedish
- `/de` - German

### Automatic Language Detection

The website automatically detects the user's browser language and redirects to the appropriate language version if supported.

## Project Structure

```
rebelsite/
├── index.html              # English version (root)
├── en/
│   └── index.html         # English version (alternative)
├── sv/
│   └── index.html         # Swedish version
├── de/
│   └── index.html         # German version
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── translations.js    # Language translations
│   └── main.js           # Main JavaScript functionality
├── images/
│   ├── README.md         # Image requirements
│   └── customers/        # Customer logos
└── README.md             # This file
```

## Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Add images** to the `images/` directory (see `images/README.md`)
4. **Customize** content and styling as needed

## Development

### Adding New Languages

1. Create a new directory for the language (e.g., `fr/`)
2. Create `index.html` in the new directory
3. Add translations to `js/translations.js`:
```javascript
fr: {
    nav: {
        services: "Services",
        // ... more translations
    }
}
```

4. Add language button to header in `js/main.js`:
```javascript
<button class="language-btn" data-lang="fr">FR</button>
```

5. Update the language detection script in `index.html`

### Customizing Content

- **HTML**: Edit the appropriate `index.html` file for each language
- **CSS**: Modify `css/style.css` for styling
- **Translations**: Update `js/translations.js` for text content
- **Functionality**: Edit `js/main.js` for JavaScript features

### Adding New Sections

1. Add HTML structure to all language versions of `index.html`
2. Add CSS styles to `css/style.css`
3. Add translations to `js/translations.js`
4. Update navigation if needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Optimized CSS with CSS custom properties
- Minimal JavaScript footprint
- Responsive images
- Smooth scrolling and animations
- Intersection Observer for performance

## SEO Features

- Semantic HTML structure
- Meta tags for description
- Proper heading hierarchy
- Alt text for images
- Clean URLs with language paths
- Automatic language detection and redirects

## Accessibility

- ARIA labels where needed
- Keyboard navigation support
- High contrast colors
- Screen reader friendly
- Focus management

## Deployment

The website is ready for deployment to any static hosting service:

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repository
- **GitHub Pages**: Push to repository
- **AWS S3**: Upload files to bucket
- **Any web server**: Upload files to public directory

### Server Configuration

For proper language routing, ensure your server is configured to:
- Serve `index.html` for the root path `/`
- Serve `sv/index.html` for `/sv`
- Serve `de/index.html` for `/de`

## Customization

### Colors

Edit CSS custom properties in `css/style.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    /* ... more colors */
}
```

### Fonts

Change the font family in `css/style.css`:
```css
body {
    font-family: 'Your-Font', sans-serif;
}
```

### Layout

Modify grid layouts and spacing in `css/style.css`:
```css
.container {
    max-width: 1200px; /* Change max width */
}
```

## License

This project is open source and available under the MIT License.

## Support

For questions or support, please contact:
- Email: cloud@rebelmetrics.io
- Website: https://rebelmetrics.io

---

Built with ❤️ for GDPR-safe analytics 