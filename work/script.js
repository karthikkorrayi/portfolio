// EDUCATION timeline progress (experience is plain rows; no timeline there)
function setTimelineProgress(progressEl) {
  if (!progressEl) return;
  const container = progressEl.closest('.timeline-container');
  if (!container) return;

  const containerTop = container.getBoundingClientRect().top;
  const containerHeight = container.offsetHeight;
  const windowHeight = window.innerHeight;

  let progressHeight;
  if (containerTop < windowHeight && containerTop + containerHeight > 0) {
    const visiblePart = windowHeight - containerTop;
    const scrollPercent = Math.min(1, visiblePart / containerHeight);
    progressHeight = scrollPercent * 100;
  } else {
    progressHeight = 0;
  }
  progressEl.style.height = `${progressHeight}%`;
}

function onScroll() {
  setTimelineProgress(document.getElementById('educationTimelineProgress'));
  revealOnScroll();
}

window.addEventListener('scroll', onScroll);
window.addEventListener('load', onScroll);

// Reveal education timeline entries on scroll
const revealTargets = document.querySelectorAll(".timeline-entry");
function revealOnScroll() {
  revealTargets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
}

// EXPERIENCE: slide-in on scroll with a small "jump"
(function setupExperienceReveal() {
  const rows = Array.from(document.querySelectorAll('.exp-row'));
  if (!rows.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Stagger based on document order
        const index = rows.indexOf(el);
        el.style.setProperty('--stagger', `${Math.min(index * 0.12, 0.6)}s`);
        el.classList.add('in-view');
        io.unobserve(el); // animate once
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  rows.forEach((r) => io.observe(r));
})();
