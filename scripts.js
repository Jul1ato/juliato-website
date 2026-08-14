        // Scroll animations
        const fadeElements = document.querySelectorAll('.fade-up');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        fadeElements.forEach(element => observer.observe(element));

        // Directory scrollspy — highlights active section
        const spyEntries = document.querySelectorAll('.hero-directory .dir-entry[href^="#"]');
        const spySections = Array.from(spyEntries)
            .map(a => document.querySelector(a.getAttribute('href')))
            .filter(Boolean);

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    spyEntries.forEach(e => e.classList.toggle(
                        'dir-entry-active',
                        e.getAttribute('href') === '#' + id
                    ));
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

        spySections.forEach(s => spyObserver.observe(s));

        // Form submission with Formspree
        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const formStatus = document.getElementById('formStatus');
        
        if (contactForm) contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Require reCAPTCHA completion
            if (typeof grecaptcha !== 'undefined' && !grecaptcha.getResponse()) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#ef4444';
                formStatus.textContent = 'Please complete the reCAPTCHA before sending.';
                return;
            }

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.style.display = 'none';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#22c55e';
                    formStatus.textContent = 'Thanks for your message! I\'ll get back to you soon.';
                    contactForm.reset();
                    if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#ef4444';
                formStatus.textContent = 'Something went wrong. Please try again or reach out through GitHub.';
                if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message →';
            }
        });

        // Parallax effect on bento items
        document.querySelectorAll('.bento-item').forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
            });
        });

        // ===== LENIS SMOOTH SCROLL (FRAMER-LIKE) =====
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        // Lenis RAF loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);


        // ===== SCROLL PROGRESS INDICATOR =====
        const scrollProgress = document.getElementById('scrollProgress');
        
        lenis.on('scroll', ({ progress }) => {
            if (scrollProgress) scrollProgress.style.width = (progress * 100) + '%';
        });

        // ===== CUSTOM CURSOR =====
        const cursor = document.getElementById('cursor');
        const cursorDot = document.getElementById('cursorDot');
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor with spring physics
        function animateCursor() {
            // Spring physics for main cursor
            const springStrength = 0.08;
            const damping = 0.8;
            
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * springStrength;
            cursorY += dy * springStrength;
            
            // Dot follows faster
            dotX += (mouseX - dotX) * 0.2;
            dotY += (mouseY - dotY) * 0.2;
            
            cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
            cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .bento-item, .skill-category, input, textarea');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorDot.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorDot.classList.remove('hover');
            });
        });

        // Click effect
        document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

        // ===== SCROLL-LINKED PARALLAX =====
        // Cache DOM queries for performance
        const gradientBg = document.querySelector('.gradient-bg');
        const heroContent = document.querySelector('.hero-content');
        const windowHeight = window.innerHeight;

        function updateScrollEffects() {
            const scrollY = lenis.scroll;

            // Gradient background parallax
            if (gradientBg) {
                gradientBg.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
            }

            // Hero content parallax with opacity (home only)
            if (heroContent && document.body.dataset.page === 'home') {
                const heroProgress = Math.min(scrollY / windowHeight, 1);
                heroContent.style.transform = `translate3d(0, ${scrollY * 0.5}px, 0)`;
                heroContent.style.opacity = 1 - (heroProgress * 1.5);
            }

            requestAnimationFrame(updateScrollEffects);
        }
        updateScrollEffects();

        // ===== INTERSECTION OBSERVER FOR REVEALS =====
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.add('in-view');
                }
            });
        }, { 
            threshold: 0.05, 
            rootMargin: '0px 0px -5% 0px' 
        });

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            revealObserver.observe(section);
        });

        // Observe all reveal elements
        document.querySelectorAll('.fade-up, .scale-reveal, .reveal-clip, .char-reveal, .line-reveal').forEach(el => {
            revealObserver.observe(el);
        });

        // ===== STAGGERED BENTO CARD REVEALS =====
        const bentoCards = document.querySelectorAll('.bento-item');

        const bentoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Array.from(bentoCards).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.12}s`;
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0, rootMargin: '50px' });
        
        bentoCards.forEach(card => {
            bentoObserver.observe(card);
        });

        // Add revealed styles
        const style = document.createElement('style');
        style.textContent = `
            .bento-item.revealed {
                opacity: 1 !important;
                transform: translateY(0) scale(1) rotateX(0deg) !important;
            }
        `;
        document.head.appendChild(style);

        // ===== MAGNETIC BUTTON EFFECT =====
        document.querySelectorAll('.btn-primary, .btn-secondary, .nav-link').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate3d(${x * 0.4}px, ${y * 0.4}px, 0)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate3d(0, 0, 0)';
                btn.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'transform 0.1s ease';
            });
        });

        // ===== SKILL DOTS WAVE ANIMATION =====
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const dots = entry.target.querySelectorAll('.skill-dot.filled');
                    dots.forEach((dot, index) => {
                        dot.style.transition = `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s, 
                                               box-shadow 0.4s ease ${index * 0.08}s`;
                        dot.style.transform = 'scale(1.2)';
                        
                        setTimeout(() => {
                            dot.style.transform = 'scale(1)';
                        }, 300 + index * 80);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.skill-item').forEach(item => skillObserver.observe(item));

        // ===== CHARACTER-BY-CHARACTER TEXT REVEAL =====
        function splitTextToChars(element) {
            const text = element.textContent;
            element.innerHTML = '';
            element.classList.add('char-reveal');
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.transitionDelay = `${index * 0.02}s`;
                element.appendChild(span);
            });
        }

        // Apply to hero title on load
        window.addEventListener('load', () => {
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                splitTextToChars(heroTitle);
                setTimeout(() => heroTitle.classList.add('visible'), 300);
            }
            
            // Force all sections to be visible immediately
            document.querySelectorAll('section').forEach((section, index) => {
                section.classList.add('in-view');
                section.classList.add('visible');
            });
        });

        // ===== SMOOTH ANCHOR SCROLLING WITH LENIS =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    lenis.scrollTo(target, {
                        offset: -100,
                        duration: 1.5,
                        easing: (t) => 1 - Math.pow(1 - t, 4) // Ease out quart
                    });
                }
            });
        });

        // ===== SCROLL-LINKED GRADIENT TEXT =====
        document.querySelectorAll('.section-title').forEach(title => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        title.classList.add('gradient-text-scroll', 'active');
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(title);
        });

        // ===== TEXT SCRAMBLE ANIMATION =====
        class TextScramble {
            constructor(el) {
                this.el = el;
                this.chars = '!<>-_\\/[]{}—=+*^?#________';
                this.frame = 0;
                this.queue = [];
                this.resolve = null;
            }

            setText(newText, gradientRanges = []) {
                const oldText = this.el.textContent;
                const length = Math.max(oldText.length, newText.length);
                return new Promise(resolve => {
                    this.resolve = resolve;
                    this.queue = [];
                    for (let i = 0; i < length; i++) {
                        const from = oldText[i] || '';
                        const to = newText[i] || '';
                        const start = Math.floor(Math.random() * 40);
                        const end = start + Math.floor(Math.random() * 40);
                        const gradient = gradientRanges.some(([s, e]) => i >= s && i < e);
                        this.queue.push({ from, to, start, end, gradient });
                    }
                    cancelAnimationFrame(this.frameRequest);
                    this.frame = 0;
                    this.update();
                });
            }

            update() {
                // Build an array of tokens: { html, gradient, resolved }
                const tokens = [];
                let complete = 0;
                for (let i = 0, n = this.queue.length; i < n; i++) {
                    let { from, to, start, end, char, gradient } = this.queue[i];
                    if (this.frame >= end) {
                        complete++;
                        tokens.push({ html: to, gradient, resolved: true });
                    } else if (this.frame >= start) {
                        if (!char || Math.random() < 0.28) {
                            char = this.chars[Math.floor(Math.random() * this.chars.length)];
                            this.queue[i].char = char;
                        }
                        tokens.push({ html: `<span class="scramble-char">${char}</span>`, gradient: false, resolved: false });
                    } else {
                        tokens.push({ html: from, gradient: false, resolved: false });
                    }
                }

                // Merge consecutive resolved gradient tokens into one span
                let output = '';
                let gradientBuf = '';
                for (const t of tokens) {
                    if (t.resolved && t.gradient) {
                        gradientBuf += t.html;
                    } else {
                        if (gradientBuf) {
                            output += `<span class="gradient-text">${gradientBuf}</span>`;
                            gradientBuf = '';
                        }
                        output += t.html;
                    }
                }
                if (gradientBuf) {
                    output += `<span class="gradient-text">${gradientBuf}</span>`;
                }

                this.el.innerHTML = output;
                if (complete === this.queue.length) {
                    if (this.resolve) this.resolve();
                } else {
                    this.frameRequest = requestAnimationFrame(() => this.update());
                    this.frame++;
                }
            }
        }

        // Run scramble on hero title immediately (script is at bottom of body, DOM is ready)
        {
            const heroTitle = document.getElementById('heroTitle');
            if (heroTitle) {
                const text = heroTitle.textContent.trim();
                heroTitle.textContent = '';
                heroTitle.style.visibility = 'visible';

                const scrambleEl = document.createElement('span');
                scrambleEl.className = 'scramble-target';
                heroTitle.appendChild(scrambleEl);

                const fx = new TextScramble(scrambleEl);
                // Gradient the word "juliato" if present in the title
                const gradientStart = text.indexOf('juliato');
                const gradientRanges = gradientStart >= 0 ? [[gradientStart, gradientStart + 7]] : [];

                fx.setText(text, gradientRanges);
            }
        }

        // ===== EASTER EGG: Konami Code =====
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    document.body.style.animation = 'rainbow 2s linear infinite';
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });

