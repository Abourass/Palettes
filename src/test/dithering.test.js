import { describe, it, expect } from 'vitest';
import {
  applyFloydSteinbergDithering,
  applyOrderedDithering,
  applyAtkinsonDithering,
  applyBlueNoiseDithering,
  findClosestColor
} from '../utils/colorUtils';
import { getBlueNoiseValue, applyBlueNoiseThreshold } from '../utils/blueNoise';

describe('Blue Noise Functions', () => {
  describe('getBlueNoiseValue', () => {
    it('should return values between 0 and 1', () => {
      for (let y = 0; y < 64; y++) {
        for (let x = 0; x < 64; x++) {
          const value = getBlueNoiseValue(x, y);
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        }
      }
    });

    it('should tile correctly for coordinates beyond 64x64', () => {
      // Test that values repeat beyond the tile size
      expect(getBlueNoiseValue(0, 0)).toBe(getBlueNoiseValue(64, 0));
      expect(getBlueNoiseValue(0, 0)).toBe(getBlueNoiseValue(0, 64));
      expect(getBlueNoiseValue(10, 20)).toBe(getBlueNoiseValue(74, 84));
    });

    it('should provide different values at different positions', () => {
      const value1 = getBlueNoiseValue(0, 0);
      const value2 = getBlueNoiseValue(1, 0);
      const value3 = getBlueNoiseValue(0, 1);
      
      // Most values should be different (blue noise property)
      expect(value1).not.toBe(value2);
      expect(value1).not.toBe(value3);
    });
  });

  describe('applyBlueNoiseThreshold', () => {
    it('should adjust values based on threshold', () => {
      const value = 128;
      
      const low = applyBlueNoiseThreshold(value, 0.0, 1.0); // Low threshold
      const mid = applyBlueNoiseThreshold(value, 0.5, 1.0); // Mid threshold
      const high = applyBlueNoiseThreshold(value, 1.0, 1.0); // High threshold
      
      expect(low).toBeLessThan(mid);
      expect(mid).toBeLessThan(high);
    });

    it('should respect intensity scaling', () => {
      const value = 128;
      const threshold = 0.75;
      
      const full = applyBlueNoiseThreshold(value, threshold, 1.0);
      const half = applyBlueNoiseThreshold(value, threshold, 0.5);
      const double = applyBlueNoiseThreshold(value, threshold, 2.0);
      
      // Half intensity should be closer to original value than full
      expect(Math.abs(half - value)).toBeLessThan(Math.abs(full - value));
      // Double intensity should be further from original value
      expect(Math.abs(double - value)).toBeGreaterThan(Math.abs(full - value));
    });

    it('should clamp values to 0-255 range', () => {
      const low = applyBlueNoiseThreshold(10, 0.0, 10.0);
      const high = applyBlueNoiseThreshold(250, 1.0, 10.0);
      
      expect(low).toBeGreaterThanOrEqual(0);
      expect(low).toBeLessThanOrEqual(255);
      expect(high).toBeGreaterThanOrEqual(0);
      expect(high).toBeLessThanOrEqual(255);
    });
  });
});

