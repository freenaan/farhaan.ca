/**
 * flying-artifacts.js — landing-page-only decorative layer.
 *
 * Monochrome renders of a handful of real projects drift past as the page
 * scrolls, behind the text/cards but above the starfield. Every artifact is
 * optional: the images referenced in ARTIFACTS don't exist in the repo yet,
 * so each one is preloaded with a plain Image() first, and only added to
 * the page if it actually loads. A missing file is silently skipped — no
 * broken-image icon, no console error, no layout gap.
 *
 * To add or update an artifact later, just drop the file at the given path
 * under assets/images/artifacts/ and it starts appearing automatically; no
 * other code needs to change.
 */
(function () {
	'use strict';

	if (!document.body.classList.contains('home')) return;

	// ---- centralized artifact config -----------------------------------
	// top:   document position (viewport-height units) where the artifact
	//        sits at rest, spreading the four across the page's scroll range
	// side / edge: which edge it's anchored to and how far off it sits —
	//        a small negative edge value lets it crop against the viewport
	// size:  rendered width in px, height follows the image's own ratio
	// rotate: base tilt in degrees
	// speed: parallax multiplier applied to scroll distance (varied per
	//        artifact so they drift at different rates, not in lockstep)
	var ARTIFACTS = [
		{
			id: 'pioneer-arm',
			src: 'assets/images/artifacts/pioneer-arm.png',
			alt: '',
			top: '32vh', side: 'left', edge: '-6%',
			size: 210, rotate: -13, speed: 0.10
		},
		{
			id: 'planetary-transmission',
			src: 'assets/images/artifacts/planetary-transmission.png',
			alt: '',
			top: '88vh', side: 'right', edge: '-9%',
			size: 260, rotate: 16, speed: 0.17
		},
		{
			id: 'calculator',
			src: 'assets/images/artifacts/calculator.png',
			alt: '',
			top: '148vh', side: 'left', edge: '1%',
			size: 190, rotate: -8, speed: 0.13
		},
		{
			id: 'sumobot',
			src: 'assets/images/artifacts/sumobot.png',
			alt: '',
			top: '200vh', side: 'right', edge: '-5%',
			size: 230, rotate: 12, speed: 0.20
		}
	];

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var active = [];
	var field = null;

	function ensureField() {
		if (field) return field;
		field = document.createElement('div');
		field.className = 'artifact-field';
		field.setAttribute('aria-hidden', 'true');
		document.body.appendChild(field);
		return field;
	}

	function mount(cfg) {
		var el = document.createElement('img');
		el.src = cfg.src;
		el.alt = cfg.alt || '';
		el.className = 'flying-artifact';
		el.style.top = cfg.top;
		el.style[cfg.side] = cfg.edge;
		el.style.width = cfg.size + 'px';
		el.style.transform = 'rotate(' + cfg.rotate + 'deg)';
		ensureField().appendChild(el);
		if (!reduceMotion) active.push({ el: el, cfg: cfg });
	}

	ARTIFACTS.forEach(function (cfg) {
		var probe = new Image();
		probe.onload = function () { mount(cfg); };
		probe.onerror = function () { /* asset not uploaded yet — skip silently */ };
		probe.src = cfg.src;
	});

	if (reduceMotion) return;

	var ticking = false;
	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(function () {
			var scrollY = window.scrollY;
			for (var i = 0; i < active.length; i++) {
				var item = active[i];
				var travel = scrollY * item.cfg.speed;
				var rotate = item.cfg.rotate + scrollY * 0.015 * item.cfg.speed;
				item.el.style.transform = 'translate3d(0,-' + travel.toFixed(1) + 'px,0) rotate(' + rotate.toFixed(1) + 'deg)';
			}
			ticking = false;
		});
	}

	window.addEventListener('scroll', onScroll, { passive: true });
})();
