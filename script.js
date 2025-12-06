// Smooth scroll for sidebar navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Highlight active section in sidebar while scrolling
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  {
    rootMargin: '-50% 0px -40% 0px',
    threshold: 0.1
  }
);

sections.forEach(sec => observer.observe(sec));

// Toggle open/close each section body
document.querySelectorAll('.section').forEach(section => {
  const btn = section.querySelector('.toggle-btn');
  const body = section.querySelector('.section-body');

  if (!btn || !body) return;

  btn.addEventListener('click', () => {
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    btn.textContent = isHidden ? '−' : '+';
  });
});

// =========================
//   DARK MODE DEFAULT
// =========================

const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function setTheme(mode) {
  if (mode === 'dark') {
    root.classList.add('dark');
    themeToggle.textContent = '☀️ Light mode';
  } else {
    root.classList.remove('dark');
    themeToggle.textContent = '🌙 Dark mode';
  }
  localStorage.setItem('theme', mode);
}

// Default = dark, unless user changed it before
const saved = localStorage.getItem('theme');

if (!saved) {
  setTheme('dark');
} else {
  setTheme(saved);
}

themeToggle.addEventListener('click', () => {
  const isDark = root.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
});
