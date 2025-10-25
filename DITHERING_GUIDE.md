# Dithering Visual Comparison Guide

This guide helps you choose the right dithering method for your needs.

## Quick Reference

| Method | Best For | Visual Effect | Speed |
|--------|----------|---------------|-------|
| **No Dithering** | Sharp pixel art, logos | Clean, hard edges | Fastest |
| **Floyd-Steinberg** | Photos, realistic art | Smooth gradients | Medium |
| **Ordered/Bayer** | Retro games, vintage look | Crosshatch pattern | Fast |
| **Atkinson** | High-contrast art, comics | Lighter, airy feel | Medium |
| **Blue Noise** | Modern, professional work | Natural, minimal patterns | Fast |

## When to Use Each Method

### No Dithering
✅ **Use when:**
- Working with pixel art that already has limited colors
- You want sharp, clean transitions
- The palette closely matches the original colors
- Creating logos or icons

❌ **Avoid when:**
- Converting photos with gradients
- Reducing colors significantly (e.g., 256 colors to 8)
- Smooth transitions are important

**Example:** Converting a 16-color pixel art sprite to a different 16-color palette

---

### Floyd-Steinberg Dithering
✅ **Use when:**
- Converting photographs
- You need smooth color transitions
- Reducing colors significantly
- Quality is more important than style

❌ **Avoid when:**
- You want a specific aesthetic (retro, vintage)
- Processing power is very limited
- The "worm" artifact patterns are unacceptable

**Example:** Converting a photograph to an 8-color Game Boy palette

**Visual characteristics:**
- Scattered, organic patterns
- Smooth gradients
- Can show directional "worms" in flat areas

---

### Ordered/Bayer Dithering
✅ **Use when:**
- Creating retro/vintage aesthetic
- Making art that looks like old computer graphics
- You want consistent, repeating patterns
- Processing speed is important
- Creating screen-printed or halftone effects

❌ **Avoid when:**
- Smooth, natural-looking results are needed
- The crosshatch pattern is too visible
- Working with very small images

**Example:** Creating art that looks like it's from a CGA/EGA era computer or old newspapers

**Visual characteristics:**
- Regular crosshatch or screen door pattern
- Consistent texture across the image
- More "noisy" appearance than Floyd-Steinberg

---

### Atkinson Dithering
✅ **Use when:**
- Creating art with a HyperCard/MacPaint aesthetic
- Preserving bright highlights is important
- Working with high-contrast images
- You want a lighter, more ethereal look
- Making art that looks like 1-bit (black & white) graphics

❌ **Avoid when:**
- Shadow detail is critical
- You need standard, predictable results
- The image has mostly dark tones

**Example:** Creating art that looks like classic Macintosh applications or comics

**Visual characteristics:**
- Lighter overall appearance
- Better highlight preservation
- Can lose some shadow detail
- More "airy" and less dense than Floyd-Steinberg

---

### Blue Noise Dithering
✅ **Use when:**
- Creating professional, modern artwork
- You want minimal visible patterns
- Quality and natural appearance are priorities
- Working with photographs or gradients
- Need fast processing without artifacts

❌ **Avoid when:**
- You specifically want a retro/vintage look
- Ordered patterns are desired for aesthetic reasons
- Historical accuracy for old systems is required

**Example:** Converting a photograph to a limited palette while maintaining professional quality

**Visual characteristics:**
- Minimal visible patterns
- Natural, organic appearance
- Even noise distribution
- No directional artifacts

---

## Dither Intensity Control

All dithering methods support variable intensity from 0% to 200%:

### When to Adjust Intensity

**Low Intensity (0-50%)**
- Subtle effects on already-optimized images
- Preventing over-dithering
- Maintaining cleaner appearance

**Normal Intensity (100%)**
- Standard dithering strength
- Best for most use cases
- Default setting

**High Intensity (150-200%)**
- Dramatic artistic effects
- Strong color transitions
- Creating heavily stylized looks

---

## Combining with Color Matching Strategies

Each dithering method can be combined with the 6 color matching strategies:

### Recommended Combinations

**For Photographs:**
- Floyd-Steinberg + Luminosity Match
- Blue Noise + Perceptual Match
- Floyd-Steinberg + Perceptual Match

**For Artistic/Stylized Results:**
- Ordered + Hue Match (strong color families)
- Atkinson + Saturation Match (vivid, comic-like)
- Blue Noise + Hue Match (modern, colorful)

**For Retro Gaming:**
- Ordered + Perceptual Match
- No Dithering + Luminosity Match

**For Modern/Professional:**
- Blue Noise + Luminosity Match
- Blue Noise + Perceptual Match

**For Experimental/Abstract:**
- Any dithering + Complementary Hue
- Any dithering + Inverted Luminosity

---

## Technical Differences

### Error Distribution Patterns

**Floyd-Steinberg:**
```
      X   7/16
3/16 5/16  1/16
```
- Distributes 100% of error
- 4 neighboring pixels affected
- 2 rows involved

**Atkinson:**
```
      X  1/8  1/8
1/8  1/8  1/8
     1/8
```
- Distributes 75% of error (6/8)
- 6 neighboring pixels affected
- 3 rows involved
- 25% error "disappears"

**Ordered (4×4 Bayer):**
- No error distribution
- Uses threshold matrix
- Same pattern repeats every 4×4 pixels

---

## Common Use Cases

### Converting Screenshots
**Recommended:** Floyd-Steinberg + Perceptual Match
- Maintains visual accuracy
- Smooth transitions

### Pixel Art Recoloring
**Recommended:** No Dithering + Hue Match
- Preserves sharp edges
- Changes color palette while keeping structure

### Vintage Computer Look
**Recommended:** Ordered + Luminosity Match
- Authentic retro appearance
- Matches old display technology

### Black & White Conversion
**Recommended:** Atkinson + Luminosity Match
- Classic Mac aesthetic
- Great for line art

### Fantasy/Dream-like Effect
**Recommended:** Atkinson + Complementary Hue
- Surreal color shifts
- Ethereal appearance

---

## Performance Tips

1. **For real-time preview:** Use Ordered dithering (fastest)
2. **For final export:** Use Floyd-Steinberg or Atkinson (highest quality)
3. **For large images:** Consider downscaling before dithering
4. **For animation:** Use No Dithering or Ordered (consistent frame-to-frame)

---

## Historical Context & Inspiration

### Floyd-Steinberg (1976)
Used in: Early image processing, GIF encoding, modern image tools

### Ordered/Bayer (1973)
Used in: Early computer graphics, newspaper printing, game consoles

### Atkinson (1983)
Used in: MacPaint, HyperCard, early Mac applications, modern pixel art tools

---

## Troubleshooting

**Problem:** Dithering looks too noisy
- **Solution:** Try Atkinson (less dense) or No Dithering

**Problem:** Gradients show banding
- **Solution:** Use Floyd-Steinberg dithering

**Problem:** Results look too dark
- **Solution:** Try Atkinson (preserves highlights)

**Problem:** Want retro aesthetic but Floyd-Steinberg looks too smooth
- **Solution:** Use Ordered/Bayer dithering

**Problem:** Dithering takes too long
- **Solution:** Use Ordered dithering (fastest) or reduce image size

---

## Experiment!

The best way to understand dithering is to try all methods with your specific image and palette. The Palette Analyzer makes this easy by generating all variations instantly when you change the dithering method.

Try the same image with:
1. Different dithering methods
2. Different color matching strategies
3. Different palette sizes

You might be surprised by which combination works best for your specific use case!
