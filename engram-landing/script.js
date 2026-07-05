/* ==========================================================================
   MNEMOS — Minimal, purposeful interactions
   No decoration. Only motion that explains ideas.
   ========================================================================== */

(function () {
    'use strict';

    // ── Nav scroll state ───────────────────────────────────────────────
    const nav = document.getElementById('nav');

    function onScroll() {
        nav.classList.toggle('nav--scrolled', window.scrollY > 24);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Mobile nav toggle ──────────────────────────────────────────────
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    let open = false;

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            open = !open;
            links.classList.toggle('nav-links--open', open);
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = open ? 'rotate(45deg) translate(2px, 2px)' : '';
            spans[1].style.transform = open ? 'rotate(-45deg) translate(2px, -2px)' : '';
        });

        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                open = false;
                links.classList.remove('nav-links--open');
                toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
            });
        });
    }

    // ── Smooth scroll ──────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const y = target.getBoundingClientRect().top + window.scrollY - 72;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // ── Scroll reveal ──────────────────────────────────────────────────
    // Subtle fade-in. No bounce, no slide, no scale.
    function initReveal() {
        const elements = document.querySelectorAll(
            '.problem, .insight, .solution, .architecture, ' +
            '.how, .product, .principles, .cta-section, ' +
            '.step, .ba-panel, .arch-box, .product-screen, ' +
            '.principle, .before-after'
        );

        elements.forEach(el => el.classList.add('sr'));

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Small stagger for child elements
                        const delay = entry.target.dataset.delay;
                        if (delay) {
                            entry.target.style.transitionDelay = (delay * 80) + 'ms';
                        }
                        entry.target.classList.add('sr--visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        elements.forEach(el => observer.observe(el));
    }

    initReveal();

    // ── Repetition lines stagger ───────────────────────────────────────
    // Each line in the "problem" section appears one after another
    function initRepetition() {
        const lines = document.querySelectorAll('.rep-line');
        if (!lines.length) return;

        lines.forEach(line => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(6px)';
            line.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    lines.forEach((line, i) => {
                        setTimeout(() => {
                            line.style.opacity = '';
                            line.style.transform = '';
                            // Re-apply the dimming effect for later lines
                            if (i === 3) line.style.opacity = '0.7';
                            if (i === 4) line.style.opacity = '0.5';
                            if (i === 5) line.style.opacity = '0.35';
                        }, i * 150);
                    });
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.3 }
        );

        const container = document.getElementById('repetition');
        if (container) observer.observe(container);
    }

    initRepetition();

    // ── Waitlist form ──────────────────────────────────────────────────
    const form = document.getElementById('cta-form');
    const success = document.getElementById('cta-success');
    const submit = document.getElementById('cta-submit');

    if (form && success) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('cta-email').value;
            if (!email) return;

            submit.textContent = 'Joining…';
            submit.disabled = true;

            try {
                // Replace this URL with your actual Formspree, Loops, or Supabase endpoint
                const ENDPOINT = 'https://formspree.io/f/placeholder'; 
                
                await fetch(ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });

                form.hidden = true;
                success.hidden = false;
            } catch (err) {
                console.error('Waitlist error:', err);
                submit.textContent = 'Error. Try again.';
                submit.disabled = false;
            }
        });
    }

})();
