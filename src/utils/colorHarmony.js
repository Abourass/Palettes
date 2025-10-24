import { rgbToHsl, hslToRgb, hexToRgb, rgbToHex } from './colorUtils';

// ========== COLOR HARMONY GENERATION ==========

/**
 * Generate a complementary color scheme (2 colors)
 * Colors opposite on the color wheel (180° apart)
 */
export function generateComplementary(baseColor, variations = 5) {
  const hsl = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
  const palette = [];
  
  // Add base color with variations in lightness
  for (let i = 0; i < Math.ceil(variations / 2); i++) {
    const lightness = Math.max(10, Math.min(90, hsl.l + (i - 1) * 15));
    palette.push(hslToRgb(hsl.h, hsl.s, lightness));
  }
  
  // Add complementary color with variations
  const compHue = (hsl.h + 180) % 360;
  for (let i = 0; i < Math.floor(variations / 2); i++) {
    const lightness = Math.max(10, Math.min(90, hsl.l + (i - 1) * 15));
    palette.push(hslToRgb(compHue, hsl.s, lightness));
  }
  
  return palette;
}

/**
 * Generate an analogous color scheme (3-5 colors)
 * Adjacent colors on the color wheel (typically 30° apart)
 */
export function generateAnalogous(baseColor, count = 5, spread = 30) {
  const hsl = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
  const palette = [];
  
  // Create colors spread around the base hue
  const startOffset = -Math.floor(count / 2) * spread;
  
  for (let i = 0; i < count; i++) {
    const hue = (hsl.h + startOffset + i * spread + 360) % 360;
    
    // Add subtle lightness variation
    const lightnessVariation = Math.sin(i / count * Math.PI) * 15;
    const lightness = Math.max(10, Math.min(90, hsl.l + lightnessVariation));
    
    palette.push(hslToRgb(hue, hsl.s, lightness));
  }
  
  return palette;
}

/**
 * Generate a triadic color scheme (3 colors)
 * Colors evenly spaced on the color wheel (120° apart)
 */
export function generateTriadic(baseColor, includeVariations = true) {
  const hsl = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
  const palette = [];
  
  const hues = [hsl.h, (hsl.h + 120) % 360, (hsl.h + 240) % 360];
  
  if (includeVariations) {
    // Add 2 variations per hue (lighter and darker)
    hues.forEach(hue => {
      palette.push(hslToRgb(hue, hsl.s, Math.max(10, hsl.l - 20)));
      palette.push(hslToRgb(hue, hsl.s, hsl.l));
      palette.push(hslToRgb(hue, hsl.s, Math.min(90, hsl.l + 20)));
    });
  } else {
    // Just the three main colors
    hues.forEach(hue => {
      palette.push(hslToRgb(hue, hsl.s, hsl.l));
    });
  }
  
  return palette;
}

/**
 * Generate a split-complementary color scheme (3 colors)
 * Base color + two colors adjacent to its complement
 */
export function generateSplitComplementary(baseColor, split = 30, includeVariations = true) {
  const hsl = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
  const palette = [];
  
  const complementHue = (hsl.h + 180) % 360;
  const hues = [
    hsl.h,
    (complementHue - split + 360) % 360,
    (complementHue + split) % 360
  ];
  
  if (includeVariations) {
    // Add variations for each hue
    hues.forEach((hue, index) => {
      if (index === 0) {
        // Base color gets more variations
        palette.push(hslToRgb(hue, hsl.s, Math.max(10, hsl.l - 20)));
        palette.push(hslToRgb(hue, hsl.s, hsl.l));
        palette.push(hslToRgb(hue, hsl.s, Math.min(90, hsl.l + 20)));
      } else {
        palette.push(hslToRgb(hue, hsl.s, Math.max(10, hsl.l - 15)));
        palette.push(hslToRgb(hue, hsl.s, Math.min(90, hsl.l + 15)));
      }
    });
  } else {
    hues.forEach(hue => {
      palette.push(hslToRgb(hue, hsl.s, hsl.l));
    });
  }
  
  return palette;
}

/**
 * Generate a tetradic (square) color scheme (4 colors)
 * Four colors evenly spaced on the color wheel (90° apart)
 */
export function generateTetradic(baseColor, includeVariations = true) {
  const hsl = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
  const palette = [];
  
  const hues = [
    hsl.h,
    (hsl.h + 90) % 360,
    (hsl.h + 180) % 360,
    (hsl.h + 270) % 360
  ];
  
  if (includeVariations) {
    // Add 2 variations per hue
    hues.forEach(hue => {
      palette.push(hslToRgb(hue, hsl.s, Math.max(10, hsl.l - 15)));
      palette.push(hslToRgb(hue, hsl.s, hsl.l));
      palette.push(hslToRgb(hue, hsl.s, Math.min(90, hsl.l + 15)));
    });
  } else {
    hues.forEach(hue => {
      palette.push(hslToRgb(hue, hsl.s, hsl.l));
    });
  }
  
  return palette;
}

