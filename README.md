# Palette Analyzer

A web application for analyzing and remapping pixel art color palettes. Built with SolidJS, Tailwind CSS, and Kobalte.

## Features

- **Image Upload**: Upload pixel art images via drag-and-drop or file selection
- **Palette Selection**: Choose from 6 classic pixel art palettes (Game Boy, NES, Pico-8, C64, ENDESGA 32, Sweetie 16)
- **Custom Palettes**: Upload hex color files to create custom palettes
- **6 Color Matching Strategies**: Generates 6 variations using different algorithms:
  - **Luminosity Match**: Preserves light/dark contrast by matching brightness
  - **Hue Match**: Maintains color families (reds stay red-ish, blues stay blue-ish)
  - **Saturation Match**: Matches color vividness (vibrant vs muted)
  - **Inverted Luminosity**: Creates dramatic inversions (dark ↔ light)
  - **Complementary Hue**: Maps to opposite colors on the color wheel
  - **Perceptual Match**: Standard RGB distance matching
- **Similar Palette Generation**: Creates 3 additional variations with similar color schemes
- **Interactive Palette Editor**: Manually adjust colors with a visual color picker
- **Download Options**: Download both the recolored image and the palette as a hex color file

## Usage

1. **Upload an Image**: Click or drag-and-drop a pixel art image
2. **Select a Palette**: Choose from predefined palettes or upload a custom hex color file
3. **Review Results**: View 9 different versions of your image:
   - 6 variations using different color matching algorithms
   - 3 variations with algorithmically generated similar palettes
4. **Refine**: Select your favorite version and fine-tune the colors
5. **Download**: Save the recolored image and/or the color palette

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
