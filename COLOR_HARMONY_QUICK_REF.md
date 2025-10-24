# Color Harmony Quick Reference

## 7 Harmony Types at a Glance

```
╔══════════════════════════════════════════════════════════════════════════╗
║                         COLOR HARMONY CHEAT SHEET                        ║
╚══════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────┐
│ COMPLEMENTARY - Maximum Contrast                                        │
│ Colors: 2 (opposite)     Spacing: 180°      Energy: ★★★★★              │
│ Best for: High contrast, call-to-actions, sports teams                 │
│ Example: Blue + Orange, Red + Green                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ ANALOGOUS - Serene Harmony                                              │
│ Colors: 3-6 (adjacent)   Spacing: 30°       Energy: ★★☆☆☆              │
│ Best for: Nature, calm designs, gradients                              │
│ Example: Blue + Blue-Green + Green                                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ TRIADIC - Vibrant Balance                                               │
│ Colors: 3 (evenly spaced) Spacing: 120°    Energy: ★★★★☆              │
│ Best for: Playful, retro, children's designs                           │
│ Example: Red + Yellow + Blue                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ SPLIT-COMPLEMENTARY - Sophisticated Contrast                            │
│ Colors: 3 (base + 2)     Spacing: 180°±30°  Energy: ★★★★☆              │
│ Best for: Complex designs, easier to balance                           │
│ Example: Blue + Red-Orange + Yellow-Orange                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ TETRADIC - Rich Complexity                                              │
│ Colors: 4 (square)       Spacing: 90°       Energy: ★★★★★              │
│ Best for: Complex illustrations, varied designs                        │
│ Example: Red + Yellow-Green + Cyan + Purple                            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ MONOCHROMATIC - Elegant Simplicity                                      │
│ Colors: 1 hue (variations) Spacing: Same   Energy: ★☆☆☆☆              │
│ Best for: Professional, minimalist, cohesive                           │
│ Example: Light Blue + Medium Blue + Dark Blue                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ COMPOUND - Advanced Dual Complementary                                  │
│ Colors: 4 (2 pairs)      Spacing: 60°+180°  Energy: ★★★★★              │
│ Best for: Advanced designs, multiple focal points                      │
│ Example: Blue + Orange + Yellow-Green + Red-Violet                     │
└─────────────────────────────────────────────────────────────────────────┘


╔══════════════════════════════════════════════════════════════════════════╗
║                          EXTRACTION METHODS                              ║
╚══════════════════════════════════════════════════════════════════════════╝

K-MEANS CLUSTERING                 vs.    MEDIAN CUT
────────────────────────────────────────────────────────────────────────────
✓ Smooth gradients                        ✓ Distinct color regions
✓ Blended colors                          ✓ High contrast images
✓ Photographs                             ✓ Pixel art / logos
✓ Average color feeling                   ✓ Preserves distinct hues
✓ Portraits, sunsets                      ✓ Comics, flat design


╔══════════════════════════════════════════════════════════════════════════╗
║                         DECISION TREE                                    ║
╚══════════════════════════════════════════════════════════════════════════╝

Start Here
    │
    ├─ Need HIGH CONTRAST?
    │   ├─ Yes → COMPLEMENTARY (most contrast)
    │   └─ Somewhat → SPLIT-COMPLEMENTARY (easier to balance)
    │
    ├─ Want HARMONY/CALM?
    │   ├─ Yes → ANALOGOUS (serene, natural)
    │   └─ Very unified → MONOCHROMATIC (most cohesive)
    │
    ├─ Need VARIETY/ENERGY?
    │   ├─ 3 colors → TRIADIC (balanced, playful)
    │   ├─ 4 colors → TETRADIC (rich, complex)
    │   └─ Advanced → COMPOUND (sophisticated)
    │
    └─ Extracting from image?
        ├─ Smooth/gradients → K-MEANS
        └─ Distinct regions → MEDIAN CUT


╔══════════════════════════════════════════════════════════════════════════╗
║                    HARMONY + DITHERING COMBOS                            ║
╚══════════════════════════════════════════════════════════════════════════╝

Recommended Combinations:

🎨 SMOOTH & NATURAL
   Harmony: Analogous or Monochromatic
   Dithering: Floyd-Steinberg
   Use: Nature photos, portraits

🎮 RETRO GAMING
   Harmony: Triadic or Tetradic
   Dithering: Ordered/Bayer
   Use: Pixel art, vintage aesthetic

🎭 HIGH CONTRAST ART
   Harmony: Complementary
   Dithering: Atkinson
   Use: Comics, high-contrast designs

✨ SOPHISTICATED
   Harmony: Split-Complementary or Compound
   Dithering: Floyd-Steinberg
   Use: Professional designs, branding


╔══════════════════════════════════════════════════════════════════════════╗
║                         QUICK START GUIDE                                ║
╚══════════════════════════════════════════════════════════════════════════╝

1. UPLOAD IMAGE
   └─ Any image works, but higher contrast = better extraction

2. CHOOSE METHOD
   ├─ From Color: Pick a base color manually
   └─ From Image: Auto-extract dominant colors

3. SELECT HARMONY
   └─ Browse 7 generated harmony types

4. USE PALETTE
   └─ Click "Use This Palette" to apply

5. ADJUST DITHERING
   └─ Choose dithering method for smooth transitions

6. REFINE
   └─ Use Palette Editor to fine-tune colors

7. DOWNLOAD
   └─ Save your recolored image and palette


╔══════════════════════════════════════════════════════════════════════════╗
║                           PRO TIPS                                       ║
╚══════════════════════════════════════════════════════════════════════════╝

💡 Start with your brand color → Generate harmonies → Instant color scheme
💡 Extract from artwork you admire → Get inspired color palettes
💡 Monochromatic + Atkinson dithering = Clean, professional look
💡 Triadic + Ordered dithering = Perfect retro game aesthetic
💡 Try both K-Means and Median Cut → Compare results
💡 Lighter base colors → Better for backgrounds
💡 Saturated base colors → More vibrant harmonies
💡 Save palettes you like → Build a library


╔══════════════════════════════════════════════════════════════════════════╗
║                        COLOR WHEEL ANGLES                                ║
╚══════════════════════════════════════════════════════════════════════════╝

                    Yellow (60°)
                         │
        Yellow-Green     │     Yellow-Orange
            (90°)        │        (30°)
                    \    │    /
                      \  │  /
    Green (120°) ──────  ●  ────── Orange (0°/360°)
                      /  │  \
                    /    │    \
        Blue-Green       │     Red-Orange
            (150°)       │        (330°)
                         │
                    Blue (180°)
                         │
        Blue-Violet      │     Red-Violet
            (210°)       │        (300°)
                    \    │    /
                      \  │  /
    Cyan (240°) ────────  ●  ────── Red (270°)


Reference this wheel when understanding harmony spacing!


╔══════════════════════════════════════════════════════════════════════════╗
║                      TROUBLESHOOTING                                     ║
╚══════════════════════════════════════════════════════════════════════════╝

Problem                          Solution
────────────────────────────────────────────────────────────────────────────
Colors look muddy                Use more saturated base color
Too many similar colors          Try Triadic or Tetradic
Extraction doesn't match image   Switch K-Means ↔ Median Cut
Colors too light/dark            Adjust base color lightness first
Can't generate from image        Upload image in Step 1 first
Harmony looks too chaotic        Try Analogous or Monochromatic
Need more contrast               Use Complementary or Split-Complementary
```

## File Locations

- **Core Logic:** `/src/utils/colorHarmony.js`
- **UI Component:** `/src/components/ColorHarmonyGenerator.jsx`
- **Full Docs:** `/COLOR_HARMONY.md`
- **Integration:** `/src/App.jsx` (Step 2)

## API Quick Reference

```javascript
// Generate from color
import { generateComplementary, generateAnalogous } from './utils/colorHarmony';

const baseColor = { r: 52, g: 152, b: 219 }; // #3498db
const palette = generateComplementary(baseColor);

// Extract from image
import { extractPaletteFromImage } from './utils/colorHarmony';

const palette = extractPaletteFromImage(imageData, 8); // 8 colors

// Generate all harmonies at once
import { generateAllHarmonies } from './utils/colorHarmony';

const harmonies = generateAllHarmonies(baseColor);
// Returns: { complementary, analogous, triadic, ... }
```
