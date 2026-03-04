/* ============================================================
   ERVA SAVALIYA — PORTFOLIO
   script.js
   ============================================================ */

// ─── Custom Cursor ──────────────────────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  dot.style.opacity  = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  dot.style.opacity  = '1';
  ring.style.opacity = '0.5';
});

// ─── Particles Canvas ───────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
  });

  const PARTICLE_COUNT = 80;
  const COLOR          = '0, 255, 179';

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : H + 10;
      this.size  = Math.random() * 1.5 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.alpha  = Math.random() * 0.5 + 0.1;
      this.pulse  = Math.random() * Math.PI * 2;
    }
    update() {
      this.x     += this.speedX;
      this.y     += this.speedY;
      this.pulse += 0.025;
      this.alpha  = (Math.sin(this.pulse) * 0.2 + 0.3);
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, ${this.alpha})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  // Grid lines (subtle hex-like grid)
  function drawGrid() {
    const spacing = 60;
    ctx.strokeStyle = `rgba(${COLOR}, 0.03)`;
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  }

  // Connect nearby particles
  function connectParticles() {
    const MAX_DIST = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(loop);
  }
  loop();
})();

// ─── Navbar scroll + active link ────────────────────────────
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
  // sticky style
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

// ─── Mobile menu ────────────────────────────────────────────
const menuToggle = document.getElementById('menu-toggle');
const mobileNav  = document.getElementById('mobile-nav');

menuToggle.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  // animate hamburger
  const spans = menuToggle.querySelectorAll('span');
  if (mobileNav.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close mobile nav on link click
document.querySelectorAll('#mobile-nav a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});

// ─── Theme Toggle ───────────────────────────────────────────
const themeBtn   = document.getElementById('theme-toggle');
const themeIcon  = document.getElementById('theme-icon');

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  themeIcon.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('erva-theme', isLight ? 'light' : 'dark');
});

// Load saved theme
const savedTheme = localStorage.getItem('erva-theme');
if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
  themeIcon.textContent = '🌙';
}

// ─── Scroll-triggered fade-up animations ────────────────────
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger children if parent has .stagger class
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// ─── Typed terminal effect ───────────────────────────────────
(function terminalTyper() {
  const lines = [
    { selector: '#t-line-1', delay: 400  },
    { selector: '#t-line-2', delay: 1000 },
    { selector: '#t-line-3', delay: 1800 },
    { selector: '#t-line-4', delay: 2600 },
    { selector: '#t-line-5', delay: 3200 },
    { selector: '#t-line-6', delay: 3900 },
  ];

  lines.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.animation = 'fadeInLine 0.4s ease';
    }, delay);
  });
})();

// ─── Form Submission ─────────────────────────────────────────
const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-message').value.trim();

  if (!name || !email || !message) {
    feedback.textContent = "> Error: All fields required.";
    feedback.style.color = "#ff5f57";
    return;
  }

  feedback.textContent = "> Sending message...";
  feedback.style.color = "var(--accent-cyan)";

  emailjs.send("service_rjmtrnl", "template_dr9iq0e", {
    from_name: name,
    from_email: email,
    message: message
  })
  .then(function() {
    feedback.textContent = "> Message sent successfully!";
    form.reset();
  })
  .catch(function(error) {
    feedback.textContent = "> Failed to send message.";
    feedback.style.color = "#ff5f57";
  });
});
  

  // Simulate send
  feedback.textContent = '> Sending message...';
  feedback.style.color = 'var(--accent-cyan)';

  setTimeout(() => {
    feedback.textContent = '> Message sent successfully. I\'ll get back to you soon!';
    form.reset();
  }, 1200);


// ─── Stagger delays for grid items ──────────────────────────
document.querySelectorAll('.skills-grid .skill-card').forEach((card, i) => {
  card.setAttribute('data-delay', i * 60);
  card.classList.add('fade-up');
  observer.observe(card);
});

document.querySelectorAll('.projects-grid .project-card').forEach((card, i) => {
  card.setAttribute('data-delay', i * 100);
  card.classList.add('fade-up');
  observer.observe(card);
});

document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.setAttribute('data-delay', i * 150);
  item.classList.add('fade-up');
  observer.observe(item);
});

// ─── Glitch effect on hero name ─────────────────────────────
(function glitchEffect() {
  const last = document.querySelector('.hero-name .last');
  if (!last) return;

  function glitch() {
    last.style.textShadow =
      `2px 0 #ff0050, -2px 0 #00ffb3`;
    setTimeout(() => {
      last.style.textShadow = '0 0 40px rgba(0, 255, 179, 0.35)';
    }, 100);
  }

  setInterval(glitch, 4000);
})();