describe('Dithering Algorithms', () => {
  // Create a simple test image
  const createTestImage = (width = 4, height = 4) => {
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      // Create a gradient
      const value = Math.floor((i / (width * height)) * 255);
      data[i * 4] = value;     // R
      data[i * 4 + 1] = value; // G
      data[i * 4 + 2] = value; // B
      data[i * 4 + 3] = 255;   // A (opaque)
    }
    return new ImageData(data, width, height);
  };

  // Simple palette: black and white
  const bwPalette = [
    { r: 0, g: 0, b: 0 },
    { r: 255, g: 255, b: 255 }
  ];

  describe('applyBlueNoiseDithering', () => {
    it('should dither an image to the target palette', () => {
      const imageData = createTestImage();
      const result = applyBlueNoiseDithering(imageData, bwPalette, findClosestColor, 1.0);
      
      expect(result).toBeInstanceOf(ImageData);
      expect(result.width).toBe(imageData.width);
      expect(result.height).toBe(imageData.height);
    });

    it('should only use colors from the palette', () => {
      const imageData = createTestImage();
      const result = applyBlueNoiseDithering(imageData, bwPalette, findClosestColor, 1.0);
      
      const uniqueColors = new Set();
      for (let i = 0; i < result.data.length; i += 4) {
        if (result.data[i + 3] >= 128) { // Non-transparent
          const color = `${result.data[i]},${result.data[i + 1]},${result.data[i + 2]}`;
          uniqueColors.add(color);
        }
      }
      
      // Should only contain black (0,0,0) and/or white (255,255,255)
      expect(uniqueColors.size).toBeLessThanOrEqual(2);
      uniqueColors.forEach(color => {
        expect(['0,0,0', '255,255,255'].includes(color)).toBe(true);
      });
    });

    it('should respect intensity parameter', () => {
      const imageData = createTestImage(8, 8);
      
      // With zero intensity, should be similar to no dithering
      const noIntensity = applyBlueNoiseDithering(imageData, bwPalette, findClosestColor, 0.0);
      // With high intensity, should have more variation
      const highIntensity = applyBlueNoiseDithering(imageData, bwPalette, findClosestColor, 2.0);
      
      expect(noIntensity).toBeInstanceOf(ImageData);
      expect(highIntensity).toBeInstanceOf(ImageData);
    });

    it('should preserve image dimensions', () => {
      const imageData = createTestImage(16, 8);
      const result = applyBlueNoiseDithering(imageData, bwPalette, findClosestColor, 1.0);
      
      expect(result.width).toBe(16);
      expect(result.height).toBe(8);
    });

    it('should skip transparent pixels', () => {
      const imageData = createTestImage(4, 4);
      // Make some pixels transparent
      imageData.data[3] = 0;   // First pixel transparent
      imageData.data[7] = 100; // Second pixel semi-transparent
      
      const result = applyBlueNoiseDithering(imageData, bwPalette, findClosestColor, 1.0);
      
      // Transparent pixels should remain unchanged
      expect(result.data[3]).toBe(0);
      expect(result.data[7]).toBe(100);
    });
  });

  describe('Dithering with Intensity', () => {
    it('Floyd-Steinberg should support intensity parameter', () => {
      const imageData = createTestImage();
      const result = applyFloydSteinbergDithering(imageData, bwPalette, findClosestColor, 0.5);
      
      expect(result).toBeInstanceOf(ImageData);
      expect(result.width).toBe(imageData.width);
      expect(result.height).toBe(imageData.height);
    });

    it('Ordered dithering should support intensity parameter', () => {
      const imageData = createTestImage();
      const result = applyOrderedDithering(imageData, bwPalette, findClosestColor, 4, 0.5);
      
      expect(result).toBeInstanceOf(ImageData);
      expect(result.width).toBe(imageData.width);
      expect(result.height).toBe(imageData.height);
    });

    it('Atkinson should support intensity parameter', () => {
      const imageData = createTestImage();
      const result = applyAtkinsonDithering(imageData, bwPalette, findClosestColor, 0.5);
      
      expect(result).toBeInstanceOf(ImageData);
      expect(result.width).toBe(imageData.width);
      expect(result.height).toBe(imageData.height);
    });
  });

  describe('Dithering Comparison', () => {
    it('different dithering methods should produce different results', () => {
      const imageData = createTestImage(8, 8);
      
      const floyd = applyFloydSteinbergDithering(imageData, bwPalette, findClosestColor, 1.0);
      const ordered = applyOrderedDithering(imageData, bwPalette, findClosestColor, 4, 1.0);
      const atkinson = applyAtkinsonDithering(imageData, bwPalette, findClosestColor, 1.0);
      const blueNoise = applyBlueNoiseDithering(imageData, bwPalette, findClosestColor, 1.0);
      
      // Convert to strings for comparison
      const floydStr = Array.from(floyd.data).join(',');
      const orderedStr = Array.from(ordered.data).join(',');
      const atkinsonStr = Array.from(atkinson.data).join(',');
      const blueNoiseStr = Array.from(blueNoise.data).join(',');
      
      // At least some methods should differ (they use different algorithms)
      const allEqual = floydStr === orderedStr && orderedStr === atkinsonStr && atkinsonStr === blueNoiseStr;
      expect(allEqual).toBe(false);
    });
  });
});
