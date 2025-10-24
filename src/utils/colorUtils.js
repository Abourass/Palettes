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

// Find closest color in palette
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
