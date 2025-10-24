// Color Harmony Usage Examples

import {
  generateComplementary,
  generateAnalogous,
  generateTriadic,
  generateSplitComplementary,
  generateTetradic,
  generateMonochromatic,
  generateCompound,
  generateAllHarmonies,
  extractPaletteFromImage,
  extractPaletteMedianCut,
  extractAndHarmonize,
  generatePaletteFromHex
} from './utils/colorHarmony';

// ========== EXAMPLE 1: Generate Complementary Palette ==========
function example1_complementary() {
  const baseColor = { r: 52, g: 152, b: 219 }; // Blue
  const palette = generateComplementary(baseColor, 6);
  
  // Result: ~3 blue variations + ~3 orange variations
  console.log('Complementary palette:', palette);
  // [
  //   { r: 37, g: 137, b: 204 },   // Darker blue
  //   { r: 52, g: 152, b: 219 },   // Base blue
  //   { r: 67, g: 167, b: 234 },   // Lighter blue
  //   { r: 204, g: 119, b: 37 },   // Darker orange
  //   { r: 219, g: 134, b: 52 },   // Base orange
  //   { r: 234, g: 149, b: 67 }    // Lighter orange
  // ]
}

// ========== EXAMPLE 2: Generate Analogous Palette ==========
function example2_analogous() {
  const baseColor = { r: 46, g: 204, b: 113 }; // Green
  const palette = generateAnalogous(baseColor, 5, 30);
  
  // Result: 5 colors around green (yellow-green to blue-green)
  console.log('Analogous palette:', palette);
  // Creates smooth, harmonious nature-inspired colors
}

// ========== EXAMPLE 3: Generate Triadic Palette ==========
function example3_triadic() {
  const baseColor = { r: 231, g: 76, b: 60 }; // Red
  
  // With variations (9 colors total)
  const paletteWithVariations = generateTriadic(baseColor, true);
  console.log('Triadic with variations:', paletteWithVariations.length); // 9
  
  // Without variations (just 3 colors)
  const paletteSimple = generateTriadic(baseColor, false);
  console.log('Triadic simple:', paletteSimple.length); // 3
  // Result: Red, Yellow, Blue
}

// ========== EXAMPLE 4: Generate All Harmonies at Once ==========
function example4_allHarmonies() {
  const baseColor = { r: 155, g: 89, b: 182 }; // Purple
  const harmonies = generateAllHarmonies(baseColor);
  
  console.log('Available harmonies:', Object.keys(harmonies));
  // ['complementary', 'analogous', 'triadic', 'splitComplementary', 
  //  'tetradic', 'monochromatic', 'compound']
  
  // Access specific harmony
  const monochromaticPalette = harmonies.monochromatic;
  console.log('Monochromatic palette:', monochromaticPalette);
}

// ========== EXAMPLE 5: Generate from Hex String ==========
function example5_fromHex() {
  const hexColor = '#e74c3c'; // Red
  const palette = generatePaletteFromHex(hexColor, 'complementary');
  
  console.log('Palette from hex:', palette);
}

// ========== EXAMPLE 6: Extract Colors from Image (K-Means) ==========
async function example6_extractKMeans(imageElement) {
  // Get image data from canvas
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Extract 8 dominant colors using K-Means
  const palette = extractPaletteFromImage(imageData, 8, 10);
  console.log('Extracted colors (K-Means):', palette);
  
  // Result: Array of 8 RGB colors sorted by dominance
}

// ========== EXAMPLE 7: Extract Colors from Image (Median Cut) ==========
async function example7_extractMedianCut(imageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Extract 8 dominant colors using Median Cut
  const palette = extractPaletteMedianCut(imageData, 8);
  console.log('Extracted colors (Median Cut):', palette);
}

// ========== EXAMPLE 8: Extract and Generate Harmonies ==========
async function example8_extractAndHarmonize(imageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Extract colors and generate analogous harmony
  const harmonyPalette = extractAndHarmonize(imageData, 'analogous');
  console.log('Harmony from image:', harmonyPalette);
}

// ========== EXAMPLE 9: Create Retro Game Palette ==========
function example9_retroGame() {
  // Start with a retro red
  const baseColor = { r: 255, g: 107, b: 107 };
  
  // Generate triadic for classic primary colors
  const palette = generateTriadic(baseColor, true);
  
  // Perfect for 8-bit/16-bit game aesthetic
  console.log('Retro game palette:', palette);
}

// ========== EXAMPLE 10: Create Nature-Inspired Palette ==========
function example10_nature() {
  // Start with forest green
  const baseColor = { r: 39, g: 174, b: 96 };
  
  // Analogous creates natural, harmonious colors
  const palette = generateAnalogous(baseColor, 6, 25);
  
  console.log('Nature palette:', palette);
  // Result: Various greens, yellows, and teals
}

