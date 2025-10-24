// Extract dominant colors from an image
export function extractColors(imageData, maxColors = 16) {
  const pixels = imageData.data;
  const colorMap = new Map();

  // Sample pixels and count occurrences
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // Sort by frequency and return top colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxColors)
    .map(([color]) => {
      const [r, g, b] = color.split(',').map(Number);
      return { r, g, b };
    });

  return sortedColors;
}

// Convert RGB to hex
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Convert hex to RGB
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate color distance (Euclidean)
export function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

// Calculate perceived luminance (brightness)
export function getLuminance(color) {
  // Standard luminance formula accounting for human eye sensitivity
  return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
}

// Calculate saturation from RGB
export function getSaturation(color) {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  if (max === 0) return 0;
  return (max - min) / max;
}

// Get hue from RGB (returns 0-360)
export function getHue(color) {
  const hsl = rgbToHsl(color.r, color.g, color.b);
  return hsl.h;
}

// Calculate circular hue distance (accounts for 360° wraparound)
export function hueDistance(h1, h2) {
  const diff = Math.abs(h1 - h2);
  return Math.min(diff, 360 - diff);
}

// Find closest color in palette (standard Euclidean RGB distance)
export function findClosestColor(color, palette) {
  let minDistance = Infinity;
  let closestColor = palette[0];

  for (const paletteColor of palette) {
    const distance = colorDistance(color, paletteColor);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
}

// Find closest color by luminosity (brightness matching)
export function findClosestByLuminosity(color, palette) {
  const targetLuminance = getLuminance(color);
  let minDistance = Infinity;
  let closestColor = palette[0];

  for (const paletteColor of palette) {
    const distance = Math.abs(getLuminance(paletteColor) - targetLuminance);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
}

// Find closest color by hue (color family matching)
export function findClosestByHue(color, palette) {
  const targetHue = getHue(color);
  const targetLuminance = getLuminance(color);
  let minDistance = Infinity;
  let closestColor = palette[0];

  for (const paletteColor of palette) {
    const paletteHue = getHue(paletteColor);
    const paletteLuminance = getLuminance(paletteColor);
    
    // Weight hue heavily, luminance as tiebreaker
    const hueDist = hueDistance(targetHue, paletteHue);
    const lumDist = Math.abs(targetLuminance - paletteLuminance) / 255;
    const distance = hueDist + (lumDist * 10); // Hue is primary, luminance secondary
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
}

// Find closest color by saturation
export function findClosestBySaturation(color, palette) {
  const targetSaturation = getSaturation(color);
  const targetLuminance = getLuminance(color);
  let minDistance = Infinity;
  let closestColor = palette[0];

  for (const paletteColor of palette) {
    const satDist = Math.abs(getSaturation(paletteColor) - targetSaturation);
    const lumDist = Math.abs(getLuminance(paletteColor) - targetLuminance) / 255;
    const distance = satDist + (lumDist * 0.5); // Saturation primary, luminance secondary
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
}

// Find inverted luminosity match (dark -> light, light -> dark)
export function findInvertedLuminosity(color, palette) {
  const targetLuminance = 255 - getLuminance(color); // Invert brightness
  let minDistance = Infinity;
  let closestColor = palette[0];

  for (const paletteColor of palette) {
    const distance = Math.abs(getLuminance(paletteColor) - targetLuminance);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
}

// Find complementary hue match (opposite on color wheel)
export function findComplementaryHue(color, palette) {
  const targetHue = (getHue(color) + 180) % 360; // Opposite hue
  const targetLuminance = getLuminance(color);
  let minDistance = Infinity;
  let closestColor = palette[0];

  for (const paletteColor of palette) {
    const paletteHue = getHue(paletteColor);
    const paletteLuminance = getLuminance(paletteColor);
    
    const hueDist = hueDistance(targetHue, paletteHue);
    const lumDist = Math.abs(targetLuminance - paletteLuminance) / 255;
    const distance = hueDist + (lumDist * 10);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
}

// Weighted RGB distance with custom channel emphasis
export function findWeightedRGB(color, palette, weights = { r: 1, g: 1, b: 1 }) {
  let minDistance = Infinity;
  let closestColor = palette[0];

  for (const paletteColor of palette) {
    const distance = Math.sqrt(
      Math.pow((color.r - paletteColor.r) * weights.r, 2) +
      Math.pow((color.g - paletteColor.g) * weights.g, 2) +
      Math.pow((color.b - paletteColor.b) * weights.b, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
}

// Create optimal color mapping that preserves distinctness
// Uses greedy assignment - each source color gets its best available match
export function createColorMapping(sourceColors, targetPalette, matchingFunction = findClosestColor) {
  const mapping = new Map();
  const usedPaletteColors = new Set();
  
  // Sort source colors by frequency (most common first) for better results
  const sortedSources = [...sourceColors].sort((a, b) => (b.count || 0) - (a.count || 0));
  
  for (const sourceColor of sortedSources) {
    const sourceKey = `${sourceColor.r},${sourceColor.g},${sourceColor.b}`;
    
    // Find the best available match using the provided matching function
    let bestMatch = null;
    let bestDistance = Infinity;
    
    // Get available (unused) palette colors
    const availablePaletteColors = targetPalette.filter(paletteColor => {
      const paletteKey = `${paletteColor.r},${paletteColor.g},${paletteColor.b}`;
      return !usedPaletteColors.has(paletteKey);
    });
    
    // If we have available colors, find the best match among them
    if (availablePaletteColors.length > 0) {
      // Use the matching function to find best match from available colors
      bestMatch = matchingFunction(sourceColor, availablePaletteColors);
    } else {
      // No available colors left - fall back to any color from full palette
      bestMatch = matchingFunction(sourceColor, targetPalette);
    }
    
    const matchKey = `${bestMatch.r},${bestMatch.g},${bestMatch.b}`;
    usedPaletteColors.add(matchKey);
    mapping.set(sourceKey, bestMatch);
  }
  
  return mapping;
}

// Apply palette to image (basic version - processes all pixels)
export function applyPalette(imageData, palette) {
  const newImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  const pixels = newImageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    const currentColor = { r, g, b };
    const closestColor = findClosestColor(currentColor, palette);

    pixels[i] = closestColor.r;
    pixels[i + 1] = closestColor.g;
    pixels[i + 2] = closestColor.b;
  }

  return newImageData;
}

// Smart palette application that preserves color distinctness
// Extracts unique colors first, creates optimal mapping, then applies it
export function applyPalettePreserveDistinctness(imageData, palette, matchingFunction = findClosestColor) {
  // Extract all unique colors from the image
  const uniqueColors = extractColors(imageData, 256); // Get all unique colors
  
  // Create optimal mapping
  const colorMapping = createColorMapping(uniqueColors, palette, matchingFunction);
  
  // Apply mapping
  const newImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  const pixels = newImageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    const colorKey = `${r},${g},${b}`;
    const mappedColor = colorMapping.get(colorKey);
    
    if (mappedColor) {
      pixels[i] = mappedColor.r;
      pixels[i + 1] = mappedColor.g;
      pixels[i + 2] = mappedColor.b;
    }
  }

  return newImageData;
}

// Floyd-Steinberg dithering - distributes quantization error to neighboring pixels
export function applyFloydSteinbergDithering(imageData, palette, matchingFunction = findClosestColor) {
  const width = imageData.width;
  const height = imageData.height;
  const newImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  const pixels = newImageData.data;

  // Helper to get pixel index
  const getIndex = (x, y) => (y * width + x) * 4;

  // Helper to distribute error to a neighboring pixel
  const distributeError = (x, y, errorR, errorG, errorB, factor) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    
    const idx = getIndex(x, y);
    const alpha = pixels[idx + 3];
    
    // Only distribute to non-transparent pixels
    if (alpha >= 128) {
      pixels[idx] = Math.max(0, Math.min(255, pixels[idx] + errorR * factor));
      pixels[idx + 1] = Math.max(0, Math.min(255, pixels[idx + 1] + errorG * factor));
      pixels[idx + 2] = Math.max(0, Math.min(255, pixels[idx + 2] + errorB * factor));
    }
  };

  // Process pixels left-to-right, top-to-bottom
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = getIndex(x, y);
      
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const a = pixels[idx + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      // Find closest palette color
      const currentColor = { r, g, b };
      const closestColor = matchingFunction(currentColor, palette);

      // Calculate quantization error
      const errorR = r - closestColor.r;
      const errorG = g - closestColor.g;
      const errorB = b - closestColor.b;

      // Set the pixel to the palette color
      pixels[idx] = closestColor.r;
      pixels[idx + 1] = closestColor.g;
      pixels[idx + 2] = closestColor.b;

      // Distribute error to neighboring pixels (Floyd-Steinberg matrix)
      //        X    7/16
      // 3/16  5/16  1/16
      distributeError(x + 1, y, errorR, errorG, errorB, 7/16);
      distributeError(x - 1, y + 1, errorR, errorG, errorB, 3/16);
      distributeError(x, y + 1, errorR, errorG, errorB, 5/16);
      distributeError(x + 1, y + 1, errorR, errorG, errorB, 1/16);
    }
  }

  return newImageData;
}

// Ordered/Bayer dithering - uses a threshold map for retro aesthetic
export function applyOrderedDithering(imageData, palette, matchingFunction = findClosestColor, matrixSize = 4) {
  const width = imageData.width;
  const height = imageData.height;
  const newImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  const pixels = newImageData.data;

  // Bayer matrices for ordered dithering
  const bayer2x2 = [
    [0, 2],
    [3, 1]
  ];

  const bayer4x4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  const bayer8x8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
  ];

  // Select appropriate Bayer matrix
  let bayerMatrix, matrixDivisor;
  if (matrixSize === 2) {
    bayerMatrix = bayer2x2;
    matrixDivisor = 4;
  } else if (matrixSize === 8) {
    bayerMatrix = bayer8x8;
    matrixDivisor = 64;
  } else {
    bayerMatrix = bayer4x4;
    matrixDivisor = 16;
  }

  const matrixLen = bayerMatrix.length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const a = pixels[idx + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      // Get threshold from Bayer matrix
      const threshold = (bayerMatrix[y % matrixLen][x % matrixLen] / matrixDivisor - 0.5) * 64;

      // Apply threshold to color
      const ditheredColor = {
        r: Math.max(0, Math.min(255, r + threshold)),
        g: Math.max(0, Math.min(255, g + threshold)),
        b: Math.max(0, Math.min(255, b + threshold))
      };

      // Find closest palette color
      const closestColor = matchingFunction(ditheredColor, palette);

      pixels[idx] = closestColor.r;
      pixels[idx + 1] = closestColor.g;
      pixels[idx + 2] = closestColor.b;
    }
  }

  return newImageData;
}

// Atkinson dithering - HyperCard/MacPaint style (preserves highlights better)
export function applyAtkinsonDithering(imageData, palette, matchingFunction = findClosestColor) {
  const width = imageData.width;
  const height = imageData.height;
  const newImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  const pixels = newImageData.data;

  // Helper to get pixel index
  const getIndex = (x, y) => (y * width + x) * 4;

  // Helper to distribute error to a neighboring pixel
  const distributeError = (x, y, errorR, errorG, errorB, factor) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    
    const idx = getIndex(x, y);
    const alpha = pixels[idx + 3];
    
    // Only distribute to non-transparent pixels
    if (alpha >= 128) {
      pixels[idx] = Math.max(0, Math.min(255, pixels[idx] + errorR * factor));
      pixels[idx + 1] = Math.max(0, Math.min(255, pixels[idx + 1] + errorG * factor));
      pixels[idx + 2] = Math.max(0, Math.min(255, pixels[idx + 2] + errorB * factor));
    }
  };

  // Process pixels left-to-right, top-to-bottom
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = getIndex(x, y);
      
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const a = pixels[idx + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      // Find closest palette color
      const currentColor = { r, g, b };
      const closestColor = matchingFunction(currentColor, palette);

      // Calculate quantization error
      const errorR = r - closestColor.r;
      const errorG = g - closestColor.g;
      const errorB = b - closestColor.b;

      // Set the pixel to the palette color
      pixels[idx] = closestColor.r;
      pixels[idx + 1] = closestColor.g;
      pixels[idx + 2] = closestColor.b;

      // Distribute error to neighboring pixels (Atkinson matrix)
      // Only distributes 75% of error (6/8), creating lighter results
      //       X   1/8  1/8
      // 1/8  1/8  1/8
      //      1/8
      const factor = 1/8;
      distributeError(x + 1, y, errorR, errorG, errorB, factor);
      distributeError(x + 2, y, errorR, errorG, errorB, factor);
      distributeError(x - 1, y + 1, errorR, errorG, errorB, factor);
      distributeError(x, y + 1, errorR, errorG, errorB, factor);
      distributeError(x + 1, y + 1, errorR, errorG, errorB, factor);
      distributeError(x, y + 2, errorR, errorG, errorB, factor);
    }
  }

  return newImageData;
}

// Apply palette with custom matching strategy and optional dithering
export function applyPaletteWithStrategy(imageData, palette, matchingFunction, ditheringMethod = 'none', preserveDistinctness = true) {
  // For dithering, we need to process pixel-by-pixel (can't pre-map)
  if (ditheringMethod === 'floyd-steinberg') {
    return applyFloydSteinbergDithering(imageData, palette, matchingFunction);
  } else if (ditheringMethod === 'ordered' || ditheringMethod === 'bayer') {
    return applyOrderedDithering(imageData, palette, matchingFunction);
  } else if (ditheringMethod === 'atkinson') {
    return applyAtkinsonDithering(imageData, palette, matchingFunction);
  }
  
  // No dithering - use smart mapping to preserve color distinctness
  if (preserveDistinctness) {
    return applyPalettePreserveDistinctness(imageData, palette, matchingFunction);
  }
  
  // Fallback: direct color replacement (old behavior)
  const newImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  const pixels = newImageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    const currentColor = { r, g, b };
    const closestColor = matchingFunction(currentColor, palette);

    pixels[i] = closestColor.r;
    pixels[i + 1] = closestColor.g;
    pixels[i + 2] = closestColor.b;
  }

  return newImageData;
}

