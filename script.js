document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Swap an inline-SVG icon by pointing its <use> at another symbol in the sprite
    const setIcon = (button, name) => {
        button.querySelector('use').setAttribute('href', `#i-${name}`);
    };

    // 1. Theme Toggle (Dark / Light). The saved choice, or the OS preference, is applied
    //    before first paint by an inline script in index.html; here we sync the icon and handle clicks.
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('.icon');
    let themeTransitionTimer;

    const syncThemeIcon = () => {
        setIcon(themeToggleBtn, document.body.classList.contains('dark-mode') ? 'sun' : 'moon');
    };
    syncThemeIcon();

    themeToggleBtn.addEventListener('click', () => {
        // Fade colors across the whole page for a moment instead of snapping
        if (!reduceMotion.matches) {
            document.documentElement.classList.add('theme-transition');
            clearTimeout(themeTransitionTimer);
            themeTransitionTimer = setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
            }, 700);
            themeIcon.animate(
                [{ transform: 'rotate(-60deg)', opacity: 0 }, { transform: 'rotate(0)', opacity: 1 }],
                { duration: 400, easing: 'ease-out' }
            );
        }

        document.body.classList.toggle('dark-mode');
        syncThemeIcon();

        try {
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        } catch (e) { /* storage unavailable: the choice just won't persist */ }
    });


    // 2. Mobile navigation (hamburger menu)
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    const setMenuOpen = (open) => {
        navMenu.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        setIcon(navToggle, open ? 'xmark' : 'bars');
    };

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setMenuOpen(!navMenu.classList.contains('open'));
    });
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target)) setMenuOpen(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenuOpen(false);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) setMenuOpen(false);
    });


    // 3. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: reduceMotion.matches ? 'auto' : 'smooth'
                });
            }
            setMenuOpen(false);
        });
    });


    // 4. Scroll-spy: highlight the nav link for the section in view
    const spySections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = new Map(
        Array.from(navMenu.querySelectorAll('a[href^="#"]')).map(a => [a.getAttribute('href').slice(1), a])
    );

    const setActive = (id) => {
        navLinks.forEach((link, linkId) => {
            const active = linkId === id;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    };

    if ('IntersectionObserver' in window) {
        // A thin band just above the middle of the viewport decides which section is "current"
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActive(entry.target.id || null);
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

        spySections.forEach(section => spy.observe(section));
        spy.observe(document.querySelector('.hero')); // the hero has no link, so it clears the highlight

        // The last section can end before it reaches the band, so pin it at the bottom of the page
        let spyTicking = false;
        window.addEventListener('scroll', () => {
            if (spyTicking) return;
            spyTicking = true;
            requestAnimationFrame(() => {
                const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
                if (atBottom) setActive(spySections[spySections.length - 1].id);
                spyTicking = false;
            });
        }, { passive: true });
    }


    // 5. Reveal on scroll. Classes are added here (not in the HTML), so content stays visible without JS.
    if ('IntersectionObserver' in window && !reduceMotion.matches) {
        const targets = document.querySelectorAll(
            '.section-title, .subsection-title, .work-card, .principle, .timeline-item, ' +
            '.skill-category, .cert-card, .recognition-list li, .contact-content'
        );

        // Light stagger for items that appear together in the same container
        const perParent = new Map();
        targets.forEach(el => {
            const n = perParent.get(el.parentElement) || 0;
            el.style.transitionDelay = `${Math.min(n, 5) * 80}ms`;
            perParent.set(el.parentElement, n + 1);
            el.classList.add('reveal');
        });

        const reveal = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('is-visible');
                observer.unobserve(el);

                // Once shown, hand control back to the element's normal hover transitions
                setTimeout(() => {
                    el.classList.remove('reveal', 'is-visible');
                    el.style.transitionDelay = '';
                }, 1200);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

        targets.forEach(el => reveal.observe(el));
    }
});