/**
 * Generate a monochromatic color scheme
 * Single hue with variations in lightness and saturation
 */
export function generateMonochromatic(baseColor, count = 5) {
  const hsl = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
  const palette = [];
  
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    
    // Vary lightness from dark to light
    const lightness = 15 + t * 70;
    
    // Slight saturation variation (more saturated in middle)
    const satVariation = Math.sin(t * Math.PI) * 20;
    const saturation = Math.max(0, Math.min(100, hsl.s + satVariation));
    
    palette.push(hslToRgb(hsl.h, saturation, lightness));
  }
  
  return palette;
}

/**
 * Generate a compound (tetradic rectangle) color scheme
 * Two pairs of complementary colors
 */
export function generateCompound(baseColor, offset = 60) {
  const hsl = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
  const palette = [];
  
  const hues = [
    hsl.h,
    (hsl.h + offset) % 360,
    (hsl.h + 180) % 360,
    (hsl.h + 180 + offset) % 360
  ];
  
  // Add variations for each hue
  hues.forEach(hue => {
    palette.push(hslToRgb(hue, hsl.s, Math.max(10, hsl.l - 15)));
    palette.push(hslToRgb(hue, hsl.s, hsl.l));
    palette.push(hslToRgb(hue, hsl.s, Math.min(90, hsl.l + 15)));
  });
  
  return palette;
}

// ========== PALETTE EXTRACTION FROM IMAGE ==========

/**
 * Extract a palette from an image using k-means clustering
 */
export function extractPaletteFromImage(imageData, colorCount = 8, quality = 10) {
  const pixels = imageData.data;
  const pixelArray = [];
  
  // Sample pixels (every 'quality'th pixel)
  for (let i = 0; i < pixels.length; i += 4 * quality) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    // Skip transparent pixels
    if (a < 128) continue;
    
    pixelArray.push({ r, g, b });
  }
  
  // Apply k-means clustering
  const palette = kMeansClustering(pixelArray, colorCount);
  
  return palette;
}

/**
 * Extract dominant colors using median cut algorithm
 * Better for images with distinct color regions
 */
export function extractPaletteMedianCut(imageData, colorCount = 8) {
  const pixels = imageData.data;
  const pixelArray = [];
  
  // Collect all non-transparent pixels
  for (let i = 0; i < pixels.length; i += 4) {
    const a = pixels[i + 3];
    if (a < 128) continue;
    
    pixelArray.push({
      r: pixels[i],
      g: pixels[i + 1],
      b: pixels[i + 2]
    });
  }
  
  // Apply median cut
  const palette = medianCut(pixelArray, colorCount);
  
  return palette;
}

/**
 * Extract palette and generate harmony from it
 */
export function extractAndHarmonize(imageData, harmonyType = 'analogous') {
  // Extract 3-5 dominant colors
  const extractedColors = extractPaletteFromImage(imageData, 3);
  
  // Use the most dominant color as base
  const baseColor = extractedColors[0];
  
  // Generate harmony based on type
  switch (harmonyType) {
    case 'complementary':
      return generateComplementary(baseColor);
    case 'analogous':
      return generateAnalogous(baseColor);
    case 'triadic':
      return generateTriadic(baseColor);
    case 'split-complementary':
      return generateSplitComplementary(baseColor);
    case 'tetradic':
      return generateTetradic(baseColor);
    case 'monochromatic':
      return generateMonochromatic(baseColor);
    default:
      return extractedColors;
  }
}

// ========== K-MEANS CLUSTERING IMPLEMENTATION ==========