// Generate all 6 variations using different strategies, with optional dithering
export function generatePaletteVariations(imageData, palette, ditheringMethod = 'none', preserveDistinctness = true) {
  return [
    {
      name: 'Luminosity Match',
      description: 'Matches by brightness, preserving light/dark contrast',
      imageData: applyPaletteWithStrategy(imageData, palette, findClosestByLuminosity, ditheringMethod, preserveDistinctness)
    },
    {
      name: 'Hue Match',
      description: 'Matches by color family, preserving the mood',
      imageData: applyPaletteWithStrategy(imageData, palette, findClosestByHue, ditheringMethod, preserveDistinctness)
    },
    {
      name: 'Saturation Match',
      description: 'Matches by color vividness (vibrant vs muted)',
      imageData: applyPaletteWithStrategy(imageData, palette, findClosestBySaturation, ditheringMethod, preserveDistinctness)
    },
    {
      name: 'Inverted Luminosity',
      description: 'Inverts brightness (dark becomes light, light becomes dark)',
      imageData: applyPaletteWithStrategy(imageData, palette, findInvertedLuminosity, ditheringMethod, preserveDistinctness)
    },
    {
      name: 'Complementary Hue',
      description: 'Maps to opposite colors on the color wheel',
      imageData: applyPaletteWithStrategy(imageData, palette, findComplementaryHue, ditheringMethod, preserveDistinctness)
    },
    {
      name: 'Perceptual Match',
      description: 'Standard RGB distance matching',
      imageData: applyPaletteWithStrategy(imageData, palette, findClosestColor, ditheringMethod, preserveDistinctness)
    }
  ];
}

