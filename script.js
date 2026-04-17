/* ===================================
   VoidSpace — JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initScrollReveal();
    initNavbar();
    initMobileMenu();
    initParallaxGlow();
    initCardMouseTracking();
    initSmoothScroll();
    initButtonRipple();
});

/* ===================================
   STARFIELD / PARTICLE BACKGROUND
   =================================== */
function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let shootingStars = [];
    let animationId;

    const STAR_COUNT = 300;
    const SHOOTING_STAR_INTERVAL = 4000;

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.speed = Math.random() * 0.3 + 0.05;
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinklePhase = Math.random() * Math.PI * 2;
            // Color variation: mostly white, some with purple/blue/cyan tints
            const colorRoll = Math.random();
            if (colorRoll < 0.7) {
                this.color = `rgba(255, 255, 255, `;
            } else if (colorRoll < 0.8) {
                this.color = `rgba(139, 92, 246, `;
            } else if (colorRoll < 0.9) {
                this.color = `rgba(59, 130, 246, `;
            } else {
                this.color = `rgba(6, 182, 212, `;
            }
        }

        update(time) {
            this.y += this.speed;
            const twinkle = Math.sin(time * this.twinkleSpeed + this.twinklePhase);
            this.currentOpacity = this.opacity * (0.5 + 0.5 * twinkle);

            if (this.y > height + 10) {
                this.y = -10;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.currentOpacity + ')';
            ctx.fill();

            // Glow for larger stars
            if (this.size > 1.2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color + (this.currentOpacity * 0.1) + ')';
                ctx.fill();
            }
        }
    }

    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width * 0.7;
            this.y = Math.random() * height * 0.4;
            this.length = Math.random() * 80 + 40;
            this.speed = Math.random() * 8 + 6;
            this.angle = Math.PI / 6 + Math.random() * 0.3;
            this.opacity = 1;
            this.active = true;
            this.trail = [];
        }

        update() {
            const dx = Math.cos(this.angle) * this.speed;
            const dy = Math.sin(this.angle) * this.speed;
            this.x += dx;
            this.y += dy;
            this.opacity -= 0.015;

            this.trail.unshift({ x: this.x, y: this.y, opacity: this.opacity });
            if (this.trail.length > 20) this.trail.pop();

            if (this.opacity <= 0 || this.x > width + 100 || this.y > height + 100) {
                this.active = false;
            }
        }

        draw() {
            if (!this.active) return;
            for (let i = 0; i < this.trail.length; i++) {
                const t = this.trail[i];
                const alpha = t.opacity * (1 - i / this.trail.length) * 0.6;
                const size = (1 - i / this.trail.length) * 2;
                ctx.beginPath();
                ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();
            }
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function init() {
        resize();
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(new Star());
        }
    }

    let lastShootingStarTime = 0;
    function animate(time) {
        ctx.clearRect(0, 0, width, height);

        // Update and draw stars
        for (const star of stars) {
            star.update(time);
            star.draw();
        }

        // Shooting stars
        if (time - lastShootingStarTime > SHOOTING_STAR_INTERVAL) {
            shootingStars.push(new ShootingStar());
            lastShootingStarTime = time;
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
            shootingStars[i].update();
            shootingStars[i].draw();
            if (!shootingStars[i].active) {
                shootingStars.splice(i, 1);
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    init();
    animate(0);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            // Re-distribute stars across new dimensions
            for (const star of stars) {
                if (star.x > width) star.x = Math.random() * width;
                if (star.y > height) star.y = Math.random() * height;
            }
        }, 150);
    });
}

/* ===================================
   SCROLL REVEAL ANIMATIONS
   =================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal:not(.hero .reveal)');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ===================================
   NAVBAR SCROLL EFFECT
   =================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* ===================================
   MOBILE MENU
   =================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navActions = document.querySelector('.nav-actions');

    if (!menuBtn) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        if (navActions) navActions.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            if (navActions) navActions.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ===================================
   PARALLAX GLOW EFFECT
   =================================== */
function initParallaxGlow() {
    const glows = document.querySelectorAll('.hero-glow');
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        glows.forEach((glow, index) => {
            const factor = (index + 1) * 15;
            glow.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ===================================
   CARD MOUSE TRACKING (Radial glow)
   =================================== */
function initCardMouseTracking() {
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });
}

/* ===================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   =================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPos,
                behavior: 'smooth'
            });
        });
    });
}

/* ===================================
   BUTTON RIPPLE EFFECT
   =================================== */
function initButtonRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out forwards;
                pointer-events: none;
            `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add the ripple keyframes to the document
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
