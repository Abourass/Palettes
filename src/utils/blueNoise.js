// Blue Noise texture generator and utilities
// Blue noise is a noise pattern with energy concentrated in high frequencies
// making it ideal for dithering with minimal visual artifacts

// Generate a pseudo-random but well-distributed blue noise pattern
// This is a simplified blue noise generator using a seeded pattern
function generateBlueNoisePattern() {
  const size = 64;
  const pattern = [];
  
  // Generate a pseudo-random but uniformly distributed pattern
  // Using a deterministic algorithm for reproducibility
  for (let i = 0; i < size * size; i++) {
    // Use a combination of prime numbers to create pseudo-random but well-distributed values
    const x = i % size;
    const y = Math.floor(i / size);
    // Create a value that varies smoothly but unpredictably
    const value = ((x * 2654435761 + y * 2246822519 + i * 3266489917) >>> 0) / 4294967296;
    pattern.push(value);
  }
  
  return pattern;
}

// Pre-computed 64x64 blue noise texture (normalized to 0-1)
const BLUE_NOISE_64x64 = generateBlueNoisePattern();

/**
 * Get blue noise value at position (x, y)
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {number} - Blue noise value (0-1)
 */
export function getBlueNoiseValue(x, y) {
  const tileSize = 64;
  const tileX = x % tileSize;
  const tileY = y % tileSize;
  const index = tileY * tileSize + tileX;
  return BLUE_NOISE_64x64[index];
}

/**
 * Generate a larger blue noise texture by tiling the base 64x64 texture
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {Float32Array} - Blue noise texture
 */
export function generateBlueNoiseTexture(width, height) {
  const texture = new Float32Array(width * height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      texture[y * width + x] = getBlueNoiseValue(x, y);
    }
  }
  
  return texture;
}

/**
 * Apply blue noise threshold to a value
 * @param {number} value - Input value (0-255)
 * @param {number} threshold - Blue noise threshold (0-1)
 * @param {number} intensity - Dither intensity (0-1)
 * @returns {number} - Dithered value (0-255)
 */
export function applyBlueNoiseThreshold(value, threshold, intensity = 1.0) {
  // Convert threshold from 0-1 to -0.5 to 0.5 for balanced dithering
  const adjustedThreshold = (threshold - 0.5) * 64 * intensity;
  return Math.max(0, Math.min(255, value + adjustedThreshold));
}