function kMeansClustering(pixels, k, maxIterations = 20) {
  if (pixels.length === 0) return [];
  if (pixels.length <= k) return pixels;
  
  // Initialize centroids with random pixels
  let centroids = [];
  const usedIndices = new Set();
  
  for (let i = 0; i < k; i++) {
    let idx;
    do {
      idx = Math.floor(Math.random() * pixels.length);
    } while (usedIndices.has(idx));
    
    usedIndices.add(idx);
    centroids.push({ ...pixels[idx] });
  }
  
  let clusters = Array(k).fill(null).map(() => []);
  
  // Iterate to convergence
  for (let iter = 0; iter < maxIterations; iter++) {
    // Clear clusters
    clusters = Array(k).fill(null).map(() => []);
    
    // Assign pixels to nearest centroid
    pixels.forEach(pixel => {
      let minDist = Infinity;
      let closestCentroid = 0;
      
      centroids.forEach((centroid, idx) => {
        const dist = colorDistance(pixel, centroid);
        if (dist < minDist) {
          minDist = dist;
          closestCentroid = idx;
        }
      });
      
      clusters[closestCentroid].push(pixel);
    });
    
    // Update centroids
    let changed = false;
    centroids = centroids.map((centroid, idx) => {
      if (clusters[idx].length === 0) return centroid;
      
      const newCentroid = {
        r: Math.round(clusters[idx].reduce((sum, p) => sum + p.r, 0) / clusters[idx].length),
        g: Math.round(clusters[idx].reduce((sum, p) => sum + p.g, 0) / clusters[idx].length),
        b: Math.round(clusters[idx].reduce((sum, p) => sum + p.b, 0) / clusters[idx].length)
      };
      
      if (colorDistance(newCentroid, centroid) > 1) {
        changed = true;
      }
      
      return newCentroid;
    });
    
    if (!changed) break;
  }
  
  // Sort by cluster size (most dominant first)
  const sortedCentroids = centroids
    .map((centroid, idx) => ({ color: centroid, count: clusters[idx].length }))
    .sort((a, b) => b.count - a.count)
    .map(item => item.color);
  
  return sortedCentroids;
}

// ========== MEDIAN CUT IMPLEMENTATION ==========

function medianCut(pixels, targetColors) {
  if (pixels.length === 0) return [];
  if (targetColors === 1 || pixels.length === 1) {
    return [averageColor(pixels)];
  }
  
  // Find the channel with the greatest range
  const ranges = {
    r: { min: 255, max: 0 },
    g: { min: 255, max: 0 },
    b: { min: 255, max: 0 }
  };
  
  pixels.forEach(pixel => {
    ranges.r.min = Math.min(ranges.r.min, pixel.r);
    ranges.r.max = Math.max(ranges.r.max, pixel.r);
    ranges.g.min = Math.min(ranges.g.min, pixel.g);
    ranges.g.max = Math.max(ranges.g.max, pixel.g);
    ranges.b.min = Math.min(ranges.b.min, pixel.b);
    ranges.b.max = Math.max(ranges.b.max, pixel.b);
  });
  
  const rRange = ranges.r.max - ranges.r.min;
  const gRange = ranges.g.max - ranges.g.min;
  const bRange = ranges.b.max - ranges.b.min;
  
  // Sort by the channel with the greatest range
  let sortChannel = 'r';
  let maxRange = rRange;
  
  if (gRange > maxRange) {
    sortChannel = 'g';
    maxRange = gRange;
  }
  if (bRange > maxRange) {
    sortChannel = 'b';
  }
  
  pixels.sort((a, b) => a[sortChannel] - b[sortChannel]);
  
  // Split at median
  const mid = Math.floor(pixels.length / 2);
  const left = pixels.slice(0, mid);
  const right = pixels.slice(mid);
  
  // Recursively split
  const colorsPerSide = Math.floor(targetColors / 2);
  return [
    ...medianCut(left, colorsPerSide),
    ...medianCut(right, targetColors - colorsPerSide)
  ];
}

function averageColor(pixels) {
  if (pixels.length === 0) return { r: 0, g: 0, b: 0 };
  
  const sum = pixels.reduce(
    (acc, pixel) => ({
      r: acc.r + pixel.r,
      g: acc.g + pixel.g,
      b: acc.b + pixel.b
    }),
    { r: 0, g: 0, b: 0 }
  );
  
  return {
    r: Math.round(sum.r / pixels.length),
    g: Math.round(sum.g / pixels.length),
    b: Math.round(sum.b / pixels.length)
  };
}

function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

// ========== GENERATE FROM SINGLE COLOR ==========

/**
 * Generate all harmony types from a single color
 */
export function generateAllHarmonies(baseColor) {
  return {
    complementary: generateComplementary(baseColor, 6),
    analogous: generateAnalogous(baseColor, 6),
    triadic: generateTriadic(baseColor, true),
    splitComplementary: generateSplitComplementary(baseColor, 30, true),
    tetradic: generateTetradic(baseColor, true),
    monochromatic: generateMonochromatic(baseColor, 6),
    compound: generateCompound(baseColor, 60)
  };
}

/**
 * Generate a palette from hex color string
 */
export function generatePaletteFromHex(hexColor, harmonyType = 'complementary') {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return null;
  
  switch (harmonyType) {
    case 'complementary':
      return generateComplementary(rgb);
    case 'analogous':
      return generateAnalogous(rgb);
    case 'triadic':
      return generateTriadic(rgb);
    case 'split-complementary':
      return generateSplitComplementary(rgb);
    case 'tetradic':
      return generateTetradic(rgb);
    case 'monochromatic':
      return generateMonochromatic(rgb);
    case 'compound':
      return generateCompound(rgb);
    default:
      return [rgb];
  }
}
