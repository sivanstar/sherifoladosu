const navLinks = document.querySelectorAll('.nav-link');
const typewriterElement = document.querySelector('.typewriter');
const statNumbers = document.querySelectorAll('.stat-number');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');
const skillIconItems = document.querySelectorAll('.skill-icon-item');
const skillCategories = document.querySelectorAll('.skill-category');

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initTypewriter();
    initAnimations();
    initPortfolioFilter();
    initContactForm();
    initScrollEffects();
});

function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.5)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.5)';
            navbar.style.boxShadow = 'none';
        }
    });
}

function initTypewriter() {
    if (!typewriterElement) return;
    
    const texts = typewriterElement.getAttribute('data-text').split(',');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;

    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (!isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex);
            charIndex++;
            
            if (charIndex === currentText.length) {
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, pauseTime);
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
        
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(typeWriter, speed);
    }
    
    typeWriter();
}

function initAnimatedCounters() {
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    statNumbers.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current) + '+';
        
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);
        
    }, stepTime);
}

function initSkillIconsAnimation() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillsSection = entry.target;
                const icons = skillsSection.querySelectorAll('.skill-icon-item');
                
                icons.forEach((icon, index) => {
                    setTimeout(() => {
                        icon.style.opacity = '1';
                        icon.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const skillsIconsSection = document.querySelector('.skills-icons');
    if (skillsIconsSection) {
        observer.observe(skillsIconsSection);
    }
}

function initSkillCategoriesAnimation() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillsSection = entry.target;
                const categories = skillsSection.querySelectorAll('.skill-category');
                
                categories.forEach((category, index) => {
                    setTimeout(() => {
                        category.style.opacity = '1';
                        category.style.transform = 'translateY(0)';
                    }, index * 150);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

function initPortfolioFilter() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initContactForm() {
    if (!contactForm) return;
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
            input.style.borderColor = '#1770FD';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
            if (!input.value) {
                input.style.borderColor = '#e5e7eb';
            }
        });
    });
    
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
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                btnLoader.style.display = 'none';
                btnText.textContent = 'Message Sent!';
                btnText.style.opacity = '1';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                contactForm.reset();
                
                setTimeout(() => {
                    btnText.textContent = 'Send Message';
                    submitBtn.style.background = 'linear-gradient(135deg, #1770FD, #0052CC)';
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            btnLoader.style.display = 'none';
            btnText.textContent = 'Error! Try Again';
            btnText.style.opacity = '1';
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            
            setTimeout(() => {
                btnText.textContent = 'Send Message';
                submitBtn.style.background = 'linear-gradient(135deg, #1770FD, #0052CC)';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}

function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.highlight-item, .service-card, .portfolio-item, .contact-method, .stat-item'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.geometric-shape');
        const floatingCodes = document.querySelectorAll('.floating-code');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.2);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        floatingCodes.forEach((code, index) => {
            const speed = 0.3 + (index * 0.1);
            code.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

function initAnimations() {
    initAnimatedCounters();
    initSkillIconsAnimation();
    initSkillCategoriesAnimation();
    
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        line.style.opacity = '0';
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.animation = 'slideInLeft 0.5s ease';
        }, index * 500);
    });
    
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const image = item.querySelector('.portfolio-image img');
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const image = item.querySelector('.portfolio-image img');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
}

window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent && heroVisual) {
        heroContent.style.opacity = '0';
        heroVisual.style.opacity = '0';
        heroContent.style.transform = 'translateX(-50px)';
        heroVisual.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroVisual.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroVisual.style.opacity = '1';
            heroContent.style.transform = 'translateX(0)';
            heroVisual.style.transform = 'translateX(0)';
        }, 300);
    }
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.section-header, .about-intro, .skills-grid');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', debounce(revealOnScroll, 50));

// Hamburger menu functionality - Fix
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});