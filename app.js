/**
 * DAKSH JAIN - FUTURISTIC PORTFOLIO ENGINE
 * Core Logic: Three.js + GSAP + ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. INITIALIZATION & LOADER
    // ---------------------------------------------------------
    const loader = document.getElementById('loader');
    const body = document.body;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                body.classList.remove('loading');
                initHeroAnimations();
            }, 800);
        }, 2000); // Simulate neural interface initialization
    });

    // ---------------------------------------------------------
    // 2. CUSTOM CURSOR & RIPPLE
    // ---------------------------------------------------------
    const cursorGlow = document.getElementById('cursor-glow');
    const cursorRing = document.getElementById('cursor-ring');

    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;

        gsap.to(cursorRing, {
            x: clientX,
            y: clientY,
            duration: 0.1
        });

        gsap.to(cursorGlow, {
            x: clientX,
            y: clientY,
            duration: 0.5
        });
    });

    // Hover effect for interactive elements
    const interactives = document.querySelectorAll('a, button, .glass-card, .nav-toggle');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.width = '50px';
            cursorRing.style.height = '50px';
            cursorRing.style.borderColor = 'var(--secondary-neon)';
            cursorRing.style.backgroundColor = 'rgba(188, 0, 255, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '24px';
            cursorRing.style.height = '24px';
            cursorRing.style.borderColor = 'var(--primary-neon)';
            cursorRing.style.backgroundColor = 'transparent';
        });
    });

    // Mouse Ripple Effect
    document.addEventListener('mousedown', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'mouse-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1000);
    });

    // ---------------------------------------------------------
    // 3. THREE.JS - WEBGL BACKGROUND (Neural Network)
    // ---------------------------------------------------------
    const canvas = document.getElementById('canvas-webgl');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle System
    const particleCount = 1000;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: '#00f3ff',
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Profile Orbiting Nodes
    const hologram = document.querySelector('.hologram-frame');
    if (hologram) {
        for (let i = 0; i < 5; i++) {
            const node = document.createElement('div');
            node.className = 'orbit-node';
            const size = Math.random() * 6 + 4;
            node.style.width = `${size}px`;
            node.style.height = `${size}px`;
            node.style.animationDuration = `${Math.random() * 5 + 5}s`;
            node.style.animationDelay = `${Math.random() * 5}s`;
            hologram.appendChild(node);
        }
    }

    // Light for particles or overlay
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    camera.position.z = 3;

    // Mouse Movement for Parallax
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;

        const targetX = (mouseX - window.innerWidth / 2) * 0.0005;
        const targetY = (mouseY - window.innerHeight / 2) * 0.0005;

        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ---------------------------------------------------------
    // 4. GSAP SCROLL TRIGGER ANIMATIONS
    // ---------------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    // Hero Reveal
    function initHeroAnimations() {
        const tl = gsap.timeline();
        tl.from('.reveal', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out"
        })
            .from('.hologram-frame', {
                scale: 0.8,
                opacity: 0,
                duration: 1.5,
                ease: "expo.out"
            }, "-=1");
    }

    // Scroll Reveals for Sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.from(section.querySelectorAll('.section-header, .glass-card, .stat-item'), {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out"
        });
    });

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach(stat => {
        const value = parseFloat(stat.getAttribute('data-value'));
        const isDecimal = stat.getAttribute('data-decimal') === 'true';
        const target = stat.querySelector('.stat-number');

        ScrollTrigger.create({
            trigger: stat,
            start: "top 90%",
            onEnter: () => {
                let current = 0;
                const duration = 2000; // ms
                const steps = 60;
                const increment = value / steps;
                const interval = duration / steps;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= value) {
                        target.innerText = isDecimal ? value.toFixed(1) : Math.floor(value) + "+";
                        clearInterval(counter);
                    } else {
                        target.innerText = isDecimal ? current.toFixed(1) : Math.floor(current) + "+";
                    }
                }, interval);
            }
        });
    });

    // ---------------------------------------------------------
    // 5. 3D SKILLS SPHERE (Experimental)
    // ---------------------------------------------------------
    const skillsContainer = document.getElementById('skills-3d-container');
    if (skillsContainer) {
        const skillScene = new THREE.Scene();
        const skillCamera = new THREE.PerspectiveCamera(75, skillsContainer.offsetWidth / skillsContainer.offsetHeight, 0.1, 1000);
        const skillRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        skillRenderer.setSize(skillsContainer.offsetWidth, skillsContainer.offsetHeight);
        skillsContainer.appendChild(skillRenderer.domElement);

        const group = new THREE.Group();
        skillScene.add(group);

        const skills = ['React', 'Node', 'Python', 'C++', 'Java', 'MongoDB', 'AWS', 'TensorFlow', 'Three.js', 'Next.js'];

        skills.forEach((skill, i) => {
            const phi = Math.acos(-1 + (2 * i) / skills.length);
            const theta = Math.sqrt(skills.length * Math.PI) * phi;

            const x = 2 * Math.cos(theta) * Math.sin(phi);
            const y = 2 * Math.sin(theta) * Math.sin(phi);
            const z = 2 * Math.cos(phi);

            // Create a small sphere for each skill
            const sphereGeom = new THREE.SphereGeometry(0.15, 16, 16);
            const sphereMat = new THREE.MeshPhongMaterial({
                color: i % 2 === 0 ? '#00f3ff' : '#bc00ff',
                emissive: i % 2 === 0 ? '#00f3ff' : '#bc00ff',
                emissiveIntensity: 0.5,
                shininess: 100
            });
            const sphere = new THREE.Mesh(sphereGeom, sphereMat);
            sphere.position.set(x, y, z);
            group.add(sphere);

            // Lines connecting to center
            const lineGeom = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(x, y, z)
            ]);
            const lineMat = new THREE.LineBasicMaterial({ color: '#00f3ff', transparent: true, opacity: 0.1 });
            const line = new THREE.Line(lineGeom, lineMat);
            group.add(line);
        });

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 10, 10);
        skillScene.add(light);
        skillScene.add(new THREE.AmbientLight(0x404040));

        skillCamera.position.z = 5;

        const animateSkills = () => {
            requestAnimationFrame(animateSkills);
            group.rotation.y += 0.005;
            group.rotation.x += 0.002;
            skillRenderer.render(skillScene, skillCamera);
        };
        animateSkills();
    }

    // ---------------------------------------------------------
    // 6. UTILITIES (Nav Toggle, Form, Tilt)
    // ---------------------------------------------------------
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('open');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('open');
        });
    });

    // Smooth Scroll for Nav Links
    document.querySelectorAll('.nav-link, .btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: { y: target, offsetY: 70 },
                        ease: "power4.out"
                    });
                }
            }
        });
    });

    // Initialize Vanilla Tilt
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const btnText = btn.querySelector('.btn-text');

            btnText.innerText = "TRANSMITTING...";

            setTimeout(() => {
                btnText.innerText = "TRANSMISSION SUCCESSFUL";
                btn.style.background = "var(--accent-neon)";
                contactForm.reset();

                setTimeout(() => {
                    btnText.innerText = "INITIATE TRANSMISSION";
                    btn.style.background = "var(--primary-neon)";
                }, 3000);
            }, 1500);
        });
    }
});
