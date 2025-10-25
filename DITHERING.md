# Dithering Implementation

This document describes the dithering algorithms implemented in the Palette Analyzer application.

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

### 4. Blue Noise Dithering

**Best for:** Modern, high-quality dithering with natural appearance

Blue noise dithering uses a specially crafted noise pattern where energy is concentrated in high frequencies. This creates a more natural, less patterned appearance compared to ordered dithering while being faster than error diffusion methods.

**Characteristics:**
```
Uses a 64×64 blue noise texture pattern
Tiles seamlessly for any image size
Deterministic and reproducible
```

Key characteristics:
1. Minimal visible patterns or artifacts
2. Perceptually uniform noise distribution
3. Fast processing (no error propagation)
4. Spatially decorrelated noise

**Pros:**
- Modern, clean appearance
- Minimal visible patterns
- Fast processing
- No directional artifacts
- Works well with all image types

**Cons:**
- Less "retro" than ordered dithering
- Slightly less smooth than Floyd-Steinberg in some cases
- Requires 64×64 texture pattern

## Variable Dither Intensity

All dithering methods (except "No Dithering") support adjustable intensity:

- **0.0 (0%)**: No dithering effect
- **0.5 (50%)**: Subtle dithering
- **1.0 (100%)**: Standard dithering strength (default)
- **2.0 (200%)**: Strong dithering for dramatic effects

The intensity parameter scales the dithering strength:
- For error diffusion (Floyd-Steinberg, Atkinson): Scales error distribution
- For ordered dithering: Scales threshold matrix values
- For blue noise: Scales noise amplitude

## Usage in Code

### Basic Usage

```javascript
import { 
  applyFloydSteinbergDithering,
  applyOrderedDithering,
  applyAtkinsonDithering,
  applyBlueNoiseDithering
} from './utils/colorUtils';

// Apply Floyd-Steinberg dithering with default intensity
const dithered = applyFloydSteinbergDithering(imageData, palette);

// Apply Ordered/Bayer dithering with 4×4 matrix (default)
const ordered = applyOrderedDithering(imageData, palette);

// Apply Atkinson dithering
const atkinson = applyAtkinsonDithering(imageData, palette);

// Apply Blue Noise dithering
const blueNoise = applyBlueNoiseDithering(imageData, palette);
```

### With Intensity Control

All dithering functions accept an intensity parameter:

```javascript
// Subtle dithering (50% intensity)
const subtle = applyFloydSteinbergDithering(imageData, palette, findClosestColor, 0.5);

// Standard dithering (100% intensity, default)
const normal = applyBlueNoiseDithering(imageData, palette, findClosestColor, 1.0);

// Strong dithering (150% intensity)
const strong = applyOrderedDithering(imageData, palette, findClosestColor, 4, 1.5);
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

The `generatePaletteVariations` function now accepts a dithering method and intensity:

```javascript
const variations = generatePaletteVariations(
  imageData, 
  palette, 
  'floyd-steinberg',  // or 'ordered', 'atkinson', 'blue-noise', 'none'
  true,               // preserveDistinctness
  1.0                 // dither intensity (0-2)
);
```

## UI Integration

The dithering selector allows users to choose between:

1. **No Dithering** - Clean, sharp transitions
2. **Floyd-Steinberg** - Smooth, recommended for most cases
3. **Ordered/Bayer** - Retro crosshatch pattern
4. **Atkinson** - HyperCard style, preserves highlights
5. **Blue Noise** - Modern, artifact-free dithering

The dither intensity slider appears when a dithering method is selected:
- Range: 0% to 200%
- Default: 100%
- Real-time updates when adjusted

The selection is reactive - changing the dithering method or intensity automatically regenerates all palette variations.

## Performance Considerations

- **Floyd-Steinberg**: Medium speed, requires sequential processing
- **Ordered**: Fastest, can be parallelized
- **Atkinson**: Similar to Floyd-Steinberg, slightly more error distribution
- **Blue Noise**: Fast, no error propagation, easily parallelizable

For large images, consider:
- Using ordered or blue noise dithering for real-time preview
- Applying error diffusion methods (Floyd-Steinberg/Atkinson) for final output
- Downscaling very large images before dithering
- Reducing intensity for faster preview

## Historical Context

- **Floyd-Steinberg** (1976): Developed by Robert Floyd and Louis Steinberg
- **Ordered Dithering** (1973): Based on Bayer's work on halftone patterns
- **Atkinson** (1983): Created by Bill Atkinson for MacPaint/HyperCard
- **Blue Noise** (1980s-1990s): Modern technique based on perceptual research and void-and-cluster algorithms, widely used in rendering and printing

Each algorithm reflects different priorities in the tradeoff between speed, quality, and aesthetic goals. Blue noise represents the state-of-the-art in perceptually-optimized dithering.
