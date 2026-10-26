# kennedyai.us — tasteskill v2 review (round 1, before)

ROUND 1 (before)
Seen in one second: a small yellow "KENNEDYAI" and a white name, on black. Nothing else.
Idea (one sentence): none beyond the category — a name, a role line and a card per app; the
  "cover the logo" test passes for any Flutter freelancer in Atlanta.
Live thing: the 3D family tree canvas (select a family member). It belongs to a side product,
  not to this subject, and it is four screens down.
Layout words by section: hero=left band in a void / jump=centred pill / products=stacked slab
  ×3 / in progress=horizontal card row / tree=full-bleed canvas / footer=list
Scores: design 5 · usability 6 · creativity 5 · content 6 → overall 5.4
Caps applied: fewer than four real pictures (3 image files + 1 canvas) → design ≤6.5;
  pass 3 fails (page could belong to anyone) → creativity ≤6;
  inspector did not complete (the WebGL section stalls headless screenshot capture), so no
  inspector FAIL/WARN pass is claimed and nothing is scored up for one.

Top three problems (most visible first):

1. The hero is a wide, short band in the middle of an empty screen. desktop-fold: the content
   card is roughly 4.5:1, sits centred, leaves ~300px of black above and below, and its right
   two thirds are empty. h1 is 72px, one line, at x=96. Fix: make the first screen one decided
   thing — either full-bleed evidence (three real product screens, cropped large) with the name
   set over a scrim, or the name at 140px+ in the left half and a product still filling the right
   half. No third option.

2. The products section is the same card three times in a row, and the card shows a logo tile
   instead of the product. desk-1/desk-2: identical geometry (label, 56px title, two lines of
   grey copy, right-hand 224px icon, hairline action bar), so the second and third cards read as
   filler. The 224×224 tiles are app icons (arcwriter.png is 803×593 artwork; jokebook and
   bookedmic are 512²), which is branding, not proof. Fix: one composition per product — a large
   real UI crop for one, a typographic still for another, the store badges alone for the third —
   and let each card be a different shape.

3. There is no navigation and the In Progress row runs off the page. navLinks = 0; the eight
   links on the page are the jump pill, three action bars, four CTA links and the footer, so the
   resume PDF and the /freelancing page are reachable only by scrolling to the footer. The row
   itself is `overflow-x-auto` with `min-w-[450px]` cards, so the third card's pitch text is
   clipped at the frame (rightmost painted element ends at x=1631 on a 1440 viewport). Fix: a
   plain top bar — wordmark, Work, Freelancing, Resume — and let the three In Progress cards wrap
   into the grid instead of a hidden horizontal scroller.

Measured, not argued:
- Typefaces: Bricolage Grotesque + Space Mono; Space Mono on 20 (desktop) / 22 (phone) labelled
  elements — mono labels are house-rule banned outside code.
- Eight sizes on a phone (9, 10, 12, 14, 16, 20, 30, 36); the "five sizes" ceiling is exceeded.
  9px and 10px uppercase tracked labels: 3 and 6 on desktop, 3 and 17 on a phone.
- Six distinct left edges for text blocks (16, 41, 83, 96, 549, 1015); a composed page reuses two
  or three.
- Two headings for equivalent sections at different sizes (h2 96px "PRODUCTS I'VE BUILT", h2 72px
  "IN PROGRESS"), and the tree section's h2 is 14px, so that section effectively has no heading.
- backdrop-blur panels: 4 desktop / 5 phone (glass). Gradient fills: 2 computed elements plus the
  hero's animated gradient. Shadows at rest: 6 (shadow-2xl slabs, drop-shadow icons).
- Running text in grey: 13–14 blocks. Body copy sits at text-gray-400/#9ca3af and the pitch lines
  at text-gray-500.
- Images: 3, all icons. No photographs, no product screenshots, no footage.
- lint.mjs on the homepage's own components: 26 FAIL / 15 WARN (gradient, mono, hairline,
  shadow, micro-label, default font); the whole src tree is 280 FAIL / 175 WARN.
- Page title is "🐴 KennedyAI — Solutions" — the emoji ships in the tab and in every link preview.

What to keep: the yellow-on-near-black palette (accent used on the action, mostly), Bricolage at
96px, the full-width store action bars (honest and tactile), and the 3D tree canvas — it is the
one thing here a competitor does not have.
