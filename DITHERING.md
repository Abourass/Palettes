# Dithering Implementation

This document describes the three dithering algorithms implemented in the Palette Analyzer application.

## Overview

Dithering is a technique used to create the illusion of color depth in images with a limited color palette. When reducing colors, dithering distributes the quantization error to create smoother transitions and prevent banding.

## Dithering Algorithms

### 1. Floyd-Steinberg Dithering

**Best for:** General use, smooth gradients, photographic content

The Floyd-Steinberg algorithm is the most popular error diffusion dithering method. It distributes the quantization error to neighboring pixels using the following pattern:

```
       X   7/16
3/16  5/16  1/16
```

Where X is the current pixel being processed. The algorithm:
1. Finds the closest palette color for the current pixel
2. Calculates the color error (difference between original and palette color)
3. Distributes this error to the four neighboring pixels that haven't been processed yet
4. Processes pixels left-to-right, top-to-bottom

**Pros:**
- Creates very smooth gradients
- Industry standard for high-quality dithering
- Works well with most images

**Cons:**
- Can create visible "worm" patterns in some cases
- Slightly slower than ordered dithering

### 2. Ordered/Bayer Dithering

**Best for:** Retro aesthetic, pixel art, consistent texture

Ordered dithering uses a threshold map (Bayer matrix) to determine which pixels should be quantized to which colors. The implementation includes 2×2, 4×4, and 8×8 Bayer matrices (default is 4×4).

**Example 4×4 Bayer Matrix:**
```
0   8   2  10
12  4  14   6
3  11   1   9
15  7  13   5
```

The algorithm:
1. For each pixel, looks up the threshold value from the Bayer matrix
2. Adds this threshold to the pixel color
3. Finds the closest palette color
4. Processes pixels in any order (order-independent)

**Pros:**
- Creates distinctive crosshatch/screen door patterns
- Perfect for retro/vintage aesthetic
- Very fast (no error propagation)
- Deterministic results

**Cons:**
- More visible patterns than error diffusion
- Can look "noisy" in some contexts

### 3. Atkinson Dithering

**Best for:** High-key images, preserving highlights, HyperCard/MacPaint aesthetic

Developed by Bill Atkinson for the original Macintosh, this algorithm creates a distinctive look that preserves bright areas better than Floyd-Steinberg.

**Error distribution pattern:**
```
      X  1/8  1/8
1/8  1/8  1/8
     1/8
```

Key characteristics:
1. Distributes only 75% (6/8) of the error, letting 25% "disappear"
2. Creates lighter, more ethereal results
3. Prevents dark areas from becoming too muddy
4. Spreads error across two rows

**Pros:**
- Unique, artistic look
- Excellent for high-contrast images
- Preserves highlights and bright areas
- Historical accuracy for HyperCard-style art

**Cons:**
- Can lose shadow detail
- May look too light in some images
- Not suitable for all content types

## Usage in Code

### Basic Usage

```javascript
import { 
  applyFloydSteinbergDithering,
  applyOrderedDithering,
  applyAtkinsonDithering 
} from './utils/colorUtils';

// Apply Floyd-Steinberg dithering
const dithered = applyFloydSteinbergDithering(imageData, palette);

// Apply Ordered/Bayer dithering with 4×4 matrix (default)
const ordered = applyOrderedDithering(imageData, palette);

// Apply Atkinson dithering
const atkinson = applyAtkinsonDithering(imageData, palette);
```

### With Custom Matching Functions

All dithering functions support custom color matching strategies:

```javascript
import { findClosestByHue, findClosestByLuminosity } from './utils/colorUtils';

// Use hue matching with dithering
const hueMatch = applyFloydSteinbergDithering(
  imageData, 
  palette, 
  findClosestByHue
);

// Use luminosity matching with ordered dithering
const lumMatch = applyOrderedDithering(
  imageData,
  palette,
  findClosestByLuminosity,
  8  // Use 8×8 Bayer matrix for finer pattern
);
```

### Via generatePaletteVariations

The `generatePaletteVariations` function now accepts a dithering method:

```javascript
const variations = generatePaletteVariations(
  imageData, 
  palette, 
  'floyd-steinberg'  // or 'ordered', 'atkinson', 'none'
);
```

## UI Integration

The dithering selector allows users to choose between:

1. **No Dithering** - Clean, sharp transitions
2. **Floyd-Steinberg** - Smooth, recommended for most cases
3. **Ordered/Bayer** - Retro crosshatch pattern
4. **Atkinson** - HyperCard style, preserves highlights

The selection is reactive - changing the dithering method automatically regenerates all palette variations.

## Performance Considerations

- **Floyd-Steinberg**: Medium speed, requires sequential processing
- **Ordered**: Fastest, can be parallelized
- **Atkinson**: Similar to Floyd-Steinberg, slightly more error distribution

For large images, consider:
- Using ordered dithering for real-time preview
- Applying error diffusion methods (Floyd-Steinberg/Atkinson) for final output
- Downscaling very large images before dithering

## Historical Context

- **Floyd-Steinberg** (1976): Developed by Robert Floyd and Louis Steinberg
- **Ordered Dithering** (1973): Based on Bayer's work on halftone patterns
- **Atkinson** (1983): Created by Bill Atkinson for MacPaint/HyperCard

Each algorithm reflects different priorities in the tradeoff between speed, quality, and aesthetic goals.
