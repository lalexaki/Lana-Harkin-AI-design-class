# Cosmic Daydreamer — Week 2 playable draft

A cozy 3D exploration game by Lana Harkin, developed with AI assistance. Built as a standalone static page for the existing GitHub Pages portfolio. The Week 1 proposal is unchanged.

## Play

Open `index.html` through a local HTTP server or visit:
https://lalexaki.github.io/Lana-Harkin-AI-design-class/cosmic-daydreamer-game/

WASD / arrows / the on-screen direction pad move Nova. Click the ground to walk; select a dream label to approach and reveal it. Interact again to collect its fragment. E explores the nearest available dream. Collect one fragment in chapter 1, two in chapter 2, then the dancing star and the dream garden’s hidden star in chapter 3. Chapters advance only when Continue is selected. Pause includes sound, guidance, reduced motion, and restart. No death, countdown, or lost fragments.

The fixed-camera world and original models are generated with locally vendored Three.js 0.170.0 (MIT). Optional audio is synthesized with Web Audio and unlocked by a player gesture. No remote assets or accounts are needed to play. WebGL2 is required.

## Actual development checks — November 8, 2026

- `node state.test.mjs` passed: opening, chapter gating, reveal before collect, no duplicate collection, pause/resume, both chapter transitions, realm transitions, five-fragment ending, free wandering, re-entering the dream garden after winning, and repeated full reset.
- JavaScript syntax checks passed. Local HTML links and fragment targets were checked.
- In the browser preview, the opening and 3D world rendered without console errors. The cloud reveal/collection and first chapter transition worked. The running preview reached the 5/5 ending and free wandering. Restart from pause returned to the opening and 0/5.
- At a 390 × 844 browser viewport, document and game width were 390 pixels, with no horizontal overflow. The on-screen movement buttons were subsequently enlarged to 44 pixels. This is a browser viewport check, not a physical phone test.
- Initial visual review led to less intense lighting, a deeper sky palette, and a luminous branching dream tree. Final checks fixed the moon door after victory and cleared old surprise announcements on restart.

## Scope and next steps

First draft: one compact island, one dream garden, three chapters, five unique fragments. No saved progress between visits. Camera framing, landscape detail, audio balance, physical-device performance, and clarity of reveal/collect need peer playtesting. No peer feedback is invented here.

`process.html` documents the brief, event rules, state flow, changes, credits, and future questions. Development reviewed all eight professor lesson descriptions, example prompts, and sampled subtitled video frames. Course videos and the access password are not included in the published files.

Concept and creative direction: Lana Harkin. AI assistance: code, procedural models, synthesized sound, editing, and checks. Supplied visual references informed atmosphere and palette and are not embedded game assets.
