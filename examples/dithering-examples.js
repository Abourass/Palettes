// Dithering Examples - How to use the new dithering functions

import {
  applyFloydSteinbergDithering,
  applyOrderedDithering,
  applyAtkinsonDithering,
  applyPaletteWithStrategy,
  generatePaletteVariations,
  findClosestByHue,
  findClosestByLuminosity,
  findClosestColor
} from './utils/colorUtils';

// Example 1: Basic dithering without custom matching
function basicDithering(imageData, palette) {
  // Floyd-Steinberg - best for smooth gradients
  const floydSteinberg = applyFloydSteinbergDithering(imageData, palette);
  
  // Ordered/Bayer - retro aesthetic
  const ordered = applyOrderedDithering(imageData, palette);
  
  // Atkinson - HyperCard style
  const atkinson = applyAtkinsonDithering(imageData, palette);
  
  return { floydSteinberg, ordered, atkinson };
}

// Example 2: Dithering with custom color matching
function ditheringWithCustomMatching(imageData, palette) {
  // Floyd-Steinberg with hue matching
  const hueMatch = applyFloydSteinbergDithering(
    imageData, 
    palette, 
    findClosestByHue
  );
  
  // Ordered with luminosity matching
  const lumMatch = applyOrderedDithering(
    imageData, 
    palette, 
    findClosestByLuminosity
  );
  
  // Atkinson with standard RGB matching
  const rgbMatch = applyAtkinsonDithering(
    imageData, 
    palette, 
    findClosestColor
  );
  
  return { hueMatch, lumMatch, rgbMatch };
}

// Example 3: Using different Bayer matrix sizes
function orderedDitheringVariations(imageData, palette) {
  // 2×2 matrix - coarse, visible pattern
  const bayer2x2 = applyOrderedDithering(imageData, palette, findClosestColor, 2);
  
  // 4×4 matrix - balanced (default)
  const bayer4x4 = applyOrderedDithering(imageData, palette, findClosestColor, 4);
  
  // 8×8 matrix - fine, subtle pattern
  const bayer8x8 = applyOrderedDithering(imageData, palette, findClosestColor, 8);
  
  return { bayer2x2, bayer4x4, bayer8x8 };
}

// Example 4: Using applyPaletteWithStrategy for conditional dithering
function adaptiveDithering(imageData, palette, userPreference) {
  let ditheringMethod = 'none';
  let matchingFunction = findClosestColor;
  
  // Choose dithering based on user preference or image type
  if (userPreference === 'smooth') {
    ditheringMethod = 'floyd-steinberg';
    matchingFunction = findClosestByLuminosity;
  } else if (userPreference === 'retro') {
    ditheringMethod = 'ordered';
    matchingFunction = findClosestColor;
  } else if (userPreference === 'artistic') {
    ditheringMethod = 'atkinson';
    matchingFunction = findClosestByHue;
  }
  
  return applyPaletteWithStrategy(
    imageData, 
    palette, 
    matchingFunction, 
    ditheringMethod
  );
}

// Example 5: Generating all variations with dithering
function generateAllVariations(imageData, palette) {
  // Without dithering
  const noditherVariations = generatePaletteVariations(imageData, palette, 'none');
  
  // With Floyd-Steinberg dithering
  const smoothVariations = generatePaletteVariations(imageData, palette, 'floyd-steinberg');
  
  // With ordered dithering
  const retroVariations = generatePaletteVariations(imageData, palette, 'ordered');
  
  // With Atkinson dithering
  const hypercardVariations = generatePaletteVariations(imageData, palette, 'atkinson');
  
  return {
    noditherVariations,    // 6 color matching strategies, no dithering
    smoothVariations,      // 6 color matching strategies, Floyd-Steinberg
    retroVariations,       // 6 color matching strategies, Ordered
    hypercardVariations    // 6 color matching strategies, Atkinson
  };
  // Total: 24 variations (6 strategies × 4 dithering methods)
}

// Example 6: Reactive UI pattern (like in App.jsx)
function reactiveUIPattern() {
  // State signals (using SolidJS)
  const [ditheringMethod, setDitheringMethod] = createSignal('none');
  const [currentPalette, setCurrentPalette] = createSignal(null);
  const [imageData, setImageData] = createSignal(null);
  
  // Handler for dithering change
  const handleDitheringChange = (method) => {
    setDitheringMethod(method);
    
    // Regenerate variations when dithering changes
    if (currentPalette() && imageData()) {
      const variations = generatePaletteVariations(
        imageData(), 
        currentPalette(), 
        method
      );
      
      // Update UI with new variations
      updateGallery(variations);
    }
  };
  
  return { handleDitheringChange };
}

// Example 7: Batch processing multiple images
async function batchProcessImages(images, palette, ditheringMethod = 'floyd-steinberg') {
  const results = [];
  
  for (const image of images) {
    // Load image data
    const imageData = await loadImageData(image);
    
    // Apply dithering with the selected method
    const processed = applyPaletteWithStrategy(
      imageData,
      palette,
      findClosestColor,
      ditheringMethod
    );
    
    results.push(processed);
  }
  
  return results;
}

// Example 8: Creating a comparison view
function createComparisonView(imageData, palette) {
  return {
    original: imageData,
    noDithering: applyPaletteWithStrategy(imageData, palette, findClosestColor, 'none'),
    floydSteinberg: applyPaletteWithStrategy(imageData, palette, findClosestColor, 'floyd-steinberg'),
    ordered: applyPaletteWithStrategy(imageData, palette, findClosestColor, 'ordered'),
    atkinson: applyPaletteWithStrategy(imageData, palette, findClosestColor, 'atkinson')
  };
}

// Example 9: Progressive enhancement
function progressiveProcessing(imageData, palette) {
  // Start with fast preview (no dithering or ordered)
  const quickPreview = applyOrderedDithering(imageData, palette);
  
  // Show preview to user immediately
  displayPreview(quickPreview);
  
  // Then compute high-quality version in background
  setTimeout(() => {
    const highQuality = applyFloydSteinbergDithering(imageData, palette);
    displayFinal(highQuality);
  }, 0);
}

// Example 10: Conditional dithering based on image characteristics
function smartDithering(imageData, palette) {
  // Analyze image
  const hasGradients = detectGradients(imageData);
  const isPixelArt = detectPixelArt(imageData);
  const colorCount = countUniqueColors(imageData);
  
  let ditheringMethod;
  
  if (isPixelArt) {
    // Pixel art - preserve sharp edges
    ditheringMethod = 'none';
  } else if (hasGradients || colorCount > 100) {
    // Photos or complex images - smooth dithering
    ditheringMethod = 'floyd-steinberg';
  } else {
    // Simple images - retro look
    ditheringMethod = 'ordered';
  }
  
  return applyPaletteWithStrategy(
    imageData,
    palette,
    findClosestColor,
    ditheringMethod
  );
}

// Helper functions (stubs for examples)
function loadImageData(image) { /* ... */ }
function displayPreview(imageData) { /* ... */ }
function displayFinal(imageData) { /* ... */ }
function updateGallery(variations) { /* ... */ }
function detectGradients(imageData) { /* ... */ }
function detectPixelArt(imageData) { /* ... */ }
function countUniqueColors(imageData) { /* ... */ }

export {
  basicDithering,
  ditheringWithCustomMatching,
  orderedDitheringVariations,
  adaptiveDithering,
  generateAllVariations,
  batchProcessImages,
  createComparisonView,
  progressiveProcessing,
  smartDithering
};
