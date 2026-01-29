// Image placeholder preview: click a placeholder to select an image
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.proj-item').forEach(item => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    item.appendChild(input);

    item.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const img = item.querySelector('img');
      img.src = URL.createObjectURL(f);
      img.onload = () => URL.revokeObjectURL(img.src);
      item.classList.add('filled');
    });
  });
  
  // Starfield generator (creates box-shadow strings for many stars)
  function generateShadows(count, width, height) {
    const parts = [];
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      parts.push(`${x}px ${y}px #FFF`);
    }
    return parts.join(', ');
  }

  // Setup star layers after small delay so CSS sizes are settled
  function setupStars() {
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) + 2000;

    const s1 = document.getElementById('stars');
    const s2 = document.getElementById('stars2');
    const s3 = document.getElementById('stars3');
    if (s1) { s1.style.boxShadow = generateShadows(500, w, h); s1.style.width = '1px'; s1.style.height = '1px'; }
    if (s2) { s2.style.boxShadow = generateShadows(200, w, h); s2.style.width = '2px'; s2.style.height = '2px'; }
    if (s3) { s3.style.boxShadow = generateShadows(100, w, h); s3.style.width = '3px'; s3.style.height = '3px'; }
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
