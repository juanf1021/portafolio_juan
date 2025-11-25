document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Hero Typing Effect ---
    const typingElement = document.getElementById('typing-text');
    const words = ["Manual Work", "Busywork", "Repetitive Tasks", "Inefficiency"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster deletion
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150; // Normal typing
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    if (typingElement) type();

    // --- 2. Tech Stack Showcase - Expandable Cards ---
    const toolCards = document.querySelectorAll('.tool-card');

    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            // Close all other cards
            toolCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                }
            });

            // Toggle current card
            card.classList.toggle('expanded');
        });
    });

    // --- 3. Smooth Scroll for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 4. 3D Particle Network (Hero Background) ---
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = 60;
        const connectionDistance = 150;
        const rotationSpeed = 0.002;

        function resize() {
            width = heroCanvas.width = heroCanvas.parentElement.offsetWidth;
            height = heroCanvas.height = heroCanvas.parentElement.offsetHeight;
        }

        class Particle3D {
            constructor() {
                this.x = (Math.random() - 0.5) * width;
                this.y = (Math.random() - 0.5) * height;
                this.z = (Math.random() - 0.5) * width; // Depth
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.vz = (Math.random() - 0.5) * 0.5;
            }

            update() {
                // Rotate around Y axis
                const cos = Math.cos(rotationSpeed);
                const sin = Math.sin(rotationSpeed);
                const x = this.x * cos - this.z * sin;
                const z = this.z * cos + this.x * sin;
                this.x = x;
                this.z = z;

                // Move
                this.y += this.vy;

                // Boundaries (wrap around)
                if (this.y > height / 2) this.y = -height / 2;
                if (this.y < -height / 2) this.y = height / 2;
            }

            project() {
                const perspective = 300;
                const scale = perspective / (perspective + this.z + 400); // Simple projection
                return {
                    x: width / 2 + this.x * scale,
                    y: height / 2 + this.y * scale,
                    scale: scale,
                    alpha: (scale - 0.2) // Fade distant particles
                };
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle3D());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => p.update());

            // Draw connections
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                const proj1 = p1.project();
                if (proj1.alpha <= 0) continue;

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const proj2 = p2.project();
                    if (proj2.alpha <= 0) continue;

                    const dx = proj1.x - proj2.x;
                    const dy = proj1.y - proj2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * Math.min(proj1.alpha, proj2.alpha) * 0.5;
                        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`; // Blue accent
                        ctx.beginPath();
                        ctx.moveTo(proj1.x, proj1.y);
                        ctx.lineTo(proj2.x, proj2.y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            particles.forEach(p => {
                const proj = p.project();
                if (proj.alpha > 0) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${proj.alpha})`;
                    ctx.beginPath();
                    ctx.arc(proj.x, proj.y, 2 * proj.scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resize);
        resize();
        initParticles();
        animateParticles();
    }

    // --- 5. 3D Tilt Effect for Cards ---
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (max 15 degrees)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Invert Y for tilt
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});
