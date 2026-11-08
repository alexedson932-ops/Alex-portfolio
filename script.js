// Display the current year in the footer .
const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Image preview modal works on both the homepage and project detail pages.
const galleryImages = document.querySelectorAll(
    ".gallery-image, .details-gallery-image"
);
const imageModal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const closeModal = document.getElementById("close-modal");

function closeImageModal() {
    if (!imageModal) return;
    imageModal.classList.remove("active");
    imageModal.setAttribute("aria-hidden", "true");
    if (modalImage) modalImage.src = "";
    document.body.style.overflow = "";
}

if (imageModal && modalImage && closeModal) {
    galleryImages.forEach((image) => {
        image.addEventListener("click", () => {
            modalImage.src = image.currentSrc || image.src;
            modalImage.alt = image.alt || "Expanded project screenshot";
            imageModal.classList.add("active");
            imageModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            closeModal.focus();
        });
    });

    closeModal.addEventListener("click", closeImageModal);

    imageModal.addEventListener("click", (event) => {
        if (event.target === imageModal) closeImageModal();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && imageModal.classList.contains("active")) {
            closeImageModal();
        }
    });
}



const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//  Animated network background 
const canvas = document.getElementById("bg-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height, nodes = [];
    const pointer = { x: -9999, y: -9999 };

    function setupCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(80, Math.floor((width * height) / 20000));
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.8
        }));
    }

    function drawFrame() {
        ctx.clearRect(0, 0, width, height);
        const linkDistance = 140;

        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            if (!reduceMotion) {
                a.x += a.vx;
                a.y += a.vy;
                if (a.x < 0 || a.x > width) a.vx *= -1;
                if (a.y < 0 || a.y > height) a.vy *= -1;
            }

            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(125, 211, 252, 0.75)";
            ctx.fill();

            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < linkDistance) {
                    ctx.strokeStyle = "rgba(56, 189, 248," + (0.22 * (1 - dist / linkDistance)) + ")";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            const mx = a.x - pointer.x;
            const my = a.y - pointer.y;
            const md = Math.sqrt(mx * mx + my * my);
            if (md < 170) {
                ctx.strokeStyle = "rgba(244, 114, 182," + (0.45 * (1 - md / 170)) + ")";
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(pointer.x, pointer.y);
                ctx.stroke();
            }
        }

        if (!reduceMotion) requestAnimationFrame(drawFrame);
    }

    setupCanvas();
    drawFrame();
    window.addEventListener("resize", () => {
        setupCanvas();
        if (reduceMotion) drawFrame();
    });
    window.addEventListener("pointermove", (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
    });
    window.addEventListener("pointerleave", () => {
        pointer.x = pointer.y = -9999;
    });
}

//  Typing effect in the hero 
const typedElement = document.getElementById("typed");
if (typedElement) {
    const phrases = [
        "Building practical software systerms",
        "Engineering solutions with purpose and impact",
        "Turning real word problem into software solutions",
        "Combining software development with analytical thinking",
        "network administrator"
    ];

    if (reduceMotion) {
        typedElement.textContent = phrases[0];
    } else {
        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function type() {
            const phrase = phrases[phraseIndex];
            typedElement.textContent = phrase.substring(0, charIndex);

            let delay = deleting ? 28 : 55;
            if (!deleting && charIndex === phrase.length) {
                delay = 1700;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 400;
            }
            charIndex += deleting ? -1 : 1;
            if (charIndex < 0) charIndex = 0;
            setTimeout(type, delay);
        }
        type();
    }
}

// ---------- Scroll progress bar ----------
const progressBar = document.getElementById("scroll-progress");
if (progressBar) {
    const updateProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
}

// ---------- Highlight the active menu link ----------
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
if (navLinks.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
                });
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    navLinks.forEach((link) => {
        const section = document.querySelector(link.getAttribute("href"));
        if (section) sectionObserver.observe(section);
    });
}

// ---------- Reveal on scroll ----------
if (document.body.classList.contains("home-page") && "IntersectionObserver" in window && !reduceMotion) {
    const targets = document.querySelectorAll(
        ".section-title, .about-content p, .about-highlight, .education-card, " +
        ".skills-group-title, .skill-card, .project-item, .contact-section > *"
    );
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach((el, i) => {
        el.classList.add("reveal");
        el.style.setProperty("--d", (i % 4) * 0.08 + "s");
        revealObserver.observe(el);
    });
}

// ---------- Mouse spotlight on cards ----------
document.querySelectorAll(".skill-card, .education-card, .about-highlight, .project-item").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
        card.style.setProperty("--my", (e.clientY - rect.top) + "px");
    });
});
