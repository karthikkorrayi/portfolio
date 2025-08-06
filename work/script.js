function toggleEducation() {
  const hidden = document.getElementById("hiddenEdu");
  const btn = document.querySelector(".show-all-btn");
  const isExpanded = hidden.style.display === "block";
  hidden.style.display = isExpanded ? "none" : "block";
  btn.textContent = isExpanded ? "Show All 3 educations" : "";
}

window.addEventListener('scroll', () => {
  const progress = document.getElementById('timelineProgress');
  const container = document.querySelector('.timeline-container');
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

window.addEventListener('scroll', () => {
  const progress = document.getElementById('timelineProgress');
  const container = document.querySelector('.timeline-container');
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