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

// Apply palette to image
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

// Apply palette with custom matching strategy
export function applyPaletteWithStrategy(imageData, palette, matchingFunction) {
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

// Generate all 6 variations using different strategies
export function generatePaletteVariations(imageData, palette) {
  return [
    {
      name: 'Luminosity Match',
      description: 'Matches by brightness, preserving light/dark contrast',
      imageData: applyPaletteWithStrategy(imageData, palette, findClosestByLuminosity)
    },
    {
      name: 'Hue Match',
      description: 'Matches by color family, preserving the mood',
      imageData: applyPaletteWithStrategy(imageData, palette, findClosestByHue)
    },
    {
      name: 'Saturation Match',
      description: 'Matches by color vividness (vibrant vs muted)',
      imageData: applyPaletteWithStrategy(imageData, palette, findClosestBySaturation)
    },
    {
      name: 'Inverted Luminosity',
      description: 'Inverts brightness (dark becomes light, light becomes dark)',
      imageData: applyPaletteWithStrategy(imageData, palette, findInvertedLuminosity)
    },
    {
      name: 'Complementary Hue',
      description: 'Maps to opposite colors on the color wheel',
      imageData: applyPaletteWithStrategy(imageData, palette, findComplementaryHue)
    },
    {
      name: 'Perceptual Match',
      description: 'Standard RGB distance matching',
      imageData: applyPaletteWithStrategy(imageData, palette, findClosestColor)
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
      
      // Adjust hue slightly
      hsl.h = (hsl.h + (i + 1) * 30) % 360;
      
      // Slight saturation adjustment
      hsl.s = Math.max(0, Math.min(100, hsl.s + (i % 2 === 0 ? 10 : -10)));
      
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
