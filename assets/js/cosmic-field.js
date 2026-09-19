/**
 * cosmic-field.js — landing-page-only background enhancer.
 *
 * Not loaded on any other page. Contact/404/project pages keep the plain
 * CSS-driven starfield (the `animStar` keyframe animation in styles.css)
 * completely untouched.
 *
 * On THIS page, that same CSS animation is switched off for #stars/#stars2/
 * #stars3 (see `body.home #stars, ...` in styles.css) and replaced with an
 * equivalent JS-driven transform, recomputed every animation frame:
 *
 *     speed  = <that layer's original baseline px/ms> + deltaY * FACTOR
 *     offset -= speed * dt
 *
 * deltaY is this frame's raw window.scrollY change — not a velocity, no
 * dividing by elapsed time. So the model is exactly what it sounds like:
 * whatever the default drift speed already was, plus scroll delta times a
 * factor. When the user isn't scrolling, deltaY is 0 every frame, so a
 * layer just drifts at its original speed — nothing extra needs to decay.
 *
 * The scroll-driven speed change always runs, regardless of the OS/browser
 * `prefers-reduced-motion` setting — matching the original starfield drift
 * itself, which was already established (see styles.css) to always animate
 * no matter that preference.
 *
 * The galaxy backdrop is different from the stars in one respect: it has no
 * baseline drift of its own. It only moves in direct response to the same
 * scroll delta the stars react to, scaled down by GALAXY_SPEED_FACTOR, so
 * it stays perfectly still while the page is at rest and never "auto-plays".
 */
(function () {
	'use strict';

	var LAYER_IDS = ['stars', 'stars2', 'stars3'];
	var layers = LAYER_IDS.map(function (id) { return document.getElementById(id); });
	if (!layers[0]) return; // not on this page

	var galaxy = document.querySelector('.hero-galaxy');
	var galaxyGlow = document.querySelector('.hero-galaxy-glow');

	// ---- tunables -----------------------------------------------------
	// Baseline speeds match the original CSS animation exactly: each layer
	// travels 2000px over its original animation-duration (80s/160s/240s).
	var BASE_SPEED = [2000 / 80000, 2000 / 160000, 2000 / 240000]; // px/ms, per layer
	var SCROLL_FACTOR = 0.025; // this frame's raw scroll delta (px) -> added px/ms (was 0.45, now 4x slower)
	var MAX_ADDED = 0.625;      // px/ms clamp, so one huge scroll jump can't be jarring (was 2.5, scaled with it)
	// The galaxy reads as much farther away than the stars, so it only picks
	// up a fraction of the same scroll-reactive "added" speed the star
	// layers get — no baseline term, so it never drifts on its own.
	var GALAXY_SPEED_FACTOR = 1 / 3;

	var offsets = [0, 0, 0];
	var galaxyOffset = 0;
	var lastScrollY = window.scrollY;
	var lastFrameTime = performance.now();
	var rafId = null;

	function tick(now) {
		var dt = Math.min(now - lastFrameTime, 64); // clamp a tab-switch pause
		lastFrameTime = now;

		var scrollY = window.scrollY;
		var deltaY = scrollY - lastScrollY;
		lastScrollY = scrollY;

		var added = Math.max(-MAX_ADDED, Math.min(MAX_ADDED, deltaY * SCROLL_FACTOR));

		for (var i = 0; i < layers.length; i++) {
			offsets[i] -= (BASE_SPEED[i] + added) * dt;
			if (offsets[i] <= -2000) offsets[i] += 2000;
			else if (offsets[i] > 0) offsets[i] -= 2000; // added can go negative enough to reverse drift
			layers[i].style.transform = 'translate3d(0,' + offsets[i].toFixed(2) + 'px,0)';
		}

		if (galaxy || galaxyGlow) {
			galaxyOffset -= added * GALAXY_SPEED_FACTOR * dt;
			var galaxyTransform = 'translate3d(0,' + galaxyOffset.toFixed(2) + 'px,0)';
			if (galaxy) galaxy.style.transform = galaxyTransform;
			if (galaxyGlow) galaxyGlow.style.transform = galaxyTransform;
		}

		rafId = requestAnimationFrame(tick);
	}

	document.addEventListener('visibilitychange', function () {
		if (document.hidden) {
			if (rafId) cancelAnimationFrame(rafId);
			rafId = null;
		} else if (!rafId) {
			lastFrameTime = performance.now();
			rafId = requestAnimationFrame(tick);
		}
	});

	rafId = requestAnimationFrame(tick);
})();
