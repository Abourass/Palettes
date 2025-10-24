# Color Harmony Visual Examples

This guide shows practical examples of when to use each harmony type.

## 🎨 Complementary

```
Before: Blue sky image
After:  Blue sky + Orange sunset accents

Perfect for: High drama, call-to-action buttons
```

**Color Wheel:**
```
        Yellow
           │
    Green  │  Orange  ← Complementary pair!
           │
    ═══════●═══════
           │
    Cyan   │  Red
           │
        Blue
```

**Example Uses:**
- Sports team logos (Blue + Orange)
- Warning signs (Yellow + Purple)
- Movie posters (Teal + Orange)
- Sale buttons on websites

---

## 🌿 Analogous

```
Before: Forest photo
After:  Yellow-green → Green → Blue-green harmony

Perfect for: Nature, calming interfaces
```

**Color Wheel:**
```
        Yellow
           │
    Yellow-Green  ← Start
           │
    Green    ← Middle (base)
           │
    Blue-Green  ← End
           │
        Cyan
```

**Example Uses:**
- Nature photography
- Spa/wellness websites
- Environmental apps
- Gradient backgrounds

---

## 🎮 Triadic

```
Before: Pixel art game character
After:  Red armor + Yellow details + Blue background

Perfect for: Retro games, playful designs
```

**Color Wheel:**
```
        Red ●
         ╱  ╲
        ╱    ╲
       ╱      ╲
      ●────────● 
   Yellow    Blue

   (120° spacing)
```

**Example Uses:**
- Children's toys
- Retro game graphics
- Educational materials
- Fast food branding

---

## 🎭 Split-Complementary

```
Before: Portrait photo
After:  Blue dress + Red-Orange lipstick + Yellow-Orange hair highlights

Perfect for: Sophisticated contrast
```

**Color Wheel:**
```
        Base: Blue
           │
           ● (Blue)
          ╱ ╲
         ╱   ╲
        ●     ● (Split complements)
   Yellow-  Red-
   Orange  Orange
```

**Example Uses:**
- Fashion photography
- Magazine layouts
- Sophisticated branding
- Art with focal points

---

## 🖼️ Tetradic

```
Before: Complex illustration
After:  Red hero + Green villain + Yellow background + Purple shadows

Perfect for: Rich, multi-element designs
```

**Color Wheel:**
```
    Red ●───────● Green
        │       │
        │   ●   │
        │       │
    Purple ●────● Yellow

    (90° spacing, square)
```

**Example Uses:**
- Complex illustrations
- Dashboard UIs with sections
- Infographics
- Game level designs

---

## 🏢 Monochromatic

```
Before: Corporate website
After:  Navy blue → Medium blue → Light blue → Sky blue

Perfect for: Professional, unified look
```

**Color Wheel:**
```
         Blue
         
    Dark ━━━━━ Light
    100%      50%      0%
    Saturation variation
    
    90%       60%      30%
    Lightness variation
```

**Example Uses:**
- Corporate presentations
- Minimalist design
- Professional portfolios
- Tech company websites

---

## 🎨 Compound

```
Before: Abstract art
After:  Blue + Orange pair + Yellow-Green + Red-Violet pair

Perfect for: Advanced, artistic designs
```

**Color Wheel:**
```
         Blue ●
           ╱ ╲
          ╱   ╲
  Yellow-●     ●-Red
  Green         Violet
          ╲   ╱
           ╲ ╱
         Orange ●

    (Two complementary pairs)
```

**Example Uses:**
- Advanced artwork
- Editorial design
- Creative agency portfolios
- Music album covers

---

## 📸 Real-World Scenarios

### Scenario 1: Recoloring a Sunset Photo
**Input:** Photo with orange/red sunset  
**Method:** Extract from image (K-Means)  
**Harmony:** Analogous (warm colors)  
**Result:** Cohesive warm palette  
**Dithering:** Floyd-Steinberg for smooth gradients

### Scenario 2: Logo to Retro Game Palette
**Input:** Modern logo  
**Method:** Extract from image (Median Cut)  
**Harmony:** Triadic  
**Result:** Bold, game-ready colors  
**Dithering:** Ordered for authentic retro look

