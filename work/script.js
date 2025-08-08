// Toggle Education (removed old toggle behavior; not used now)

// Experience timeline scroll progress
window.addEventListener('scroll', () => {
  const progress = document.getElementById('timelineProgress');
  if (!progress) return;
  const container = progress.closest('.timeline-container');
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
  progress.style.height = `${progressHeight}%`;
});

// Education timeline scroll progress
window.addEventListener('scroll', () => {
  const progress = document.getElementById('educationTimelineProgress');
  if (!progress) return;
  const container = progress.closest('.timeline-container');
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
  progress.style.height = `${progressHeight}%`;
});

// Reveal entries on scroll
const entries = document.querySelectorAll(".timeline-entry");
function revealOnScroll() {
  entries.forEach((entry) => {
    const rect = entry.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      entry.classList.add("show");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);