// Generate similar palettes by adjusting hue, saturation, brightness
export function generateSimilarPalettes(palette, count = 3) {
  const palettes = [];
  
  for (let i = 0; i < count; i++) {
    const newPalette = palette.map(color => {
      // Convert to HSL for easier manipulation
      const hsl = rgbToHsl(color.r, color.g, color.b);
      
      // Create more variation with 6 palettes:
      // - Variations 1-3: Hue shifts of 30°, 60°, 90°
      // - Variations 4-6: Hue shifts of 120°, 150°, 180° (more dramatic)
      const hueShift = (i + 1) * 30;
      hsl.h = (hsl.h + hueShift) % 360;
      
      // Alternate saturation adjustments for more diversity
      if (i < 3) {
        // First 3: subtle saturation changes
        hsl.s = Math.max(0, Math.min(100, hsl.s + (i % 2 === 0 ? 10 : -10)));
      } else {
        // Last 3: more dramatic saturation and lightness changes
        hsl.s = Math.max(0, Math.min(100, hsl.s + ((i % 2 === 0 ? 15 : -15))));
        hsl.l = Math.max(0, Math.min(100, hsl.l + ((i % 3 === 0 ? 5 : -5))));
      }
      
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      return rgb;
    });
    
    palettes.push(newPalette);
  }
  
  return palettes;
}

// RGB to HSL conversion
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// HSL to RGB conversion
export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Parse hex color file (simple format: one hex per line)
export function parseHexColorFile(text) {
  const lines = text.split('\n');
  const colors = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.startsWith('#')) {
      const rgb = hexToRgb(trimmed);
      if (rgb) {
        colors.push(rgb);
      }
    }
  }
  
  return colors;
}
