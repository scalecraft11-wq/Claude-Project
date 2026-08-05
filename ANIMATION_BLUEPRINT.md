# Lumora Motion & Interaction Blueprint (v1.0)
## The Complete Animation System

**Role:** Motion direction and technical animation architecture for an Awwwards-tier build.
**Status:** Blueprint sign-off — no components, shaders, or animation code exist yet. This document is what they will be built from.
**Targets:** 60fps sustained on every animated interaction · Lighthouse Performance ≥ 95 on mobile and desktop, on both the Agency site and the Lumora Skin experience.

---

## 0. Governing Principle

Every technique in this document earns its place by one of three tests: **it clarifies causality** (this scroll caused that motion), **it adds tactility to direct manipulation** (a drag, a hover, a press), or **it is a signature moment used exactly once** (the hero entrance, the product reveal). Anything that fails all three tests is cut — per the Design System's restraint principle, an Awwwards-quality build is defined as much by what doesn't move as by what does.

Performance is not a phase-two optimization pass here — it is a **design constraint applied at decision time**. Every technique below is specified together with its cost and its fallback, because a 60fps target and a 95+ Lighthouse score are commitments, not aspirations.

---

## 1. Tool Division of Labor

Six motion tools are in the stack. Each owns a distinct job; none overlaps another's responsibility. This table is the single most important governance artifact in this document — every animation decision below traces back to a row in it.

