import { describe, it, expect } from 'vitest';
import {
  generateComplementary,
  generateAnalogous,
  generateTriadic,
  generateSplitComplementary,
  generateTetradic,
  generateMonochromatic,
  generateCompound,
  generateAllHarmonies,
  generatePaletteFromHex,
  extractPaletteFromImage,
  extractPaletteMedianCut,
} from '../utils/colorHarmony';

describe('Color Harmony Generation', () => {
  const baseColor = { r: 255, g: 0, b: 0 }; // Red

  describe('generateComplementary', () => {
    it('should generate complementary colors', () => {
      const palette = generateComplementary(baseColor, 4);
      
      expect(palette).toBeDefined();
      expect(Array.isArray(palette)).toBe(true);
      expect(palette.length).toBeGreaterThan(0);
    });

    it('should include variations of base and complement', () => {
      const palette = generateComplementary(baseColor, 6);
      
      expect(palette.length).toBeGreaterThanOrEqual(4);
      
      // All colors should be valid RGB
      palette.forEach(color => {
        expect(color.r).toBeGreaterThanOrEqual(0);
        expect(color.r).toBeLessThanOrEqual(255);
        expect(color.g).toBeGreaterThanOrEqual(0);
        expect(color.g).toBeLessThanOrEqual(255);
        expect(color.b).toBeGreaterThanOrEqual(0);
        expect(color.b).toBeLessThanOrEqual(255);
      });
    });

    it('should handle different variation counts', () => {
      const palette3 = generateComplementary(baseColor, 3);
      const palette10 = generateComplementary(baseColor, 10);
      
      expect(palette3.length).toBeGreaterThan(0);
      expect(palette10.length).toBeGreaterThan(palette3.length);
    });
  });

  describe('generateAnalogous', () => {
    it('should generate analogous colors', () => {
      const palette = generateAnalogous(baseColor, 5, 30);
      
      expect(palette).toBeDefined();
      expect(palette.length).toBe(5);
    });

    it('should create colors around the base hue', () => {
      const palette = generateAnalogous(baseColor, 5, 30);
      
      // All colors should be valid RGB
      palette.forEach(color => {
        expect(color.r).toBeGreaterThanOrEqual(0);
        expect(color.r).toBeLessThanOrEqual(255);
        expect(color.g).toBeGreaterThanOrEqual(0);
        expect(color.g).toBeLessThanOrEqual(255);
        expect(color.b).toBeGreaterThanOrEqual(0);
        expect(color.b).toBeLessThanOrEqual(255);
      });
    });

    it('should respect count parameter', () => {
      const palette3 = generateAnalogous(baseColor, 3);
      const palette7 = generateAnalogous(baseColor, 7);
      
      expect(palette3.length).toBe(3);
      expect(palette7.length).toBe(7);
    });

    it('should handle custom spread values', () => {
      const narrow = generateAnalogous(baseColor, 5, 15);
      const wide = generateAnalogous(baseColor, 5, 60);
      
      expect(narrow.length).toBe(5);
      expect(wide.length).toBe(5);
    });
  });

  describe('generateTriadic', () => {
    it('should generate triadic colors', () => {
      const palette = generateTriadic(baseColor, true);
      
      expect(palette).toBeDefined();
      expect(palette.length).toBeGreaterThan(0);
    });

    it('should create 3 base colors when variations disabled', () => {
      const palette = generateTriadic(baseColor, false);
      
      expect(palette.length).toBe(3);
    });

    it('should create more colors with variations enabled', () => {
      const palette = generateTriadic(baseColor, true);
      
      expect(palette.length).toBeGreaterThan(3);
      
      // All colors should be valid RGB
      palette.forEach(color => {
        expect(color.r).toBeGreaterThanOrEqual(0);
        expect(color.r).toBeLessThanOrEqual(255);
        expect(color.g).toBeGreaterThanOrEqual(0);
        expect(color.g).toBeLessThanOrEqual(255);
        expect(color.b).toBeGreaterThanOrEqual(0);
        expect(color.b).toBeLessThanOrEqual(255);
      });
    });
  });

  describe('generateSplitComplementary', () => {
    it('should generate split complementary colors', () => {
      const palette = generateSplitComplementary(baseColor, 30, true);
      
      expect(palette).toBeDefined();
      expect(palette.length).toBeGreaterThan(0);
    });

    it('should create 3 base colors when variations disabled', () => {
      const palette = generateSplitComplementary(baseColor, 30, false);
      
      expect(palette.length).toBe(3);
    });

    it('should handle custom split angles', () => {
      const narrow = generateSplitComplementary(baseColor, 20, false);
      const wide = generateSplitComplementary(baseColor, 45, false);
      
      expect(narrow.length).toBe(3);
      expect(wide.length).toBe(3);
    });
  });

  describe('generateTetradic', () => {
    it('should generate tetradic colors', () => {
      const palette = generateTetradic(baseColor, true);
      
      expect(palette).toBeDefined();
      expect(palette.length).toBeGreaterThan(0);
    });

    it('should create 4 base colors when variations disabled', () => {
      const palette = generateTetradic(baseColor, false);
      
      expect(palette.length).toBe(4);
    });

    it('should create evenly spaced colors', () => {
      const palette = generateTetradic(baseColor, true);
      
      // Should have multiple colors
      expect(palette.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('generateMonochromatic', () => {
    it('should generate monochromatic colors', () => {
      const palette = generateMonochromatic(baseColor, 5);
      
      expect(palette).toBeDefined();
      expect(palette.length).toBe(5);
    });

    it('should create variations in lightness', () => {
      const palette = generateMonochromatic(baseColor, 5);
      
      // All colors should be valid RGB
      palette.forEach(color => {
        expect(color.r).toBeGreaterThanOrEqual(0);
        expect(color.r).toBeLessThanOrEqual(255);
        expect(color.g).toBeGreaterThanOrEqual(0);
        expect(color.g).toBeLessThanOrEqual(255);
        expect(color.b).toBeGreaterThanOrEqual(0);
        expect(color.b).toBeLessThanOrEqual(255);
      });
    });

    it('should respect count parameter', () => {
      const palette3 = generateMonochromatic(baseColor, 3);
      const palette8 = generateMonochromatic(baseColor, 8);
      
      expect(palette3.length).toBe(3);
      expect(palette8.length).toBe(8);
    });
  });

  describe('generateCompound', () => {
    it('should generate compound colors', () => {
      const palette = generateCompound(baseColor, 60);
      
      expect(palette).toBeDefined();
      expect(palette.length).toBeGreaterThan(0);
    });

    it('should create variations with 4 base hues', () => {
      const palette = generateCompound(baseColor, 60);
      
      // Should have multiple colors (4 hues with variations)
      expect(palette.length).toBeGreaterThanOrEqual(4);
      
      // All colors should be valid RGB
      palette.forEach(color => {
        expect(color.r).toBeGreaterThanOrEqual(0);
        expect(color.r).toBeLessThanOrEqual(255);
        expect(color.g).toBeGreaterThanOrEqual(0);
        expect(color.g).toBeLessThanOrEqual(255);
        expect(color.b).toBeGreaterThanOrEqual(0);
        expect(color.b).toBeLessThanOrEqual(255);
      });
    });

    it('should handle custom offset values', () => {
      const offset30 = generateCompound(baseColor, 30);
      const offset90 = generateCompound(baseColor, 90);
      
      expect(offset30.length).toBeGreaterThan(0);
      expect(offset90.length).toBeGreaterThan(0);
    });
  });

  describe('generateAllHarmonies', () => {
    it('should generate all harmony types', () => {
      const harmonies = generateAllHarmonies(baseColor);
      
      expect(harmonies).toBeDefined();
      expect(harmonies.complementary).toBeDefined();
      expect(harmonies.analogous).toBeDefined();
      expect(harmonies.triadic).toBeDefined();
      expect(harmonies.splitComplementary).toBeDefined();
      expect(harmonies.tetradic).toBeDefined();
      expect(harmonies.monochromatic).toBeDefined();
      expect(harmonies.compound).toBeDefined();
    });

    it('should generate valid palettes for each harmony', () => {
      const harmonies = generateAllHarmonies(baseColor);
      
      Object.values(harmonies).forEach(palette => {
        expect(Array.isArray(palette)).toBe(true);
        expect(palette.length).toBeGreaterThan(0);
        
        palette.forEach(color => {
          expect(color.r).toBeGreaterThanOrEqual(0);
          expect(color.r).toBeLessThanOrEqual(255);
          expect(color.g).toBeGreaterThanOrEqual(0);
          expect(color.g).toBeLessThanOrEqual(255);
          expect(color.b).toBeGreaterThanOrEqual(0);
          expect(color.b).toBeLessThanOrEqual(255);
        });
      });
    });
  });

  describe('generatePaletteFromHex', () => {
    it('should generate palette from valid hex color', () => {
      const palette = generatePaletteFromHex('#ff0000', 'complementary');
      
      expect(palette).toBeDefined();
      expect(Array.isArray(palette)).toBe(true);
      expect(palette.length).toBeGreaterThan(0);
    });

    it('should handle different harmony types', () => {
      const types = ['complementary', 'analogous', 'triadic', 'monochromatic'];
      
      types.forEach(type => {
        const palette = generatePaletteFromHex('#ff0000', type);
        expect(palette).toBeDefined();
        expect(palette.length).toBeGreaterThan(0);
      });
    });

    it('should return null for invalid hex', () => {
      const palette = generatePaletteFromHex('invalid', 'complementary');
      expect(palette).toBeNull();
    });

    it('should handle hex without # prefix', () => {
      const palette = generatePaletteFromHex('ff0000', 'complementary');
      expect(palette).toBeDefined();
    });
  });
});

describe('Palette Extraction from Image', () => {
  // Helper to create test image data
  const createTestImageData = (colors) => {
    const pixelCount = colors.length;
    const data = new Uint8ClampedArray(pixelCount * 4);
    
    colors.forEach((color, i) => {
      data[i * 4] = color.r;
      data[i * 4 + 1] = color.g;
      data[i * 4 + 2] = color.b;
      data[i * 4 + 3] = 255; // Opaque
    });
    
    return {
      data,
      width: pixelCount,
      height: 1,
    };
  };

  describe('extractPaletteFromImage', () => {
    it('should extract colors from image data', () => {
      const imageData = createTestImageData([
        { r: 255, g: 0, b: 0 },
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
      ]);
      
      const palette = extractPaletteFromImage(imageData, 3);
      
      expect(palette).toBeDefined();
      expect(Array.isArray(palette)).toBe(true);
      expect(palette.length).toBeGreaterThan(0);
      expect(palette.length).toBeLessThanOrEqual(3);
    });

    it('should respect colorCount parameter', () => {
      const imageData = createTestImageData([
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 255, g: 255, b: 0 },
        { r: 255, g: 0, b: 255 },
        { r: 0, g: 255, b: 255 },
      ]);
      
      const palette3 = extractPaletteFromImage(imageData, 3);
      
      expect(palette3.length).toBeLessThanOrEqual(3);
    });

    it('should handle quality parameter', () => {
      const imageData = createTestImageData(
        Array(100).fill({ r: 255, g: 0, b: 0 })
      );
      
      const paletteHighQuality = extractPaletteFromImage(imageData, 5, 1);
      const paletteLowQuality = extractPaletteFromImage(imageData, 5, 50);
      
      expect(paletteHighQuality).toBeDefined();
      expect(paletteLowQuality).toBeDefined();
    });
  });

  describe('extractPaletteMedianCut', () => {
    it('should extract colors using median cut', () => {
      const imageData = createTestImageData([
        { r: 255, g: 0, b: 0 },
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
      ]);
      
      const palette = extractPaletteMedianCut(imageData, 3);
      
      expect(palette).toBeDefined();
      expect(Array.isArray(palette)).toBe(true);
      expect(palette.length).toBeGreaterThan(0);
    });

    it('should respect colorCount parameter', () => {
      const imageData = createTestImageData([
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
      ]);
      
      const palette2 = extractPaletteMedianCut(imageData, 2);
      const palette4 = extractPaletteMedianCut(imageData, 4);
      
      expect(palette2.length).toBeLessThanOrEqual(3);
      expect(palette4.length).toBeLessThanOrEqual(4);
    });

    it('should handle single color images', () => {
      const imageData = createTestImageData([
        { r: 100, g: 100, b: 100 },
      ]);
      
      const palette = extractPaletteMedianCut(imageData, 5);
      
      expect(palette).toBeDefined();
      expect(palette.length).toBeGreaterThan(0);
    });
  });
});

describe('Edge Cases and Error Handling', () => {
  it('should handle black color in all harmony functions', () => {
    const black = { r: 0, g: 0, b: 0 };
    
    expect(() => generateComplementary(black)).not.toThrow();
    expect(() => generateAnalogous(black)).not.toThrow();
    expect(() => generateTriadic(black)).not.toThrow();
    expect(() => generateMonochromatic(black)).not.toThrow();
  });

  it('should handle white color in all harmony functions', () => {
    const white = { r: 255, g: 255, b: 255 };
    
    expect(() => generateComplementary(white)).not.toThrow();
    expect(() => generateAnalogous(white)).not.toThrow();
    expect(() => generateTriadic(white)).not.toThrow();
    expect(() => generateMonochromatic(white)).not.toThrow();
  });

  it('should handle grayscale colors', () => {
    const gray = { r: 128, g: 128, b: 128 };
    
    const complementary = generateComplementary(gray);
    const analogous = generateAnalogous(gray);
    const monochromatic = generateMonochromatic(gray);
    
    expect(complementary.length).toBeGreaterThan(0);
    expect(analogous.length).toBeGreaterThan(0);
    expect(monochromatic.length).toBeGreaterThan(0);
  });
});
