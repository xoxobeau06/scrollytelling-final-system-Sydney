# Final Turn-In Specification

This is the final completion contract for Project 2.

## 1) Required Submission Links

Students must submit:

- [X] Live GitHub Pages URL
- [X] Public GitHub repository URL

Recommended:

- [X] Portfolio page URL that links to this project

The README (in the repo) contains your project documentation and reflection; graders read it there.

Issue tracking must also be complete before final turn-in:

- [X] All required Project 2 sub-issues are closed
- [X] `Project 2 Master Checklist` is up to date and fully checked off

## 2) Core Build Requirements

### Story + Structure

- [X] 6-8 total sections
- [X] At least 5 JavaScript concepts represented
- [X] Complete written narrative

### ScrollTrigger

Reference:
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

- [X] 8+ total ScrollTrigger instances
- [X] 5+ trigger-and-play reveals
- [X] 2+ scrubbed interactions
- [X] 1+ pinned showpiece section
- [X] Pinned showpiece includes 3+ internal animation steps

### ScrollSmoother

Reference:
- [ScrollSmoother Docs](https://gsap.com/docs/v3/Plugins/ScrollSmoother/)

- [X] One global ScrollSmoother setup with wrapper/content structure
- [X] Smooth value tuned for readability
- [X] 2+ smoother-enhanced moments
- [X] Disabled or bypassed for reduced-motion users

If ScrollSmoother is unavailable:
- [X] Instructor-approved alternative scroll-feel implementation

### GSAP Motion

References:
- [GSAP Core Docs](https://gsap.com/docs/v3/GSAP/)
- [GSAP Timeline Docs](https://gsap.com/docs/v3/GSAP/Timeline/)

- [X] 10+ intentional GSAP tweens
- [X] 2+ GSAP timelines
- [X] 2+ distinct easing choices used intentionally
- [X] Majority of motion uses performant properties (`transform`, `opacity`)

### Design System + Theme

- [X] `tokens.css` exists and is used consistently
- [X] Light mode implemented
- [X] Dark mode implemented
- [X] System mode implemented (`prefers-color-scheme`)
- [X] Mode preference persists (for example with `localStorage`)

### Visual Assets

- [X] 5+ SVG assets (custom or intentionally adapted), unless instructor-approved exception
- [X] 3+ image/illustration assets supporting the narrative
- [X] Images are optimized for web
- [X] Non-decorative images use meaningful alt text

## 3) Accessibility + Quality

- [X] `prefers-reduced-motion` support is fully implemented
- [x] All content remains readable with motion disabled
- [X] Keyboard navigation works across the full experience
- [X] Semantic headings and landmarks are present
- [X] Color contrast meets WCAG AA for body text
- [X] No blocking console errors
- [X] No `markers: true` in production

## 4) Testing Requirements

- [X] Tested at one desktop width and one mobile width
- [X] Tested in at least two browsers (Chrome + one other)
- [X] Deployed build matches local final version
- [X] No broken links or missing assets

## 4b) Issue Tracking Requirements

- [X] All required Project 2 sub-issues are closed
- [X] `Project 2 Master Checklist` reflects the final state of the project
- [X] Final issue evidence is present where needed

## 5) README (Project Documentation + Reflection)

Your repo must include a **README.md** that serves as both project documentation and reflection. A separate reflection page (e.g. `reflection.html`) is optional; the required reflection content must live in the README.

README.md must include:

- [X] **Project title** (as H1)
- [X] **Optional:** Video Demo URL (if you created a walkthrough video)
- [X] **Description:** Multiple paragraphs that explain what the project is and how it works, what the main files contain and do (e.g. `index.html`, `styles/`, `scripts/main.js`, tokens, motion approach), and key design choices and why you made them. Aim for at least several hundred words; in the neighborhood of 750 words is a good target.
- [X] **Links:** Live site URL, repo URL (and optional portfolio link)
- [X] **Tech stack:** HTML, CSS, JS, GSAP, ScrollTrigger, ScrollSmoother (or equivalents)
- [X] **Reflection (in the README):**
  - [X] Metaphor summary (1 paragraph)
  - [X] One section you're most proud of, and why
  - [X] One technical bug you solved, and how
  - [X] One accessibility decision you made
  - [X] What you would improve with more time

AI is allowed for drafting, but the final README and code explanations must reflect your own understanding.

**Optional template** — you may use this structure as a starting point:

```markdown
# YOUR PROJECT TITLE
#### Video Demo:  <optional URL>
#### Description:
[Multiple paragraphs: what the project is, what key files do, design choices. Aim for ~750 words or at least several hundred.]

#### Links
- Live site:
- Repo:

#### Tech stack
HTML, CSS, JavaScript, GSAP, ScrollTrigger, ScrollSmoother

#### Reflection
- **Metaphor summary:**
- **One section I'm most proud of:**
- **One technical bug I solved:**
- **One accessibility decision:**
- **What I'd improve with more time:**
```
