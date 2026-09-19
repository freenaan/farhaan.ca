document.addEventListener('DOMContentLoaded', () => {
  // Tile height must match the wrap distance used everywhere the starfield
  // loops: the -2000px `animStar` keyframe in styles.css (every page except
  // the homepage) and the 2000px wrap in cosmic-field.js (homepage only).
  //
  // Keeping the star PATTERN itself periodic at exactly this height is what
  // makes the loop seamless. Previously each layer was one random scatter
  // of dots spread across the whole scrollable range, so wrapping the
  // translate offset snapped to a completely different-looking arrangement
  // — jarring, especially at higher scroll-driven speeds. Now the pattern
  // from y=[0, 2000) is stamped again at y=[2000, 4000), [4000, 6000), etc.
  // Wrapping the offset by exactly one tile-height reveals pixel-for-pixel
  // the same dots that just scrolled off, so there's nothing to notice —
  // seamless at any speed, with no swap-timing logic needed.
  const TILE_HEIGHT = 2000;

  // Starfield generator: builds `count` random dot positions within one
  // tile, then repeats that exact set at each tile offset needed to cover
  // the viewport height plus one full tile of travel, so there's never a
  // gap at the bottom edge no matter how tall the viewport is.
  function generateShadows(count, width, viewportHeight) {
    const basePositions = [];
    for (let i = 0; i < count; i++) {
      basePositions.push([
        Math.floor(Math.random() * width),
        Math.floor(Math.random() * TILE_HEIGHT)
      ]);
    }

    const tilesNeeded = Math.ceil((viewportHeight + TILE_HEIGHT) / TILE_HEIGHT) + 1;

    const parts = [];
    for (let t = 0; t < tilesNeeded; t++) {
      const yOffset = t * TILE_HEIGHT;
      for (const [x, y] of basePositions) {
        parts.push(`${x}px ${y + yOffset}px #FFF`);
      }
    }
    return parts.join(', ');
  }

  // Setup star layers after small delay so CSS sizes are settled
  function setupStars() {
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const s1 = document.getElementById('stars');
    const s2 = document.getElementById('stars2');
    const s3 = document.getElementById('stars3');
    if (s1) { s1.style.boxShadow = generateShadows(500, w, vh); s1.style.width = '1px'; s1.style.height = '1px'; }
    if (s2) { s2.style.boxShadow = generateShadows(200, w, vh); s2.style.width = '2px'; s2.style.height = '2px'; }
    if (s3) { s3.style.boxShadow = generateShadows(100, w, vh); s3.style.width = '3px'; s3.style.height = '3px'; }
  }

  // Debounced resize handling so stars always cover the full viewport
  let _resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(setupStars, 150);
  });

  // initial setup shortly after load
  setTimeout(setupStars, 50);

  // pointermove -> update CSS variables on body for reactive backgrounds
  document.body.addEventListener("pointermove", (e) => {
    const { currentTarget: el, clientX: x, clientY: y } = e;
    const { top: t, left: l, width: w, height: h } = el.getBoundingClientRect();
    el.style.setProperty('--posX', x - l - w / 2);
    el.style.setProperty('--posY', y - t - h / 2);
  });
});