// ========== EXAMPLE 11: Create Professional Brand Palette ==========
function example11_branding() {
  // Start with brand color
  const brandColor = { r: 41, g: 128, b: 185 }; // Professional blue
  
  // Generate all harmonies to explore options
  const harmonies = generateAllHarmonies(brandColor);
  
  // Use monochromatic for cohesive look
  const primaryPalette = harmonies.monochromatic;
  
  // Use split-complementary for accent colors
  const accentPalette = harmonies.splitComplementary;
  
  console.log('Brand palette (primary):', primaryPalette);
  console.log('Brand palette (accents):', accentPalette);
}

// ========== EXAMPLE 12: Create Sunset Palette from Photo ==========
async function example12_sunsetPalette(sunsetPhoto) {
  const canvas = document.createElement('canvas');
  canvas.width = sunsetPhoto.width;
  canvas.height = sunsetPhoto.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(sunsetPhoto, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // K-Means works better for gradients like sunsets
  const extractedColors = extractPaletteFromImage(imageData, 6, 5);
  
  console.log('Sunset colors:', extractedColors);
  
  // Generate complementary harmony for dramatic effect
  const baseColor = extractedColors[0]; // Most dominant color
  const harmonyPalette = generateComplementary(baseColor, 8);
  
  console.log('Sunset harmony palette:', harmonyPalette);
}

// ========== EXAMPLE 13: Combine Multiple Techniques ==========
async function example13_combined(imageElement, userBaseColor) {
  // 1. Extract colors from reference image
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  const extractedPalette = extractPaletteFromImage(imageData, 5);
  
  // 2. Generate harmonies from extracted colors
  const imageDominantColor = extractedPalette[0];
  const imageHarmonies = generateAllHarmonies(imageDominantColor);
  
  // 3. Generate harmonies from user's chosen color
  const userHarmonies = generateAllHarmonies(userBaseColor);
  
  // 4. Compare and choose best palette
  return {
    extracted: extractedPalette,
    fromImage: imageHarmonies,
    fromUser: userHarmonies,
    // Suggested: triadic from image for variety
    suggested: imageHarmonies.triadic
  };
}

// ========== EXAMPLE 14: Color Picker Integration ==========
function example14_colorPicker() {
  // HTML: <input type="color" id="colorPicker" value="#3498db">
  
  const colorPicker = document.getElementById('colorPicker');
  
  colorPicker.addEventListener('change', (e) => {
    const hexColor = e.target.value;
    const palette = generatePaletteFromHex(hexColor, 'analogous');
    
    // Display palette
    displayPalette(palette);
  });
}

function displayPalette(palette) {
  const container = document.getElementById('paletteDisplay');
  container.innerHTML = '';
  
  palette.forEach(color => {
    const swatch = document.createElement('div');
    swatch.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    swatch.style.width = '50px';
    swatch.style.height = '50px';
    swatch.style.display = 'inline-block';
    container.appendChild(swatch);
  });
}

// ========== EXAMPLE 15: Batch Generate for User Options ==========
function example15_batchGenerate(baseColor) {
  const harmonies = generateAllHarmonies(baseColor);
  
  // Create options for user to choose from
  const options = Object.entries(harmonies).map(([name, palette]) => ({
    name: formatHarmonyName(name),
    palette: palette,
    colorCount: palette.length,
    preview: palette.slice(0, 5) // First 5 colors for preview
  }));
  
  return options;
}

function formatHarmonyName(name) {
  const names = {
    complementary: 'Complementary',
    analogous: 'Analogous',
    triadic: 'Triadic',
    splitComplementary: 'Split-Complementary',
    tetradic: 'Tetradic (Square)',
    monochromatic: 'Monochromatic',
    compound: 'Compound'
  };
  return names[name] || name;
}

// ========== EXAMPLE 16: Validate and Adjust Colors ==========
function example16_validateAndAdjust(palette) {
  // Ensure no colors are too dark or too light
  const adjustedPalette = palette.map(color => {
    const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
    
    if (luminance < 20) {
      // Too dark, lighten it
      return {
        r: Math.min(255, color.r + 30),
        g: Math.min(255, color.g + 30),
        b: Math.min(255, color.b + 30)
      };
    } else if (luminance > 235) {
      // Too light, darken it
      return {
        r: Math.max(0, color.r - 30),
        g: Math.max(0, color.g - 30),
        b: Math.max(0, color.b - 30)
      };
    }
    
    return color;
  });
  
  return adjustedPalette;
}

export {
  example1_complementary,
  example2_analogous,
  example3_triadic,
  example4_allHarmonies,
  example5_fromHex,
  example6_extractKMeans,
  example7_extractMedianCut,
  example8_extractAndHarmonize,
  example9_retroGame,
  example10_nature,
  example11_branding,
  example12_sunsetPalette,
  example13_combined,
  example14_colorPicker,
  example15_batchGenerate,
  example16_validateAndAdjust
};
