# juliato.dev

Personal developer portfolio featuring smooth scroll animations and a modern bento grid layout.

## Features

- **Lenis Smooth Scroll** - Buttery smooth scrolling with parallax effects
- **Bento Grid Projects** - Modern card-based project showcase
- **Intersection Observer Animations** - Elements animate in as you scroll
- **Custom Cursor** - Spring physics-based cursor with hover states
- **Responsive Design** - Works on desktop and mobile
- **Contact Form** - Integrated with Formspree

## Tech Stack

- HTML5 / CSS3
- Vanilla JavaScript
- [Lenis](https://lenis.studiofreight.com/) - Smooth scroll library
- [Formspree](https://formspree.io/) - Form handling

## Structure

```
juliato.dev/
├── index.html      # Main site (single-page)
├── screenshots/    # Project screenshots
└── README.md
```

## Local Development

Just open `index.html` in a browser. No build step required.

```bash
# Or use a local server
npx serve .
```

## Customization

### Adding Projects

Add a new `.bento-item` in the bento grid:

```html
<div class="bento-item bento-tall fade-up">
    <a href="https://your-link.com" target="_blank" class="project-link"></a>
    <div class="project-inner">
        <div class="project-visual">
            <div class="project-visual-bg visual-website"></div>
            <div class="floating-elements">
                <span class="float-icon">🚀</span>
            </div>
        </div>
        <div class="project-info">
            <div class="project-tech-stack">
                <span class="tech-pill highlight">React</span>
                <span class="tech-pill">TypeScript</span>
            </div>
            <h3 class="project-title">
                Project Name
                <span class="arrow">→</span>
            </h3>
            <p class="project-desc">Project description here.</p>
        </div>
    </div>
</div>
```

### Bento Grid Sizes

- `.bento-large` - 8 columns, 2 rows (featured)
- `.bento-tall` - 4 columns, 2 rows
- `.bento-wide` - 6 columns, 1 row
- `.bento-medium` - 4 columns, 1 row

## License

MIT
