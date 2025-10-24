// Web Worker for image processing operations
// This worker handles all image processing off the main thread

// Import color utility functions
import {
  findClosestColor,
  findClosestByLuminosity,
  findClosestByHue,
  findClosestBySaturation,
  findInvertedLuminosity,
  findComplementaryHue,
  applyPaletteWithStrategy,
  generateSimilarPalettes,
  extractColors
} from '../utils/colorUtils.js';

// Handle messages from the main thread
self.onmessage = function(e) {
  const { type, data, id } = e.data;

  try {
    switch (type) {
      case 'generateVariations':
        handleGenerateVariations(data, id);
        break;
      
      case 'generateSimilarPalettes':
        handleGenerateSimilarPalettes(data, id);
        break;
      
      case 'applyPalette':
        handleApplyPalette(data, id);
        break;
      
      case 'extractColors':
        handleExtractColors(data, id);
        break;
      
      default:
        self.postMessage({
          type: 'error',
          id,
          error: `Unknown message type: ${type}`
        });
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      id,
      error: error.message,
      stack: error.stack
    });
  }
};

// Generate all 6 palette variations
function handleGenerateVariations(data, id) {
  const { imageData, palette, ditheringMethod, preserveDistinctness } = data;
  
  // Reconstruct ImageData object (it gets serialized during transfer)
  const imgData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  const matchingFunctions = [
    { name: 'Luminosity Match', description: 'Matches by brightness, preserving light/dark contrast', fn: findClosestByLuminosity },
    { name: 'Hue Match', description: 'Matches by color family, preserving the mood', fn: findClosestByHue },
    { name: 'Saturation Match', description: 'Matches by color vividness (vibrant vs muted)', fn: findClosestBySaturation },
    { name: 'Inverted Luminosity', description: 'Inverts brightness (dark becomes light, light becomes dark)', fn: findInvertedLuminosity },
    { name: 'Complementary Hue', description: 'Maps to opposite colors on the color wheel', fn: findComplementaryHue },
    { name: 'Perceptual Match', description: 'Standard RGB distance matching', fn: findClosestColor }
  ];
  
  const variations = matchingFunctions.map(({ name, description, fn }) => {
    const result = applyPaletteWithStrategy(imgData, palette, fn, ditheringMethod, preserveDistinctness);
    return {
      name,
      description,
      imageData: {
        data: Array.from(result.data), // Convert to regular array for transfer
        width: result.width,
        height: result.height
      }
    };
  });
  
  self.postMessage({
    type: 'variationsComplete',
    id,
    data: variations
  });
}

// Generate similar palettes and apply them
function handleGenerateSimilarPalettes(data, id) {
  const { imageData, palette, ditheringMethod, preserveDistinctness, count } = data;
  
  // Reconstruct ImageData object
  const imgData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  const similarPalettes = generateSimilarPalettes(palette, count);
  
  const similarResults = similarPalettes.map(p => {
    const result = applyPaletteWithStrategy(imgData, p, findClosestByLuminosity, ditheringMethod, preserveDistinctness);
    return {
      name: 'Similar Palette',
      description: 'Palette with adjusted hue',
      imageData: {
        data: Array.from(result.data),
        width: result.width,
        height: result.height
      }
    };
  });
  
  self.postMessage({
    type: 'similarPalettesComplete',
    id,
    data: similarResults
  });
}

// Apply a single palette
function handleApplyPalette(data, id) {
  const { imageData, palette, ditheringMethod, preserveDistinctness, matchingStrategy } = data;
  
  // Reconstruct ImageData object
  const imgData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  // Select matching function based on strategy
  let matchingFunction = findClosestColor;
  switch (matchingStrategy) {
    case 'luminosity':
      matchingFunction = findClosestByLuminosity;
      break;
    case 'hue':
      matchingFunction = findClosestByHue;
      break;
    case 'saturation':
      matchingFunction = findClosestBySaturation;
      break;
    case 'inverted':
      matchingFunction = findInvertedLuminosity;
      break;
    case 'complementary':
      matchingFunction = findComplementaryHue;
      break;
    default:
      matchingFunction = findClosestColor;
  }
  
  const result = applyPaletteWithStrategy(imgData, palette, matchingFunction, ditheringMethod, preserveDistinctness);
  
  self.postMessage({
    type: 'paletteApplied',
    id,
    data: {
      imageData: {
        data: Array.from(result.data),
        width: result.width,
        height: result.height
      }
    }
  });
}

// Extract colors from image
function handleExtractColors(data, id) {
  const { imageData, maxColors } = data;
  
  // Reconstruct ImageData object
  const imgData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  const colors = extractColors(imgData, maxColors);
  
  self.postMessage({
    type: 'colorsExtracted',
    id,
    data: colors
  });
}
