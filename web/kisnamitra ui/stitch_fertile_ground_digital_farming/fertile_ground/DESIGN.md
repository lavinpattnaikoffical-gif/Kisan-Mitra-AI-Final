# Design System Document: The Tactile Landscape

## 1. Overview & Creative North Star

### Creative North Star: "The Living Archive"
This design system rejects the clinical coldness of modern SaaS in favor of a "Living Archive"—an editorial-first experience that feels as grounded as physical clay and as vibrant as a forest canopy. We move away from rigid, boxed-in templates toward a layout that breathes, using intentional asymmetry and tonal depth to guide the eye.

The goal is to create a digital environment that feels high-end and curated. By leveraging high-contrast typography and earthy, organic tones, we ensure absolute legibility even under the harsh glare of direct sunlight, bridging the gap between the natural world and the digital screen.

---

## 2. Color Philosophy

Our palette is derived from the earth. It is functional, high-contrast (WCAG AAA), and intentionally warm to reduce eye strain and improve outdoor visibility.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background provides all the definition needed. If you feel the urge to draw a line, use white space instead.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine, heavy-weight paper.
- **Surface (Base):** `#fbf9f4` (Warm Bone). The canvas.
- **Surface-Container-Low:** Use for subtle grouping of secondary information.
- **Surface-Container-Highest:** Use for high-priority interactive elements.
- **The "Glass & Gradient" Rule:** To escape the "flat" look, use subtle gradients for CTAs (e.g., transitioning from `primary` #88452d to `primary-container` #a65d43). This adds "soul" and a tactile, pressed-clay feel to the interface.

---

## 3. Typography

The typography strategy is a dialogue between the authoritative weight of a serif and the hyper-legible precision of a modern sans-serif.

- **Display & Headlines (Merriweather/Noto Serif):** These are our "Editorial Moments." Use high-contrast scales to create a sense of hierarchy. The serif reflects the tradition of the "Archive."
- **Body & Labels (Inter):** Chosen for its exceptional X-height and legibility. In direct sunlight, Inter’s clean apertures ensure that text remains crisp and readable.
- **Hierarchy as Identity:** Use `display-lg` (3.5rem) sparingly to create focal points. Large, asymmetrical headings that overlap different surface containers create a bespoke, non-templated aesthetic.

---

## 4. Elevation & Depth

We achieve depth through **Tonal Layering** rather than traditional structural shadows.

- **The Layering Principle:** Depth is "stacked." Place a `surface-container-lowest` card (#ffffff) on top of a `surface-container-low` (#f5f3ee) background to create a soft, natural lift.
- **Ambient Shadows:** When an element must float (e.g., a modal), use extra-diffused shadows.
    - **Blur:** 24px - 48px.
    - **Opacity:** 4% - 8%.
    - **Color:** Must be a tinted version of `on-surface` (#1b1c19), never pure black/grey.
- **The "Ghost Border" Fallback:** If a container requires a border for accessibility, use the `outline-variant` token at **15% opacity**. 100% opaque borders are forbidden.
- **Glassmorphism:** For floating navigation or overlays, use semi-transparent `surface` colors with a `backdrop-blur` (12px-20px). This allows the "earth" below to bleed through, softening the UI’s footprint.

---

## 5. Components

### Buttons
- **Primary:** A gradient from `primary` (#88452d) to `primary-container` (#a65d43). Roundedness: `DEFAULT` (0.5rem). High-contrast `on-primary` text for outdoor visibility.
- **Tertiary:** No background. Use `primary` text weight `600`.

### Cards & Lists
- **The "No-Divider" Rule:** Forbid the use of divider lines. Separate list items using `8pt grid` spacing or subtle background shifts between `surface-container-low` and `surface-container-lowest`.
- **Card Styling:** Use `xl` (1.5rem) or `lg` (1rem) corner radius for a softer, organic feel.

### Input Fields
- **Backgrounds:** Use `surface-container-highest` for the input track. 
- **States:** Focus states should utilize a 2px `primary` glow with a soft ambient shadow, rather than a harsh border change.

### Chips
- **Selection:** Use `secondary-container` (#b9eeab) with `on-secondary-container` (#3f6d38) for a "foliage" feel that indicates growth or selection.

### Signature Component: The "Soil" Header
A hero component utilizing a heavy `display-lg` serif title that breaks the container, partially overlapping a `surface-container-low` image block and the main `surface` background.

---

## 6. Do's and Don'ts

### Do
- **Do** prioritize WCAG AAA contrast ratios; the "Clay" and "Forest" tones are designed for extreme legibility.
- **Do** use asymmetrical layouts. Let images or headers bleed off the edge of the grid to create a premium, editorial feel.
- **Do** use `8pt` increments for all spacing to maintain a rhythmic, mathematical harmony beneath the organic exterior.

### Don't
- **Don't** use pure black (#000000). Use `on-surface` (#1b1c19) to maintain the organic warmth.
- **Don't** use standard "drop shadows" with high opacity.
- **Don't** use 1px dividers to separate content. If the layout feels cluttered, increase the white space (e.g., move from 16px to 24px or 32px padding).
- **Don't** use sharp 90-degree corners. Everything in this system should feel handled, tumbled, and organic.