| Tool | Owns | Why this tool, specifically | Never used for |
|---|---|---|---|
| **Lenis** | The single global smooth-scroll substrate; emits normalized scroll-progress that every other tool consumes | Only tool purpose-built to normalize wheel/touch/trackpad physics consistently across browsers while exposing a clean progress value | Animating anything itself — it only smooths continuous scroll |
| **GSAP + ScrollTrigger** | Scroll-position-driven macro choreography: pinned hero sequences, scrubbed reveals, multi-element timeline sequencing (text + 3D camera moving in lockstep) | Timeline sequencing and scroll-scrubbing across DOM *and* Three.js targets simultaneously has no equal — this is the tool for "cinematic," not "reactive" | Simple component enter/exit with no scroll relationship; anything that should feel snappy/reactive to *state*, not scroll position |
| **Framer Motion** | Component-state-driven motion: mount/unmount transitions (modals, drawers, toasts), layout animations, hover/press/focus feedback on DOM components, shared-element/page transitions | Deepest React integration — animations are declarative and tied to component lifecycle, which is exactly what modals/routes/lists need | Long scroll-scrubbed timelines; anything running at high frequency outside React's render cycle (cursor tracking) |
| **Motion One** | Ultra-lightweight (~5kb), WAAPI-backed micro-animations that must run before/independent of the React bundle: the pre-hydration loading sequence, the cursor-follow dot, count-up statistics, simple CSS-variable-driven scroll utilities on low-power devices | Its whole value is bundle size + running on the browser's native animation engine off the main thread — exactly what a critical-path loader and a 120Hz-sampled cursor need | Complex orchestrated timelines (GSAP's job) or anything needing deep React state integration (Framer Motion's job) |
| **React Spring** (`@react-spring/web` + `@react-spring/three`) | Physics-based spring interactions: magnetic button pull, drag-release inertia/momentum, 3D camera "organic follow" damping, product-model rotation | The only tool in the stack modeling true mass/stiffness/damping rather than duration/easing curves — needed anywhere motion should respond continuously to a moving target (a cursor, a drag gesture, a live scroll value) rather than play a fixed timeline | Fixed-duration reveals, page transitions, anything with a clear start/end that isn't chasing a moving value |
| **Three.js / R3F / Drei** | The 3D scene itself: geometry, materials, lighting, particles, camera rig | As established in the Design System — 3D authored as React components sharing state with the rest of the app | DOM/UI chrome motion — 3D never animates buttons or text; those stay in the DOM layers above |

**Shared vocabulary rule:** all six tools consume the *same* duration/easing/spring-preset tokens defined in the Design System (§25/§32) and restated as physics presets in §24 here — so no user can perceive a "seam" between a GSAP-driven hero and a React-Spring-driven button, even though five different engines are running under the hood.

---

## 2. Loading Animation

**Purpose:** bridge the gap between "page requested" and "experience ready" without it reading as a wait.

- **Agency site:** the monogram mark line-draws itself (SVG `stroke-dashoffset` animation, Motion One, ~900ms, `ease-luxury-out`) against the paper/ink canvas — no progress bar, no percentage; the mark completing *is* the signal. Minimum display floor of 500ms even on instant loads (an instant flash reads as broken, not fast).
- **Lumora Skin:** the droplet-to-crescent brand mark morphs (SVG morph, see §14) while real asset progress (fonts, critical CSS, and — only on the flagship PDP/hero route — the 3D model/textures) is tracked via Drei's `useProgress`. Progress drives the morph's completion percentage directly, so the animation is truthful, not decorative filler.
- **Exit:** the loader doesn't just disappear — it hands off into the page's own hero entrance (§18/§19) as one continuous motion (the mark's final position seeds the hero content's transform-origin), so there's no dead frame between "loading" and "loaded."
- **Critical-path discipline:** the loading animation itself is authored in Motion One and inlined, so it can run and render **before** the main React bundle hydrates — the loader is the LCP-safe placeholder, never a component waiting on the framework that will eventually replace it.
- **Heavy-asset gating:** on the Lumora hero/PDP, the 3D bundle and model assets load *behind* the loader; if they're not ready when the minimum floor elapses, the loader's final state holds (a graceful, branded "almost there" idle loop) rather than revealing a half-populated 3D scene.
- **Reduced motion:** loader becomes a static mark fade-in/out, no draw/morph animation, same minimum-floor logic.

---

## 3. Page Transition

- **Primary mechanism:** the browser's native **View Transitions API** where supported (same-document and, increasingly, cross-document), giving free, GPU-composited crossfades with zero JS animation cost; Framer Motion's `AnimatePresence` is the fallback path for browsers/routers where View Transitions isn't available, matched to the identical timing tokens so the experience is indistinguishable.
- **Standard transition (most routes):** exit current view 150ms fade, route swap, enter next view 250ms fade + 12px upward settle (`ease-luxury-out`) — deliberately subtle, per the Design System's rule that full curtain-wipe transitions are reserved for signature moments only.
- **Signature transition (Agency → flagship case study, and Lumora collection → PDP):** a shared-element transition — the case-study card's hero image or the product thumbnail morphs (position/size interpolated, via `layoutId`/View Transitions `view-transition-name`) directly into the destination page's hero image/3D canvas placeholder, so the click feels like *entering* the image rather than navigating to a new page.
- **Scroll-position handling:** Lenis's scroll position resets to top only *after* the exit animation completes, never mid-transition (prevents a jarring content-jump visible through the fade).
- **Loading-state overlap:** if the destination route needs data/assets beyond the transition's duration, the transition's final frame holds as a lightweight branded loading state (reusing the loader's idle motif from §2) rather than showing a blank frame.

---

## 4. Scroll Animation

Three distinct categories, each with a defined trigger model — a scroll animation is never improvised per-section without falling into one of these:

1. **Pinned narrative sequences** (hero sections, the Lumora flagship product story): the section pins for a defined scroll distance while a GSAP timeline scrubs — text, 3D camera position, lighting, and particle density all keyframed against the same 0–1 scroll-progress value. Used at most 1–2 times per page (these are expensive to build and expensive to watch too many of).
2. **Fire-once reveals** (standard content sections): a single IntersectionObserver-backed trigger fires the section's entrance once when ~20% enters the viewport; it does not re-trigger on scroll-back-up (re-triggering on every pass reads as gimmicky, not editorial).
3. **Continuous scroll-linked values** (parallax bands, header opacity/blur, progress indicators): a value directly mapped to scroll position with no "trigger" at all — updates every frame Lenis reports a scroll delta.
- **Sync mechanism:** Lenis is registered as ScrollTrigger's scroll proxy, so GSAP's scroll math and Lenis's smoothed position are always the same number — there is exactly one source of truth for "where the user is," never two competing scroll systems drifting apart.
- **Scroll-velocity-reactive flourish (used once, deliberately):** during the Lumora hero pinned sequence only, fast scroll velocity introduces a very subtle directional blur/skew (capped at 6° skew, capped blur radius) on the hero image layer — a recognizable Awwwards-era signature, deployed exactly once so it reads as craft, not a global tic.
- **Snap points:** used only for the handful of full-viewport "moment" sections (Lumora hero entrance); all standard content scrolls freely — snapping the entire site would fight the "editorial, unhurried" brand voice.

---

## 5. Parallax

- **Layered depth bands** on 2D compositions: background layer moves at 0.2× scroll speed, midground at 0.5×, foreground/focal content at 1× (true scroll speed), fixed UI chrome at 0× — implemented via `transform: translate3d` driven by Lenis's progress value (GPU-composited, never top/left).
- **True 3D parallax** inside the R3F canvas is preferred over faked 2D-layer parallax wherever a canvas is already present: the camera physically dollies through depth as scroll progresses, so background/midground/foreground separation comes from actual scene depth, not a CSS trick layered on flat images.
- **Intensity governance:** parallax offset is capped so no layer ever moves more than ~15% of the viewport height across a section's scroll range — enough to read as depth, never enough to cause layout-feeling seasickness.
- **Mobile:** parallax amplitude reduced by ~40% (smaller viewports make the same pixel-offset feel more extreme, and battery/thermal budget is tighter) — see §26 for the full tiering.
- **Device-motion/gyroscope parallax:** available only as an explicit opt-in micro-interaction on the Lumora product hero ("tilt to explore"), never enabled by default — respects both battery life and users who find device-motion effects disorienting.

---

## 6. Mouse Interaction

- **Proximity-aware UI:** interactive elements (buttons, cards, nav items) sample cursor distance on `pointermove` (throttled to animation-frame rate, not raw event rate) and respond within a defined radius — magnetic pull (§12), tilt response (below), or a sheen highlight, depending on element type.
- **Tilt-response cards** (used sparingly — Lumora product cards and the Agency's featured case-study tile only): card rotates a few degrees on X/Y based on pointer position relative to its center, via React Spring for the continuous chase-the-cursor feel; disabled the instant the pointer leaves, disabled entirely on touch/coarse-pointer devices.
- **3D scene reactivity:** the R3F hero object subtly leans toward the pointer (a couple of degrees max, React Spring damped), never so much that it feels like it's "watching" the user — an ambient response, not a puppet.
- **Drag interactions:** product-model 360° rotation (§23), cart-drawer swipe-to-dismiss, and gallery/lightbox swipe navigation all use the same gesture library convention (`@use-gesture/react`) paired with React Spring for release-momentum, so drag physics feel identical everywhere they appear.
- **Detection discipline:** every mouse-only interaction is gated behind a `(pointer: fine) and (hover: hover)` capability check, not a viewport-width breakpoint — a touch laptop or a mouse-equipped tablet gets the right behavior either way.

---

## 7. Camera Movement

- **Idle state:** an extremely slow autonomous drift/orbit (a multi-second breathing motion, sub-degree amplitude) — present so the hero never looks like a static render, restrained enough to never distract from content.
- **Scroll-driven state:** camera position and look-at target are keyframed against scroll progress via the GSAP pinned timeline (§4); the raw GSAP-driven target is then passed through a React Spring damper before being applied to the actual camera, so the camera *follows* the scroll-driven target with a slight organic lag/settle rather than snapping frame-to-frame with scroll — this is what separates "keyframed" from "alive."
- **Interaction-driven state:** hovering/focusing a product hotspot triggers a camera dolly-in to a framed close-up of that detail (ingredient callouts, material close-ups), then eases back to the previous framing on hover-out — always the same easing curve (`ease-luxury-out`) so every camera move in the experience feels like one deliberate cinematographer, not several different scripts.
- **Constraints:** orbit angles are clamped (no ability to flip under/behind the product into an unlit or geometry-clipping angle), field-of-view stays within a narrow band (no wide-angle distortion, which would break the "studio photography" material look from the Design System), and camera movement always uses damped easing — a hard linear or instant camera cut never appears anywhere in the experience.

---

## 8. Lighting

- **Base rig:** the three-point HDRI studio setup defined in the Design System (key/fill/rim via an environment map) is the baseline for every 3D scene — lighting is authored once per brand mood (day/porcelain vs. boutique-night) and swapped as a unit, never hand-tuned per scene.
- **Scroll-reactive lighting (hero sequence only):** key-light intensity and a subtte color-temperature shift move through the pinned hero timeline in step with the narrative (e.g., a cooler "dawn" opening warming toward the product's own gold accent as the sequence resolves) — a restrained, one-time lighting arc, not a literal repeating day/night cycle.
- **Interaction-reactive lighting:** hovering a hotspot adds a soft, brief emissive highlight on the relevant geometry (a glow pulse, ~400ms) rather than moving or adding a light source — cheaper, and reads as "this part is being called out" without disturbing the rest of the render.
- **Shadow strategy:** baked/approximated contact shadows (Drei `<ContactShadows>`) are the default everywhere — real-time shadow maps are reserved for the single hero/PDP object only, at capped resolution with PCF-soft filtering, and never for secondary or background geometry.

---

## 9. Particles

- **Lumora ambient field:** a fine mist/dust particle field drifting behind the hero product — GPU-instanced points with additive blending, position driven by a curl-noise function evaluated in the vertex shader (not per-particle JavaScript), so cost stays flat regardless of density.
- **Agency abstract field:** where the agency site uses any particle/metaball-adjacent background (sparingly, per Design System §22), it is monochrome, low-count, and slower-moving than Lumora's field — a quieter cousin of the same technique, never the same visual signature.
- **Density budget:** ~300–600 particles on desktop/high-tier devices, 0–100 (or fully disabled, replaced by a static gradient) on mid/low-tier mobile — tiered per the capability detection in §26, not a fixed global count.
- **Interaction response:** particles very subtly accelerate/scatter near the cursor within the hero canvas (a light attractor/repeller force in the noise field) — an ambient nicety, never load-bearing for any content or navigation.
- **Flash-safety:** no particle sparkle/twinkle behavior exceeds 3Hz per particle, and the field as a whole never produces a screen-wide flashing effect — a hard accessibility constraint, not a suggestion (§28).

---

## 10. 3D Objects

- **Pipeline:** models authored/optimized externally (Blender), exported as Draco-compressed glTF/GLB, texture-atlassed to minimize draw calls and material-switch overhead, with an LOD pair per hero-critical object (a high-detail mesh for close/PDP framing, a simplified mesh for any distant/background appearance).
- **Material budget per scene:** matte ceramic cap, brushed-metal accent, and tinted transmissive glass body — the expensive real-transmission material (`MeshTransmissionMaterial`) is used on exactly one object per view (the product itself), never repeated across a grid of thumbnails, which use flat/baked materials or plain photography instead (per Design System §24).
- **Streaming/placeholder:** every 3D object loads behind a `<Suspense>` boundary with a shaped placeholder (a soft blurred silhouette matching the object's real footprint) so the layout never pops/shifts when the model resolves.
- **Reuse discipline:** the same rigged product model is reused across hero, PDP viewer, and (at reduced LOD) any card/thumbnail context that opts into 3D at all — one authored asset per SKU, not a bespoke model per placement.

---

## 11. Depth

Depth is communicated through a **consistent, layered language** shared by 2D and 3D surfaces so the whole experience feels like one coherent space rather than flat UI stacked on top of a separate 3D diorama:

- **2D parallax layering** (§5) for background/midground/foreground separation on standard content.
- **True camera depth-of-field** (a restrained bokeh, subtle radius, applied only to background elements) inside the hero 3D canvas — never applied so heavily that product detail is obscured.
- **Atmospheric falloff** (fog/gradient fade) on the particle field and any distant background geometry, reinforcing that depth continues beyond the visible frame.
- **Contact shadows and the Design System's elevation-shadow scale** provide the DOM-layer depth cues (cards, modals, drawers) — tuned so a card's `elevation-3` shadow reads as "the same distance" as a comparable depth cue in the 3D scene, keeping DOM and canvas depth perceptually unified.
- **Z-index discipline:** a single documented stacking order (canvas background → page content → sticky nav/glass surfaces → drawers → modals → toasts → custom cursor) is enforced site-wide — no ad hoc z-index values.

---

## 12. Hover Effects

- **DOM content hover** (cards, links, images): per the Design System — underline draw, 1.04× image scale, card lift via `elevation` step-up — always `transform`/`opacity`/`box-shadow` only, 150–250ms `ease-standard`/`ease-luxury-out`.
- **Glass-surface hover:** a cursor-position-driven soft light sheen sweeps across frosted-glass surfaces (nav on scroll, viewer control overlay) on hover, implemented as a CSS custom property (`--pointer-x/y`) updated via Motion One (not React state) so it never triggers a component re-render at pointer-move frequency.
- **3D hotspot hover:** raycast hit-testing on pointer move highlights the nearest interactive hotspot on the product with a brief emissive pulse (§8) and a matched camera micro-dolly (§7); leaving the hotspot reverses both in the same duration.
- **Consistency rule:** any hover effect that exists on desktop has a defined touch equivalent (usually: reveal on tap, or simply present-by-default) — hover is never the *only* way to discover an interactive affordance (§26/§28).

---

## 13. Magnetic Buttons

- **Trigger radius:** ~80–120px around the button's bounding box (tuned per button size — larger primary CTAs get a slightly larger radius).
- **Response model:** the button's visual shell translates toward the cursor, capped at a max offset of roughly 8–12px (a "pull," never a "chase" — the button should feel anchored, just magnetically aware) — modeled with the "Heavy Magnetic" React Spring preset (§24) for a weighted, confident feel rather than a bouncy toy-like snap.
- **Internal parallax:** the label/icon inside the button shell can move at a slightly different rate than the shell itself (a couple of px of differential), adding a subtle dimensional quality without turning the button into a compound animation.
- **Release behavior:** on cursor exit, the button eases back to rest using the same spring preset in reverse — never a hard snap-back.
- **Touch equivalent:** magnetic pull is entirely absent on touch (no cursor to react to); touch gets the standard press-scale (0.98, 80ms) feedback defined in the Design System instead.

---

## 14. Animated Typography

- **Hero headline entrance:** each line reveals via a mask (the line clips upward into view from behind an invisible boundary, not a fade), staggered ~80ms per line, combined with the variable font's optical-size axis animating subtly as the line settles (available specifically because Fraunces/Cormorant Garamond are variable fonts) — a restrained kinetic-type flourish reserved for hero/section headlines only.
- **Hover/interactive type:** nav links and text-buttons get the underline-draw treatment (§12 of the Design System); standalone headline text never animates on hover — kinetic type is an entrance behavior, not a hover gimmick.
- **Body copy:** never splits into words/characters for animation — a single group fade-up on first viewport entry is the only motion body text ever receives, protecting readability and screen-reader/selection behavior.
- **Numeral treatment:** all animated numerals (stats, prices, counters) use `font-feature-settings: "tnum"` (tabular figures) so digit changes never cause the surrounding layout to jitter as digit widths change.

---

## 15. SVG Morphing

**Use cases, each deliberately scoped:**
1. Loading mark (droplet ↔ crescent for Lumora; monogram stroke-draw for Agency) — §2.
2. Icon state changes: accordion plus↔minus, hamburger↔close, play↔pause — always same-point-count paths for a clean morph, ~200ms.
3. A single decorative botanical illustration morph as a Lumora journal-content scroll accent (one illustration morphing into a related one as the reader passes a section boundary) — used at most once per article, never as a repeating pattern.

- **Technique:** morphing is done via point-matched path interpolation, driven by a GSAP or Framer Motion tween value rather than literal frame-by-frame path swapping — if the team licenses GSAP's commercial MorphSVG plugin, it becomes the production path for anything beyond simple point-matched morphs (arbitrary path-to-path); the open-source fallback (a `flubber`-interpolated path driven by the same tween) covers the icon-state and loader cases without requiring the paid plugin.
- **Performance discipline:** SVG path morphing is main-thread/CPU work — morph targets are kept under roughly 100 points, and morphing is never tied continuously to scroll position (that workload belongs to GSAP timelines animating `transform`/`opacity` on the SVG as a whole, not to re-computing its path data every frame).

---

## 16. Glass Distortion

- **Functional glass** (nav, modals, drawers, viewer control overlay): flat `backdrop-filter: blur() saturate()` per the Design System's glassmorphism rules — cheap, static, purely legibility-serving.
- **Signature glass distortion** is reserved for exactly one place: the Lumora product's actual glass material in the 3D scene, rendered with real transmission/refraction (Three.js `MeshTransmissionMaterial` via Drei) so the "glass" the user sees is physically real, not a 2D UI trend applied decoratively elsewhere. This is a deliberate restraint decision — the technique gets one job, and it's the most credible one available.
- **Optional refraction/chromatic-aberration post-process:** an extremely subtle screen-space distortion pass may be layered over the hero canvas only (never over DOM content), intensity low enough to read as "premium glass rendering" rather than a psychedelic effect, and it is the first thing disabled under the mobile/performance tiering in §26 and entirely disabled under reduced-motion.

---

## 17. Cursor Effects

- **Agency cursor:** a small solid dot with light spring lag behind the pointer; enlarges and inverts color (paper↔ink swap) over interactive elements; adds a text label ("View", "Drag") over specific contexts (case-study cards, the 3D object) via a crossfading small label chip attached to the cursor.
- **Lumora cursor:** a softer, thinner ring (less "techy," more boutique-fitting-room), same lag/enlarge behavior but no color-inversion trick — a quieter cousin consistent with the brand's warmer voice.
- **State machine:** `default → hover-link (enlarge + invert/tint) → hover-drag (adds "Drag" label, shown over the 3D product) → hover-view (adds "View" label, shown over case-study/product cards) → hidden (over native text inputs and any native form control, where the OS cursor must take over for correct text-editing affordances)`.
- **Performance implementation:** position updates via `requestAnimationFrame`-throttled direct style mutation (`translate3d`) on a ref, or Motion One's `animate`/`timeline` — **never** via React `setState`, since pointer events can fire at 60–120Hz and a re-render per event would blow the frame budget immediately.
- **Availability:** desktop, fine-pointer, hover-capable devices only; entirely absent on touch (native cursor semantics don't apply) and disabled under reduced-motion (replaced by the browser's default cursor, with all "what's clickable" information still conveyed visually by the hover states in §12 alone).

---

## 18. Background Effects

- **Agency:** a very low-opacity animated film-grain/noise texture (a small shader or a seamless tiling noise texture animated at a slow, almost imperceptible rate) sits behind hero sections for material tactility without literal imagery; paired, where a hero warrants it, with the abstract monochrome metaball/gradient-mesh field from the Design System's 3D style guide.
- **Lumora:** a soft gradient light-wash tinted to the current collection's color story, plus the ambient particle mist (§9) — background effects here support the product photography rather than compete with it, so opacity/contrast is kept low enough that a product silhouette always reads clearly against it.
- **Implementation discipline:** background effects are CSS/canvas-2D where the visual can be achieved cheaply; WebGL/shader-based background effects are only used where a canvas is *already* mounted for other reasons (the hero 3D scene) — the site never spins up a second, purely decorative WebGL context just for a background effect.

---

## 19. Image Reveal

- **First-appearance reveal:** a one-time clip-path wipe (direction alternates left↔right or bottom↔top by section, for editorial rhythm) combined with a subtle counter-scale under the mask (image starts at 1.08×, settles to 1.0× as the mask opens) so the reveal reads as "an aperture opening onto the image," not a curtain sliding away — 800–1000ms, `ease-luxury-out`, fires once via IntersectionObserver, never re-triggers on scroll-back.
- **Gallery/lightbox reveal:** the destination lightbox image scales up from the exact position/size of its originating grid thumbnail (a shared-element/`layoutId` transition), so opening a gallery item feels continuous with the click rather than a fresh overlay appearing.
- **Product-color/variant swap:** handled as a cross-fade between two pre-rendered/textured states, never a hard cut — consistent with the "nothing snaps" rule running through this whole document.

---

## 20. Text Reveal

- Governed entirely by §14 (Animated Typography) for headline-level type, and by the "single group fade-up, fires once" rule for everything else (body copy, captions, list items revealed as a staggered group at 60–80ms per item, capped at 6–8 staggered items before the rest of a long list simply appears as one group).
- **Pull-quotes/testimonials** (serif, larger scale) get the same line-mask reveal as headlines when they appear as a standalone moment (e.g., a testimonial section), since they're functioning as display type in that context.
- **Reduced-motion equivalent:** every text reveal collapses to an instant, fully-visible appearance — text content is never hidden behind a motion trigger that could fail to fire.

---

## 21. Animated Statistics

- Used in case-study results blocks and any KPI-style callout ("+340% conversion," "12-week launch").
- **Count-up on first viewport entry**, eased (never linear) via `ease-standard`, driving a numeric `MotionValue`/animated value (Motion One or Framer Motion) that formats to the target string at render time (commas, currency symbols, unit suffixes are applied to the live formatted value, never animated as separate text).
- **Duration scales gently with magnitude** (a bigger number counts a little longer) but is capped around 1.6s so no stat animation ever feels like a wait.
- **Tabular numerals** (§14) prevent digit-width layout jitter mid-count.
- **Reduced motion:** the counter snaps directly to its final value — the information is never gated behind an animation the user has opted out of.

---

## 22. Smooth Scrolling

- **Lenis is the single scroll authority** for the Agency site and the Lumora public experience — native scroll is normalized underneath it, and it is the sole source of the scroll-progress value that GSAP ScrollTrigger and the R3F scroll-linked camera/particle systems consume (§4).
- **Feel tuning per brand:** Agency uses a slightly longer lerp (glide-forward, unhurried editorial feel); Lumora uses a marginally shorter lerp (a touch more responsive — commerce contexts like filtering a collection or scanning an ingredient list benefit from feeling precise rather than floaty). Both stay within a range that never feels like scroll "lag" — smoothing supports the wheel input, it doesn't fight it.
- **Touch scroll is left close to native.** Lenis's role on touch devices is primarily to supply the same normalized progress value to GSAP/R3F, not to heavily re-interpret touch momentum — users' built-in expectation of native touch-scroll physics is respected.
- **Scoped exclusions:** Lenis is explicitly bypassed inside modals, the mobile full-screen nav overlay, admin data tables, and any other nested scroll container — global smooth-scroll hijacking is a page-level technique, never applied to a scrollable panel inside the page.
- **Reduced motion / accessibility:** the Lenis instance is not initialized at all when `prefers-reduced-motion: reduce` is set — native browser scroll takes over entirely, and every scroll-progress consumer (GSAP, R3F) is written to degrade gracefully to their reduced-motion fallback in that case (§4/§28).

---

## 23. Interactive Product Models

The centerpiece capability of the entire build — the `ProductViewer` scene, present on the Lumora hero and every PDP.

- **State machine:**
  - **Idle** — slow autonomous orbit (§7), waiting for engagement.
  - **Scroll-intro** — on page entry, a GSAP-scrubbed rotation/zoom introduces the product as part of the pinned hero sequence, then *hands off* cleanly into:
  - **Engaged** — the user has control: drag-to-orbit (`@use-gesture` for the gesture, React Spring for rotation value + release-momentum/inertia with natural decay, not an abrupt stop).
  - **Focused** — hovering/tapping a hotspot dollies the camera to a framed close-up of that ingredient/material detail (§7/§8), with an HTML-in-3D label (Drei `<Html>`) fading in only once the camera is within the defined angle/distance range for that hotspot — never floating disconnected from the geometry it describes.
  - **Variant swap** — switching size/color cross-fades material/texture rather than swapping the mesh outright, keeping the object feeling like one continuous product.
- **Hotspot content:** ingredient callouts, material/finish notes, and (on PDP) an "add to bag" affordance can all anchor to a hotspot — the 3D viewer is a real product-exploration surface, not a spinning showpiece disconnected from the commerce flow.
- **Handoff to 2D:** any place the product appears smaller/secondary (search results, cart line items, order history) uses a pre-rendered image of the same model, not a live mini-canvas — live 3D is reserved for the moments that justify its cost.

---

## 24. Physics

"Physics" in this system means **spring/damping feel**, not simulation — there is no rigid-body/collision engine (no Rapier/Cannon) anywhere in v1, and that's a deliberate scope boundary, not an oversight: bouncing, tumbling, or colliding product gimmicks would contradict the brand's restraint principle. Physics is used specifically wherever motion needs to continuously respond to something in motion (a cursor, a drag, a live value) rather than play a fixed timeline.

**Shared spring presets** (React Spring configs, reused everywhere a spring is called for so the whole product feels like one physical world):

```
"Snappy UI"       stiffness ~300, damping ~30, mass 1   — toggle/switch thumbs, small state flips
"Organic Camera"  stiffness ~120, damping ~24, mass 1.2 — camera follow-damping (§7)
"Heavy Magnetic"  stiffness ~220, damping ~26, mass 1   — magnetic buttons (§13), tilt cards (§6)
"Loose Drag-Inertia" stiffness ~90, damping ~18, mass 1.5, with velocity-seeded release — product drag-rotate (§23), swipe-dismiss drawers
```

- **Where physics is explicitly not used:** page transitions, text/image reveals, loading sequences, statistic count-ups — all of these are fixed-duration, eased timelines (GSAP/Framer Motion/Motion One), because they have a clear start and end and don't need to chase a moving input.

---

## 25. GPU Optimization

- **Single shared canvas:** exactly one `<Canvas>` (R3F) is mounted per route context, at the layout root of the Lumora experience — never multiple stacked WebGL contexts, which is one of the most common (and expensive) mistakes in ambitious 3D sites.
- **Draw-call budget:** target under 100 draw calls for the hero scene, achieved via texture atlasing, geometry instancing (particles, any repeated element), and merging static geometry that never needs independent transforms.
- **Shader/material budget:** at most one expensive material (real transmission) active per view; the post-processing stack is capped (bloom + a single color-grade LUT pass as the ceiling — never bloom + SSAO + DOF + motion-blur simultaneously except on confirmed high-tier hardware, see §26).
- **Resolution discipline:** `devicePixelRatio` capped at 2 regardless of device reporting higher; an adaptive-resolution system monitors rolling average frame time and drops internal render scale (e.g., to 0.75×) under sustained frame-budget pressure, scaling back up once the budget recovers.
- **Texture budget:** compressed GPU texture formats (KTX2/Basis) for all 3D textures; max 2048px source textures on desktop hero, 1024px on mobile tiers.
- **Off-main-thread work:** Draco/KTX2 decode via the loaders' built-in worker support; any per-frame procedural computation (the particle noise field) lives in the vertex/fragment shader, never in a per-particle JavaScript loop.
- **Animation-loop discipline (applies beyond just 3D):** any value updating every frame (scroll progress, cursor position, camera follow) is driven through refs and `requestAnimationFrame`/the R3F render loop — never through React `setState`, which would force a re-render cycle at 60fps and is the single most common cause of a "beautiful but janky" build.

---

## 26. Fallbacks for Mobile

**Capability detection, not viewport width, decides the tier** (a checked heuristic combining WebGL2 support, a known-weak-GPU denylist, `navigator.hardwareConcurrency`/`deviceMemory` where available, connection `effectiveType`, and the OS-level reduced-motion flag):

| Tier | Profile | Experience |
|---|---|---|
| **Tier 1** | Modern desktop, high-tier mobile (recent flagship phones) | Full experience: real transmission glass, full particle density, DOF/bloom stack, all scroll-scrubbed 3D and GSAP timelines |
| **Tier 2** | Mid-range mobile/tablet | Simplified materials (baked translucency swapped in for real transmission), reduced particle count (~1/4), DOF and bloom disabled, pixel ratio capped at 1.5, scroll-scrubbed 3D retained but simplified |
| **Tier 3** | Low-end/old devices, data-saver mode, or `prefers-reduced-motion` | The 3D hero is replaced entirely by a high-quality pre-rendered looping video or a static hero image with CSS-only parallax; all scroll-scrubbed sequences degrade to simple fade/slide reveals; particles/glass-distortion/cursor-effects are fully disabled |

- **Progressive engagement gate (mobile-specific):** on phones, the full 3D experience does not autoplay on page load — it sits behind a lightweight "Explore in 3D" tap affordance, with a static hero image/video serving as the true first paint. This protects mobile LCP/TBT by design: the heaviest bundle only downloads on explicit intent, not on every mobile pageview.
- **Interaction remaps for touch:** magnetic cursor → removed entirely; hover-only reveals → tap-to-reveal or always-visible; drag-to-rotate product → identical gesture, re-tuned sensitivity/inertia for touch input.
- **Network-aware asset strategy:** on `effectiveType` of `2g`/`3g` or Data Saver, 3D assets are not prefetched speculatively; the Tier 3 static/video fallback is served regardless of device GPU capability.

---

## 27. Performance Strategy

Every Core Web Vital is treated as a design constraint with a specific, named mitigation — not a hope:

- **LCP:** the LCP candidate on every route is a static image or text block that paints immediately — the 3D canvas is dynamically imported (`next/dynamic`, `ssr:false`) and layered in *after* first paint, behind a poster-image placeholder that occupies the same space so nothing shifts when the canvas mounts.
- **INP/TBT:** heavy libraries are code-split per route (the 3D/GSAP-ScrollTrigger/React-Spring bundle ships only on Lumora routes that use it; the Agency's blog post about typography never downloads a WebGL bundle); all high-frequency animation runs off the React render cycle (§25) so the main thread stays free for actual input handling.
- **CLS:** every animated entrance reserves its final layout space from first render (reveals animate opacity/transform of already-sized boxes, never height/width); fonts load via `next/font` with size-adjusted metric overrides so a web-font swap never reflows the page.
- **Frame budget:** the working rule for *every* animated interaction is that its JS must complete in under ~4ms per frame, leaving headroom inside the 16.6ms frame for the browser's own paint/composite work — profiled with a real device-performance trace before any motion-heavy feature is considered shippable, not assumed from a desktop dev machine.
- **Enforcement:** Lighthouse CI (per the Architecture Document's CI/CD pipeline) gates every PR against the ≥95 target on both mobile and desktop presets; Vercel Speed Insights provides the real-user Core Web Vitals scoreboard in production, so the target is monitored continuously, not just checked once at launch.

---

## 28. Accessibility Considerations

Motion accessibility is specified per-effect, not as a single blanket "respects reduced motion" checkbox — the table below is the actual audit checklist:

| Effect category | Reduced-motion / accessible fallback |
|---|---|
| Loading animation | Static mark fade, no draw/morph |
| Page transitions | Simple opacity crossfade only, no shared-element/curtain motion |
| Scroll-scrubbed 3D / pinned sequences | Static poster frame, normal (non-pinned) scroll, all content still reachable in document order |
| Parallax | Fully disabled — all layers render at their natural, non-offset position |
| Magnetic buttons / cursor effects | Disabled entirely; native cursor and standard press-feedback take over |
| Particles / ambient background motion | Disabled or swapped for a static equivalent image/gradient |
| Image/text reveal | Instant, fully-visible appearance — no clip-path/mask/stagger |
| Animated statistics | Snap directly to final value |
| Camera movement (hover/hotspot dolly) | Replaced with an instant framing change |

- **Keyboard/focus parity:** every pointer-driven interaction in this document (magnetic buttons, 3D drag-rotate, hotspot hover, tilt cards) has a defined keyboard/focus equivalent — focusing an element triggers the same visual state hovering it would, and the 3D viewer specifically ships arrow-key rotate and +/− zoom as a first-class alternative to drag/scroll gestures, not an afterthought.
- **Vestibular safety limits (hard caps, not guidelines):** parallax offset ≤ 15% of viewport height per section; camera orbit/dolly amplitude clamped to defined safe angles; scroll-velocity skew capped at 6°; no flashing content exceeds 3Hz anywhere in the particle/lighting system. Any effect that can't be brought under these caps in its "full" form gets a genuinely different (not just dimmer) reduced-motion alternative — an on/off switch for the riskiest effects, never a half-measure.
- **Screen-reader coexistence:** the WebGL canvas and all decorative motion layers are `aria-hidden`; every piece of information the 3D/motion layer conveys visually (product name, description, price, ingredient details, add-to-cart action) also exists as real, accessible DOM content in logical reading order — the experience is fully usable, in full, with a screen reader and zero WebGL rendering.
- **User-controllable ambient motion:** any continuously looping motion running longer than ~5 seconds unprompted (idle camera orbit, particle drift) has a reachable pause affordance in the UI, independent of the OS-level reduced-motion setting, in line with WCAG 2.2.2 (pause, stop, hide).

---

## Appendix A — Target Scorecard

| Target | How this blueprint secures it |
|---|---|
| 60fps sustained | GPU-only animated properties (transform/opacity), single shared canvas, draw-call/shader/particle budgets (§25), adaptive resolution scaling, animation logic kept off React's render cycle |
| Lighthouse ≥ 95 (mobile + desktop) | LCP-safe static placeholders ahead of all canvas/motion content, per-route code-splitting of every heavy library, mobile progressive-engagement gating (§26), CLS-safe reveal patterns (§27), enforced continuously via Lighthouse CI |
| Awwwards-level craft | One signature moment per surface (hero entrance, product reveal, flagship transition) built with full technical ambition, everywhere else governed by restraint and one shared, reused vocabulary of reveals/easings/springs (§0, §24) |
| Full accessibility compliance | A named reduced-motion fallback for every single effect in this document (§28), keyboard parity for every pointer interaction, hard vestibular-safety caps, and complete screen-reader-usable content independent of the motion/3D layer |
