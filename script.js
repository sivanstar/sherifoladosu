const navLinks = document.querySelectorAll('.nav-link');
const typewriterElement = document.querySelector('.typewriter');
const statNumbers = document.querySelectorAll('.stat-number');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initTypewriter();
    initScrollReveal();
    initPortfolioFilter();
    initContactForm();
    initHamburger();
    initCursor();
});

/* ---------- Navigation + active link tracking ---------- */
function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({ top: offsetTop, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    });
}

/* ---------- Typewriter role ticker ---------- */
function initTypewriter() {
    if (!typewriterElement) return;

    const texts = typewriterElement.getAttribute('data-text').split(',').map(t => t.trim());
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 90;
    const deletingSpeed = 45;
    const pauseTime = 1800;

    if (prefersReducedMotion) {
        typewriterElement.textContent = texts[0];
        return;
    }

    function typeWriter() {
        const currentText = texts[textIndex];

        if (!isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex);
            charIndex++;
            if (charIndex === currentText.length + 1) {
                setTimeout(() => { isDeleting = true; typeWriter(); }, pauseTime);
                return;
            }
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        }

        setTimeout(typeWriter, isDeleting ? deletingSpeed : typingSpeed);
    }

    typeWriter();
}

/* ---------- Scroll reveal (cards, stats, skills) ---------- */
function initScrollReveal() {
    const staggerGroups = [
        '.highlight-item',
        '.stat-item',
        '.skill-icon-item',
        '.skill-category',
        '.portfolio-item',
        '.service-card',
        '.contact-method'
    ];

    document.querySelectorAll(staggerGroups.join(',')).forEach(el => {
        el.classList.add('reveal');
    });

    if (prefersReducedMotion) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
        statNumbers.forEach(counter => animateCounter(counter, parseInt(counter.getAttribute('data-target'), 10)));
        return;
    }

    const groupObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const group = entry.target.parentElement.querySelectorAll('.reveal');
            const siblings = Array.from(group);
            const index = siblings.indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('in-view'), Math.max(index, 0) * 90);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => groupObserver.observe(el));

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.getAttribute('data-target'), 10));
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statNumbers.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 1400;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, stepTime);
}

/* ---------- Portfolio filter ---------- */
function initPortfolioFilter() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                const show = filterValue === 'all' || category === filterValue;

                if (show) {
                    item.style.display = 'block';
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                    setTimeout(() => { item.style.transform = ''; }, 320);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.94)';
                    setTimeout(() => { item.style.display = 'none'; }, 250);
                }
            });
        });
    });

    portfolioItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

/* ---------- Contact form ---------- */
function initContactForm() {
    if (!contactForm) return;

    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        btnText.style.opacity = '0';
        btnLoader.style.display = 'block';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch('https://formspree.io/f/xzzakzbe', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                btnLoader.style.display = 'none';
                btnText.textContent = 'Message Sent';
                btnText.style.opacity = '1';
                submitBtn.style.background = '#3ddc84';

                contactForm.reset();

                setTimeout(() => {
                    btnText.textContent = 'Send Message';
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            btnLoader.style.display = 'none';
            btnText.textContent = 'Error — try again';
            btnText.style.opacity = '1';
            submitBtn.style.background = '#e5484d';

            setTimeout(() => {
                btnText.textContent = 'Send Message';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}

/* ---------- Mobile nav ---------- */
function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/* ---------- Signal cursor dot (desktop only) ---------- */
function initCursor() {
    if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return;

    const dot = document.querySelector('.cursor-dot');
    if (!dot) return;

    window.addEventListener('mousemove', (e) => {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        dot.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => dot.classList.remove('visible'));

    document.querySelectorAll('a, button, .skill-category, .service-card, .portfolio-item').forEach(el => {
        el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
        el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
    });
}