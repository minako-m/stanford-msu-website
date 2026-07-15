/* ================================================================
   STANFORD MSU  ·  script.js
   ================================================================ */

// ── Footer year ──────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Navbar: scroll-triggered background ──────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile hamburger menu ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Generic reveal-on-scroll (.reveal elements) ───────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Gallery: random-order staggered pop-in ────────────────────────
//
// Each gallery item gets a random transition delay when it enters
// the viewport, so images appear to pop in at different times
// rather than all at once or strictly left-to-right.
//
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

// Shuffle helper (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Assign random delays (0 – 500 ms) once at load so the order is
// locked in but still random each page visit.
const shuffled = shuffle(galleryItems);
shuffled.forEach((item, i) => {
  item.style.transitionDelay = `${i * 70}ms`;
});

const galleryObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pop-in');
        galleryObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);
galleryItems.forEach(item => galleryObserver.observe(item));

// ── Nasheed player ────────────────────────────────────────────────
const audio    = document.getElementById('nasheed-audio');
const btn      = document.getElementById('nasheed-btn');
const playIcon = document.getElementById('play-icon');
const progress = document.getElementById('nasheed-progress');

let playing = false;

function toggleNasheed() {
  if (!audio.src || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
    // No audio file connected yet — show a friendly alert
    alert('No nasheed loaded yet.\n\nTo add one:\n1. Place an MP3 in this project folder.\n2. Open index.html and update the <source src=""> inside the #nasheed-audio element.\n3. Update the nasheed-name span with the track title.');
    return;
  }

  if (playing) {
    audio.pause();
    playIcon.textContent = '▶';
    btn.querySelector('span:last-child').textContent = 'Play Nasheed';
  } else {
    audio.play().catch(() => {
      // Autoplay may be blocked — browser will show its own prompt
    });
    playIcon.textContent = '⏸';
    btn.querySelector('span:last-child').textContent = 'Pause Nasheed';
  }
  playing = !playing;
}

// Update progress bar as audio plays
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progress.style.width = pct + '%';
}, { passive: true });

// Reset state when track ends (though it's looping, just in case)
audio.addEventListener('ended', () => {
  playing = false;
  playIcon.textContent = '▶';
  btn.querySelector('span:last-child').textContent = 'Play Nasheed';
  progress.style.width = '0%';
});

