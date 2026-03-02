/*
===========================================
SILVA - Refined Animations & Effects
Version: 8.0 (Premium Edition)
Author: FOMUS
===========================================
*/

// Refined Animation System
class SilvaAnimations {
    constructor() {
        this.observers = [];
        this.animations = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.setupGlowEffects();
        this.setupCardAnimations();
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        if (this.isReducedMotion) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-50px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation attributes
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => {
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    // Animate elements based on data attributes
    animateElement(element) {
        const animationType = element.dataset.aos;
        const delay = element.dataset.aosDelay || 0;
        const duration = element.dataset.aosDuration || 600;

        setTimeout(() => {
            element.classList.add('aos-animate');
            this.applyAnimation(element, animationType, duration);
        }, delay);
    }

    // Apply specific animation
    applyAnimation(element, type, duration) {
        const animations = {
            'fade-up': () => this.fadeUp(element, duration),
            'fade-down': () => this.fadeDown(element, duration),
            'fade-left': () => this.fadeLeft(element, duration),
            'fade-right': () => this.fadeRight(element, duration),
            'zoom-in': () => this.zoomIn(element, duration),
            'zoom-out': () => this.zoomOut(element, duration),
            'flip-left': () => this.flipLeft(element, duration),
            'flip-right': () => this.flipRight(element, duration),
            'slide-up': () => this.slideUp(element, duration),
            'bounce-in': () => this.bounceIn(element, duration)
        };

        if (animations[type]) {
            animations[type]();
        }
    }

    // Animation Methods
    fadeUp(element, duration) {
        element.style.animation = `fadeInUp ${duration}ms ease-out forwards`;
    }

    fadeDown(element, duration) {
        element.style.animation = `fadeInDown ${duration}ms ease-out forwards`;
    }

    fadeLeft(element, duration) {
        element.style.animation = `fadeInLeft ${duration}ms ease-out forwards`;
    }

    fadeRight(element, duration) {
        element.style.animation = `fadeInRight ${duration}ms ease-out forwards`;
    }

    zoomIn(element, duration) {
        element.style.animation = `zoomIn ${duration}ms ease-out forwards`;
    }

    zoomOut(element, duration) {
        element.style.animation = `zoomOut ${duration}ms ease-out forwards`;
    }

    flipLeft(element, duration) {
        element.style.animation = `flipInY ${duration}ms ease-out forwards`;
    }

    flipRight(element, duration) {
        element.style.animation = `flipInX ${duration}ms ease-out forwards`;
    }

    slideUp(element, duration) {
        element.style.animation = `slideInUp ${duration}ms ease-out forwards`;
    }

    bounceIn(element, duration) {
        element.style.animation = `bounceIn ${duration}ms ease-out forwards`;
    }

    // Parallax Effects (lightweight)
    setupParallaxEffects() {
        if (this.isReducedMotion) return;

        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset;
                    parallaxElements.forEach(element => {
                        const speed = element.dataset.parallax || 0.3;
                        const yPos = -(scrollTop * speed);
                        element.style.transform = `translateY(${yPos}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Glow Effects
    setupGlowEffects() {
        const glowElements = document.querySelectorAll('.btn-glow, .card-featured');

        glowElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                element.style.setProperty('--mouse-x', x + 'px');
                element.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

    // Card Animations
    setupCardAnimations() {
        this.setupCardFlip();
        this.setupCardStack();
    }

    // Card Flip Animation
    setupCardFlip() {
        const flipCards = document.querySelectorAll('[data-flip]');

        flipCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    }

    // Card Stack Animation
    setupCardStack() {
        const stackElements = document.querySelectorAll('.card-showcase');

        stackElements.forEach(stack => {
            const cards = stack.querySelectorAll('.showcase-card');

            cards.forEach((card, index) => {
                card.style.zIndex = cards.length - index;
                card.style.transform = `translateY(${index * 10}px) rotate(${index * 5}deg)`;
            });
        });
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.animations.clear();
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main animation system
    const silvaAnimations = new SilvaAnimations();

    // Add animation keyframes and styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        /* Animation Keyframes */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes zoomIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes zoomOut {
            from {
                opacity: 0;
                transform: scale(1.2);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes flipInY {
            from {
                opacity: 0;
                transform: rotateY(-90deg);
            }
            to {
                opacity: 1;
                transform: rotateY(0deg);
            }
        }

        @keyframes flipInX {
            from {
                opacity: 0;
                transform: rotateX(-90deg);
            }
            to {
                opacity: 1;
                transform: rotateX(0deg);
            }
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(100%);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3) translateY(50px);
            }
            50% {
                opacity: 1;
                transform: scale(1.05) translateY(-20px);
            }
            70% {
                transform: scale(0.9) translateY(10px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        /* Card Flip */
        .game-card.flipped {
            transform: rotateY(180deg);
        }

        /* Initial states for AOS */
        [data-aos] {
            opacity: 0;
            transition-property: transform, opacity;
        }

        [data-aos].aos-animate {
            opacity: 1;
        }

        /* Glow Effects */
        .btn-glow {
            position: relative;
            overflow: hidden;
        }

        .btn-glow::before {
            content: '';
            position: absolute;
            top: var(--mouse-y, 50%);
            left: var(--mouse-x, 50%);
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .btn-glow:hover::before {
            opacity: 1;
        }

        /* Performance optimizations */
        .game-card,
        .showcase-card {
            will-change: transform;
            backface-visibility: hidden;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;

    document.head.appendChild(animationStyles);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SilvaAnimations
    };
}
