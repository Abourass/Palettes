# Color Harmony Generator

The Color Harmony Generator allows you to create beautiful, theoretically-sound color palettes using established color theory principles.

## Features

### 1. Generate from Base Color
Pick any color as a starting point and generate 7 different harmony types based on color theory.

### 2. Extract from Image
Analyze your uploaded image to extract dominant colors, then generate harmonies based on those colors.

### 3. Multiple Harmony Types
Choose from 7 different color harmony schemes:

## Color Harmony Types

### Complementary
**Colors:** 2 main hues (opposite on color wheel)  
**Spacing:** 180° apart  
**Use for:** High contrast, vibrant designs, making elements stand out  
**Example:** Blue + Orange, Red + Green

**Description:** Complementary colors create maximum contrast and visual interest. They sit directly opposite each other on the color wheel. This scheme is energetic and eye-catching.

**Best for:**
- Call-to-action buttons
- Logos requiring high visibility
- Sports team colors
- Dynamic, energetic designs

---

### Analogous
**Colors:** 3-6 adjacent hues  
**Spacing:** 30° apart  
**Use for:** Harmonious, serene designs, nature themes  
**Example:** Blue + Blue-Green + Green

**Description:** Analogous colors sit next to each other on the color wheel. They blend well and create serene, comfortable designs. One color dominates, another supports, and a third accents.

**Best for:**
- Nature and landscape art
- Calming interfaces
- Gradient backgrounds
- Cohesive, unified designs

---

### Triadic
**Colors:** 3 main hues  
**Spacing:** 120° apart  
**Use for:** Balanced, vibrant designs with variety  
**Example:** Red + Yellow + Blue

**Description:** Triadic schemes use three colors evenly spaced around the color wheel. They're vibrant even with muted tones and offer strong visual contrast while maintaining harmony.

**Best for:**
- Children's designs
- Playful, energetic interfaces
- Retro gaming aesthetics
- Balanced designs needing variety

---

### Split-Complementary
**Colors:** Base + 2 colors adjacent to its complement  
**Spacing:** Base + (180° - 30°) + (180° + 30°)  
**Use for:** High contrast with more nuance than complementary  
**Example:** Blue + Red-Orange + Yellow-Orange

**Description:** A variation of complementary that replaces one color with its two adjacent colors. Provides strong visual contrast but is less aggressive than pure complementary.

**Best for:**
- Sophisticated designs
- When complementary feels too harsh
- Beginners (easier to balance than pure complementary)
- Designs needing both contrast and harmony

---

### Tetradic (Square)
**Colors:** 4 main hues  
**Spacing:** 90° apart  
**Use for:** Rich, complex designs with many elements  
**Example:** Red + Yellow-Green + Cyan + Purple

**Description:** Uses four colors evenly spaced on the color wheel (forming a square). Offers plenty of possibilities and works best when one color dominates.

**Best for:**
- Complex illustrations
- Designs with many distinct elements
- Rich, varied color schemes
- Websites with multiple sections

---

### Monochromatic
**Colors:** Single hue with variations  
**Spacing:** Same hue, varying lightness and saturation  
**Use for:** Elegant, cohesive, professional designs  
**Example:** Light Blue + Medium Blue + Dark Blue + Navy

**Description:** Uses variations of a single color by changing lightness and saturation. Creates a cohesive, sophisticated look that's easy on the eyes.

**Best for:**
- Professional presentations
- Minimalist designs
- Photography overlays
- Creating depth without color chaos

---

### Compound (Tetradic Rectangle)
**Colors:** 2 pairs of complementary colors  
**Spacing:** Base + 60° + 180° + 240°  
**Use for:** Complex, sophisticated designs  
**Example:** Blue + Orange + Yellow-Green + Red-Violet

**Description:** Uses two sets of complementary colors. Offers rich color possibilities but requires careful balance to avoid visual chaos.

**Best for:**
- Advanced designs
- Artwork with multiple focal points
- Designs needing both warm and cool tones
- Complex color relationships

---

## Extraction Methods

### K-Means Clustering
**Best for:** Images with gradients, subtle color transitions, or blended colors

**How it works:** Groups similar colors together by finding cluster centers. Iteratively improves color groupings until convergence.

**Use when:**
- Image has smooth gradients
- Colors blend into each other
- You want the "average" color feeling

**Example use cases:**
- Photographs
- Watercolor art
- Sunset/sky images
- Portraits

---

### Median Cut
**Best for:** Images with distinct color regions or high contrast

**How it works:** Recursively divides the color space by the dimension with the greatest range, creating a tree of color buckets.

**Use when:**
- Image has distinct color areas
- Clear color boundaries
- You want to preserve distinct hues

**Example use cases:**
- Pixel art
- Logos
- Flat design illustrations
- Comics with cel shading

---

## Usage Guide

### From Base Color