### Scenario 3: Brand Color Expansion
**Input:** Single brand color (#3498db)  
**Method:** Generate from color  
**Harmony:** Monochromatic + Split-Complementary  
**Result:** Primary palette + accent colors  
**Dithering:** None for clean corporate look

### Scenario 4: Nature Photo to Palette
**Input:** Forest photograph  
**Method:** Extract from image (K-Means)  
**Harmony:** Analogous  
**Result:** Natural green variations  
**Dithering:** Floyd-Steinberg for photo-realistic

### Scenario 5: High-Contrast Art
**Input:** Base red color  
**Method:** Generate from color  
**Harmony:** Complementary  
**Result:** Red + Cyan contrast  
**Dithering:** Atkinson for comic-book style

---

## 🎯 Decision Matrix

| Your Goal | Recommended Harmony | Extraction | Dithering |
|-----------|-------------------|------------|-----------|
| **Maximum contrast** | Complementary | Median Cut | None/Atkinson |
| **Calming effect** | Analogous | K-Means | Floyd-Steinberg |
| **Playful/Energetic** | Triadic | Either | Ordered |
| **Professional** | Monochromatic | K-Means | Floyd-Steinberg |
| **Sophisticated** | Split-Complementary | K-Means | Floyd-Steinberg |
| **Rich/Complex** | Tetradic/Compound | Median Cut | Floyd-Steinberg |
| **Retro Gaming** | Triadic | Median Cut | Ordered |
| **Nature Themes** | Analogous | K-Means | Floyd-Steinberg |
| **Comic Art** | Split-Complementary | Median Cut | Atkinson |
| **Corporate** | Monochromatic | Either | None |

---

## 💡 Pro Tips with Visuals

### Tip 1: Start Saturated
```
❌ Pastel base (#D0E0F0) → Muddy harmonies
✅ Saturated base (#3498DB) → Vibrant harmonies
```

### Tip 2: Extraction Method Matters
```
Gradients/Photos → K-Means
│  Smooth blends
│  Averaged colors
└─ Better for: Sunsets, portraits, watercolors

Distinct Regions → Median Cut
│  Preserves boundaries
│  Distinct hues
└─ Better for: Logos, pixel art, comics
```

### Tip 3: Combine Techniques
```
Step 1: Extract from reference photo (K-Means)
Step 2: Use dominant color as base
Step 3: Generate harmony (Analogous)
Step 4: Apply with dithering (Floyd-Steinberg)
Result: Photo-inspired, theoretically-sound palette
```

### Tip 4: Use Multiple Harmonies
```
Primary colors: Monochromatic (cohesive)
Accent colors: Complementary (contrast)
Result: Professional with pop
```

---

## 🔄 Before & After Examples

### Example 1: Landscape Photo
```
BEFORE:
├─ Original photo (thousands of colors)
└─ Noisy, unstructured

AFTER (Analogous + Floyd-Steinberg):
├─ 8 harmonious green/yellow tones
├─ Smooth gradients preserved
└─ Cohesive natural look
```

### Example 2: Game Sprite
```
BEFORE:
├─ Modern 32-bit sprite
└─ Too many colors for retro

AFTER (Triadic + Ordered):
├─ Red, Yellow, Blue + variations
├─ Crosshatch dither pattern
└─ Authentic NES/SNES aesthetic
```

### Example 3: Brand Identity
```
BEFORE:
├─ Single brand color
└─ Need full palette

AFTER (Monochromatic + Split-Complementary):
├─ Primary: 6 blue variations
├─ Accents: 2 complementary colors
└─ Professional, versatile palette
```

---

## 🎨 Color Psychology Combinations

### Harmonies by Mood

**Energetic & Bold:**
- Triadic or Tetradic
- High saturation
- No dithering or Ordered

**Calm & Serene:**
- Analogous or Monochromatic
- Medium saturation
- Floyd-Steinberg

**Professional & Trustworthy:**
- Monochromatic (blues)
- Low-medium saturation
- None or Floyd-Steinberg

**Creative & Artistic:**
- Compound or Split-Complementary
- Varied saturation
- Any dithering based on style

**Natural & Organic:**
- Analogous (greens/earth tones)
- Medium saturation
- Floyd-Steinberg

---

## 📊 Success Metrics

How to know you picked the right harmony:

✅ **Good Harmony Choice:**
- Colors work well together
- Matches your design goal
- Evokes intended emotion
- Image is readable/clear

❌ **Wrong Harmony Choice:**
- Colors clash or look muddy
- Too boring or too chaotic
- Wrong mood for content
- Details lost

**Solution:** Try 2-3 different harmonies and compare!

---

## 🚀 Quick Start Workflows

### Workflow 1: "I have a brand color"
1. Enter hex code in color picker
2. Generate all harmonies
3. Use Monochromatic for primary
4. Use Split-Complementary for accents
5. Done!

### Workflow 2: "I have a reference image"
1. Upload reference image
2. Extract with K-Means
3. Browse all 7 generated harmonies
4. Pick favorite
5. Apply to your image

### Workflow 3: "I want retro game colors"
1. Pick bright primary (red/blue/yellow)
2. Generate Triadic
3. Select Ordered dithering
4. Apply to sprite
5. Perfect retro look!

### Workflow 4: "I need professional website colors"
1. Pick corporate color (blue/gray)
2. Generate Monochromatic
3. Select Floyd-Steinberg or None
4. Export palette
5. Use in CSS

---

## 🎓 Learning Path

### Beginner:
1. Start with Complementary (easy to see)
2. Try Analogous (easy to understand)
3. Use Monochromatic (can't go wrong)

### Intermediate:
4. Experiment with Triadic
5. Try Split-Complementary
6. Compare extraction methods

### Advanced:
7. Use Tetradic for complex work
8. Try Compound for sophistication
9. Combine with advanced matching strategies
10. Create custom workflows

---

Remember: **There are no wrong choices, only different effects!**
Experiment freely and trust your eye. 🎨
