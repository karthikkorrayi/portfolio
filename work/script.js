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

// Reveal entries on scroll
const revealTargets = document.querySelectorAll(".timeline-entry");
function revealOnScroll() {
  revealTargets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
}