1. **Select Mode:** Click "Generate from Color"
2. **Pick Color:** Use the color picker or enter a hex code (e.g., #3498db)
3. **Generate:** Click "Generate Harmonies"
4. **Review:** Browse through 7 different harmony types
5. **Apply:** Click "Use This Palette" on your favorite

**Tips:**
- Start with your brand color or favorite hue
- Try multiple base colors to find the perfect fit
- Lighter colors work better for backgrounds
- Saturated colors create more vibrant harmonies

---

### From Image

1. **Upload Image:** First, upload an image in Step 1
2. **Select Mode:** Click "Extract from Image"
3. **Choose Method:**
   - K-Means for smooth/gradient images
   - Median Cut for distinct color regions
4. **Extract:** Click "Extract & Generate Harmonies"
5. **Review Results:**
   - See extracted dominant colors
   - Browse 7 harmony variations
6. **Apply:** Choose your favorite palette

**Tips:**
- High-contrast images extract better
- Try both methods to compare results
- The extracted palette shows the actual image colors
- Harmonies are based on the most dominant extracted color

---

## How Color Harmonies Are Generated

Each harmony type generates variations by:

1. **Main Colors:** Creating the core harmony colors based on the scheme
2. **Lightness Variations:** Adding lighter and darker versions (±15-20%)
3. **Maintaining Saturation:** Keeping the original color's saturation level
4. **Smart Spacing:** Using mathematically precise hue angles

This creates palettes with 6-12 colors suitable for pixel art and design work.

---

## Integration with Other Features

### Combining with Dithering

After generating a harmony palette:
1. Select your dithering method (Floyd-Steinberg, Ordered, Atkinson)
2. The palette will be applied with smooth color transitions
3. Compare results with different dithering methods

### Combining with Color Matching

Generated harmonies work with all 6 color matching strategies:
- **Luminosity Match:** Great for monochromatic harmonies
- **Hue Match:** Works well with analogous schemes
- **Saturation Match:** Interesting with complementary schemes
- **Inverted Luminosity:** Creates dramatic effects with any harmony
- **Complementary Hue:** Doubles the complementary effect
- **Perceptual Match:** Standard application for all harmonies

---

## Color Theory Basics

### The Color Wheel

Colors are arranged in a circle:
- **Primary:** Red (0°), Yellow (120°), Blue (240°)
- **Secondary:** Orange (60°), Green (180°), Purple (300°)
- **Tertiary:** Colors between primary and secondary

### Hue, Saturation, Lightness (HSL)

- **Hue:** The actual color (0-360°)
- **Saturation:** Color intensity (0-100%)
- **Lightness:** How light/dark (0-100%)

The generator uses HSL for precise color calculations while maintaining RGB output for image processing.

---

## Examples

### Example 1: Retro Game Aesthetic
**Input:** Base color #FF6B6B (red)  
**Harmony:** Triadic  
**Result:** Red + Yellow + Blue variations  
**Best with:** Ordered dithering for authentic retro look

### Example 2: Nature Photography
**Input:** Forest photo  
**Method:** K-Means extraction  
**Harmony:** Analogous  
**Result:** Green variations with complementary earth tones  
**Best with:** Floyd-Steinberg dithering for smooth gradients

### Example 3: Logo Recoloring
**Input:** Logo image  
**Method:** Median Cut extraction  
**Harmony:** Split-Complementary  
**Result:** Sophisticated multi-color palette  
**Best with:** No dithering for sharp edges

### Example 4: Minimalist Design
**Input:** Base color #2C3E50 (dark blue)  
**Harmony:** Monochromatic  
**Result:** Professional blue scale  
**Best with:** Atkinson dithering for clean highlights

---

## Technical Details

### Algorithms Used

**K-Means Clustering:**
- Iterative color grouping (max 20 iterations)
- Euclidean distance in RGB space
- Sorted by cluster size (most dominant first)

**Median Cut:**
- Recursive color space subdivision
- Splits by channel with greatest range
- Creates balanced color distribution

**Harmony Generation:**
- HSL color space for calculations
- Precise angle-based hue shifting
- Lightness variations preserve character
- RGB output for compatibility

---

## Troubleshooting

**Problem:** Extracted colors don't match image well  
**Solution:** Try the other extraction method (K-Means ↔ Median Cut)

**Problem:** Generated harmony looks muddy  
**Solution:** Start with a more saturated base color

**Problem:** Too many similar colors in palette  
**Solution:** Use Triadic or Tetradic for more variety

**Problem:** Harmony colors too light/dark  
**Solution:** Adjust base color lightness before generating

**Problem:** Can't generate from image  
**Solution:** Make sure an image is uploaded in Step 1

---

## Best Practices

1. **Start Simple:** Begin with complementary or analogous schemes
2. **Consider Context:** Match harmony type to your design goal
3. **Test Both Methods:** Try K-Means and Median Cut for extraction
4. **Adjust After:** Use Palette Editor to fine-tune generated colors
5. **Combine Techniques:** Layer harmonies with dithering and matching strategies
6. **Save Favorites:** Download palettes you like for future use
7. **Experiment:** Try "wrong" combinations for creative results

---

## Advanced Tips

- **Brand Consistency:** Generate from your brand color for cohesive designs
- **Seasonal Palettes:** Use warm/cool harmonies for seasonal themes
- **Accessibility:** Check contrast ratios for generated colors
- **Cultural Consideration:** Colors have different meanings in different cultures
- **Reference Images:** Extract from artwork you admire
- **Iteration:** Generate multiple times with slight color adjustments
- **Composition:** Use dominant color from harmony for 60% of design, support for 30%, accent for 10%

---

## Resources

- [Adobe Color Wheel](https://color.adobe.com/)
- [Color Theory Basics](https://en.wikipedia.org/wiki/Color_theory)
- [HSL Color Space](https://en.wikipedia.org/wiki/HSL_and_HSV)
- [K-Means Clustering](https://en.wikipedia.org/wiki/K-means_clustering)
- [Median Cut Algorithm](https://en.wikipedia.org/wiki/Median_cut)
