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
        io.unobserve(el);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  rows.forEach((r) => io.observe(r));
})();

// const fabNav = document.getElementById('mobile-fab-nav');
// const toggle = document.getElementById('fab-toggle');
// toggle.addEventListener('click', () => {
//   fabNav.classList.toggle('open');
//   toggle.setAttribute(
//     'aria-expanded',
//     fabNav.classList.contains('open') ? 'true' : 'false'
//   );
// });

// ===== FAB: click to open, drag to move, snap to edge, remember position =====

// ===== FAB: click to open, drag to move, snap to edge, remember position, smart-anchoring =====
// ===== FAB: draggable, edge-snap, on-screen clamp, safe anchors, persistent =====
(function () {
  const fabNav = document.getElementById('mobile-fab-nav');
  const toggle = document.getElementById('fab-toggle');
  const menu  = document.getElementById('fab-menu');
  if (!fabNav || !toggle || !menu) return;

  const BTN = () => toggle.offsetWidth || 56;
  const MARGIN = 12; // hard min gap from edges (also reflected in CSS)
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // Compute safe margins including iOS safe-area
  function safeMargins() {
    const cs = getComputedStyle(document.documentElement);
    const sl = parseFloat(cs.getPropertyValue('--safe-l')) || 0;
    const sr = parseFloat(cs.getPropertyValue('--safe-r')) || 0;
    const sb = parseFloat(cs.getPropertyValue('--safe-b')) || 0;
    const base = MARGIN;
    return {
      left:  Math.max(base, sl),
      right: Math.max(base, sr),
      bottom: Math.max(base, sb),
      top: base
    };
  }

  // Apply left/right anchoring and up/down drop so menu stays on-screen
  function applyMenuAnchors() {
    const rect = fabNav.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;

    const isLeft = (rect.left + rect.width / 2) < (vw / 2);
    fabNav.classList.toggle('anchor-left',  isLeft);
    fabNav.classList.toggle('anchor-right', !isLeft);

    // If there's less than ~ (menu height guess) room above, drop down.
    // We'll be conservative (needs ~180px). Adjust as you like.
    const needDropDown = rect.top < 180;
    fabNav.classList.toggle('drop-down', needDropDown);
  }

  // Ensure the dot is within the viewport (clamp), used on load/resize/rotate
  function clampIntoView() {
    const btn = BTN();
    const m = safeMargins();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;

    // If we are still using default "inset" (right/bottom), do nothing.
    // If we have left/top (dragged or restored), clamp them.
    const hasLeft = fabNav.style.left && fabNav.style.left !== 'auto';
    const hasTop  = fabNav.style.top  && fabNav.style.top  !== 'auto';

    if (hasLeft || hasTop) {
      const rect = fabNav.getBoundingClientRect();
      // Use current absolute coords if available; otherwise infer from rect
      let left = hasLeft ? parseFloat(fabNav.style.left) : rect.left + window.scrollX;
      let top  = hasTop  ? parseFloat(fabNav.style.top)  : rect.top  + window.scrollY;

      left = clamp(left, m.left, vw - btn - m.right);
      top  = clamp(top,  m.top,  window.scrollY + vh - btn - m.bottom);

      fabNav.style.left   = `${left}px`;
      fabNav.style.top    = `${top}px`;
      fabNav.style.right  = 'auto';
      fabNav.style.bottom = 'auto';
    }
    applyMenuAnchors();
  }

  // Persist & restore position
  function savePos() {
    const rect = fabNav.getBoundingClientRect();
    localStorage.setItem('fabPos', JSON.stringify({
      left: rect.left + window.scrollX,
      top:  rect.top  + window.scrollY
    }));
  }
  (function restorePos() {
    try {
      const raw = localStorage.getItem('fabPos');
      if (!raw) { applyMenuAnchors(); return; }
      const pos = JSON.parse(raw);
      if (Number.isFinite(pos.left) && Number.isFinite(pos.top)) {
        fabNav.style.left   = `${pos.left}px`;
        fabNav.style.top    = `${pos.top}px`;
        fabNav.style.right  = 'auto';
        fabNav.style.bottom = 'auto';
        clampIntoView();
      }
    } catch { /* ignore bad data */ }
  })();

  // Toggle open/close (anchor first to avoid off-screen pop)
  function setExpanded(open) {
    if (open) fabNav.classList.add('open'); else fabNav.classList.remove('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', () => {
    applyMenuAnchors();
    setExpanded(!fabNav.classList.contains('open'));
  });

  // Dragging – Pointer Events
  let dragging = false, moved = false;
  let startX = 0, startY = 0, startLeft = 0, startTop = 0;

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true; moved = false;
    fabNav.classList.add('dragging');

    const rect = fabNav.getBoundingClientRect();
    startLeft = rect.left + window.scrollX;
    startTop  = rect.top  + window.scrollY;
    startX = e.clientX + window.scrollX;
    startY = e.clientY + window.scrollY;

    // switch to absolute left/top
    fabNav.style.right = 'auto';
    fabNav.style.bottom = 'auto';
    toggle.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const m = safeMargins();
    const btn = BTN();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;

    const curX = e.clientX + window.scrollX;
    const curY = e.clientY + window.scrollY;
    const dx = curX - startX;
    const dy = curY - startY;

    if (!moved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) moved = true;

    const newLeft = clamp(startLeft + dx, m.left, vw - btn - m.right);
    const newTop  = clamp(startTop  + dy, m.top,  window.scrollY + vh - btn - m.bottom);

    fabNav.style.left = `${newLeft}px`;
    fabNav.style.top  = `${newTop}px`;
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    fabNav.classList.remove('dragging');

    if (moved) {
      e.preventDefault?.();
      e.stopPropagation?.();

      // Snap horizontally to nearest edge after clamp
      const rect = fabNav.getBoundingClientRect();
      const btn = BTN();
      const vw = document.documentElement.clientWidth;
      const m = safeMargins();
      const centerX = rect.left + btn / 2;
      const snapLeft = centerX < vw / 2;
      const targetLeft = snapLeft ? m.left : (vw - btn - m.right);
      fabNav.style.left = `${targetLeft}px`;

      savePos();
      applyMenuAnchors();
    }
    toggle.releasePointerCapture?.(e.pointerId);
  }

  // Keep inside frame on resize/orientation changes
  window.addEventListener('resize', clampIntoView);
  window.addEventListener('orientationchange', () => setTimeout(clampIntoView, 0));

  toggle.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup',   onPointerUp,   { passive: false });

  // Initial anchor (in case no saved pos)
  applyMenuAnchors();
})();
