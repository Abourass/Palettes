# Palette Analyzer

A web application for analyzing and remapping pixel art color palettes with advanced dithering options and color harmony generation. Built with SolidJS, Tailwind CSS, and Kobalte.

## Features

- **Image Upload**: Upload pixel art images via drag-and-drop or file selection
- **Palette Selection**: Choose from 6 classic pixel art palettes (Game Boy, NES, Pico-8, C64, ENDESGA 32, Sweetie 16)
- **Custom Palettes**: Upload hex color files to create custom palettes
- **Color Harmony Generator**: 🎨 **NEW!** Create theoretically-sound palettes from color theory
  - **7 Harmony Types**: Complementary, Analogous, Triadic, Split-Complementary, Tetradic, Monochromatic, Compound
  - **Generate from Color**: Pick a base color and generate harmonies
  - **Extract from Image**: Auto-extract dominant colors using K-Means or Median Cut algorithms
  - **Smart Variations**: Each harmony includes lightness and saturation variations
- **Smart Color Mapping**: 🎨 **NEW!** Choose how colors are matched:
  - **Preserve Distinctness Mode** (Recommended for Pixel Art): Ensures each unique source color maps to a different palette color - prevents unwanted color merging that can ruin pixel art
  - **Closest Match Mode**: Standard nearest-color matching - may merge similar colors together
- **Dithering Options**: 5 active dithering methods plus No Dithering option to create smoother color transitions:
  - **No Dithering**: Clean, sharp color transitions
  - **Floyd-Steinberg**: Most popular error diffusion, smooth gradients (recommended)
  - **Ordered/Bayer**: Retro crosshatch pattern for vintage aesthetic
  - **Atkinson**: HyperCard/MacPaint style, preserves highlights
  - **Blue Noise**: Modern, artifact-free dithering with natural appearance
  - **Variable Intensity**: Adjustable dither strength from 0% to 200% for fine-tuned control
- **6 Color Matching Strategies**: Generates 6 variations using different algorithms:
  - **Luminosity Match**: Preserves light/dark contrast by matching brightness
  - **Hue Match**: Maintains color families (reds stay red-ish, blues stay blue-ish)
  - **Saturation Match**: Matches color vividness (vibrant vs muted)
  - **Inverted Luminosity**: Creates dramatic inversions (dark ↔ light)
  - **Complementary Hue**: Maps to opposite colors on the color wheel
  - **Perceptual Match**: Standard RGB distance matching
- **Similar Palette Generation**: Creates 6 additional variations with similar color schemes
- **Interactive Palette Editor**: Manually adjust colors with a visual color picker
- **Download Options**: Download both the recolored image and the palette as a hex color file

## Usage

1. **Upload an Image**: Click or drag-and-drop a pixel art image
2. **Choose Your Palette Source**:
   - Upload a custom hex color file
   - Select from preset palettes
   - **🎨 Generate from Color Harmony** (pick a color or extract from image)
   - Select a dithering method
3. **Review Results**: View 12 different versions of your image:
   - 6 variations using different color matching algorithms (with selected dithering)
   - 6 variations with algorithmically generated similar palettes
4. **Refine**: Select your favorite version and fine-tune the colors
5. **Download**: Save the recolored image and/or the color palette

## Color Harmony Generator

Generate beautiful, theoretically-sound color palettes:

### From Base Color
1. Pick any color as your starting point
2. Generate 7 harmony types based on color theory
3. Choose your favorite harmony

### From Image
1. Upload an image
2. Choose extraction method (K-Means or Median Cut)
3. Auto-extract dominant colors
4. Generate harmonies from extracted colors

### Harmony Types
- **Complementary**: Opposite colors (high contrast)
- **Analogous**: Adjacent colors (harmonious)
- **Triadic**: Three evenly-spaced colors (balanced)
- **Split-Complementary**: Sophisticated contrast
- **Tetradic**: Four evenly-spaced colors (rich)
- **Monochromatic**: Single hue variations (elegant)
- **Compound**: Two complementary pairs (complex)

For complete guide, see [COLOR_HARMONY.md](COLOR_HARMONY.md) or [Quick Reference](COLOR_HARMONY_QUICK_REF.md)

## Dithering Guide

### When to Use Each Method

- **No Dithering**: Best for pixel art that already has clean, limited colors
- **Floyd-Steinberg**: Best for photographs and smooth gradients
- **Ordered/Bayer**: Best for retro/vintage aesthetic, consistent patterns
- **Atkinson**: Best for high-contrast images, comic art, preserving highlights
- **Blue Noise**: Best for modern, high-quality dithering with minimal visible patterns

### Dither Intensity

All dithering methods (except "No Dithering") support adjustable intensity from 0% to 200%:
- **0-50%**: Subtle dithering, minimal artifacts
- **100%**: Standard dithering strength (default)
- **150-200%**: Strong dithering for dramatic effects

For more details, see [DITHERING_GUIDE.md](DITHERING_GUIDE.md)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with interactive UI
npm run test:ui
```

## Testing

This project includes comprehensive automated tests for core functionality:
- **103 tests** covering color utilities, harmony generation, and palettes
- **61% overall code coverage** with 90%+ coverage of critical algorithms
- Tests run automatically on every pull request

For detailed testing documentation, see [TESTING.md](TESTING.md).

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## Hex Color File Format

Upload a text file with one hex color per line:

```
#0F380F
#306230
#8BAC0F
#9BBC0F
```

## Deployment

This project is configured to deploy to GitHub Pages automatically when changes are pushed to the main branch.

## Technologies

- **SolidJS**: Reactive UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Kobalte**: Accessible UI components
- **Vite**: Build tool and dev server

## License

ISC
