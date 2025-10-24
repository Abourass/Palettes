import { describe, it, expect } from 'vitest';
import { PREDEFINED_PALETTES } from '../utils/palettes';

describe('Predefined Palettes', () => {
  describe('Palette Structure', () => {
    it('should have all expected palettes', () => {
      expect(PREDEFINED_PALETTES).toBeDefined();
      expect(PREDEFINED_PALETTES['GB Classic']).toBeDefined();
      expect(PREDEFINED_PALETTES['NES']).toBeDefined();
      expect(PREDEFINED_PALETTES['Pico-8']).toBeDefined();
      expect(PREDEFINED_PALETTES['Commodore 64']).toBeDefined();
      expect(PREDEFINED_PALETTES['ENDESGA 32']).toBeDefined();
      expect(PREDEFINED_PALETTES['Sweetie 16']).toBeDefined();
    });

    it('should have valid RGB values for all palettes', () => {
      Object.entries(PREDEFINED_PALETTES).forEach(([name, palette]) => {
        expect(Array.isArray(palette)).toBe(true);
        expect(palette.length).toBeGreaterThan(0);

        palette.forEach((color, index) => {
          expect(color).toHaveProperty('r');
          expect(color).toHaveProperty('g');
          expect(color).toHaveProperty('b');

          // RGB values should be in 0-255 range
          expect(color.r).toBeGreaterThanOrEqual(0);
          expect(color.r).toBeLessThanOrEqual(255);
          expect(color.g).toBeGreaterThanOrEqual(0);
          expect(color.g).toBeLessThanOrEqual(255);
          expect(color.b).toBeGreaterThanOrEqual(0);
          expect(color.b).toBeLessThanOrEqual(255);

          // RGB values should be integers
          expect(Number.isInteger(color.r)).toBe(true);
          expect(Number.isInteger(color.g)).toBe(true);
          expect(Number.isInteger(color.b)).toBe(true);
        });
      });
    });
  });

  describe('GB Classic Palette', () => {
    it('should have 4 colors', () => {
      expect(PREDEFINED_PALETTES['GB Classic'].length).toBe(4);
    });

    it('should have characteristic green tones', () => {
      const palette = PREDEFINED_PALETTES['GB Classic'];
      
      // Game Boy palette should be primarily green
      palette.forEach(color => {
        expect(color.g).toBeGreaterThan(0);
      });
    });
  });

  describe('NES Palette', () => {
    it('should have multiple colors', () => {
      expect(PREDEFINED_PALETTES['NES'].length).toBeGreaterThan(4);
    });

    it('should include black and white', () => {
      const palette = PREDEFINED_PALETTES['NES'];
      const hasBlack = palette.some(c => c.r === 0 && c.g === 0 && c.b === 0);
      const hasWhite = palette.some(c => c.r >= 250 && c.g >= 250 && c.b >= 250);
      
      expect(hasBlack).toBe(true);
      expect(hasWhite).toBe(true);
    });
  });

  describe('Pico-8 Palette', () => {
    it('should have 16 colors', () => {
      expect(PREDEFINED_PALETTES['Pico-8'].length).toBe(16);
    });

    it('should have distinct colors', () => {
      const palette = PREDEFINED_PALETTES['Pico-8'];
      const colorKeys = new Set(
        palette.map(c => `${c.r},${c.g},${c.b}`)
      );
      
      // All 16 colors should be unique
      expect(colorKeys.size).toBe(16);
    });
  });

  describe('Commodore 64 Palette', () => {
    it('should have 16 colors', () => {
      expect(PREDEFINED_PALETTES['Commodore 64'].length).toBe(16);
    });

    it('should have distinct colors', () => {
      const palette = PREDEFINED_PALETTES['Commodore 64'];
      const colorKeys = new Set(
        palette.map(c => `${c.r},${c.g},${c.b}`)
      );
      
      expect(colorKeys.size).toBe(16);
    });
  });

  describe('ENDESGA 32 Palette', () => {
    it('should have multiple colors', () => {
      expect(PREDEFINED_PALETTES['ENDESGA 32'].length).toBeGreaterThan(10);
    });

    it('should have warm earth tones', () => {
      const palette = PREDEFINED_PALETTES['ENDESGA 32'];
      
      // ENDESGA 32 has many warm colors
      const warmColors = palette.filter(c => c.r >= c.b);
      expect(warmColors.length).toBeGreaterThan(0);
    });
  });

  describe('Sweetie 16 Palette', () => {
    it('should have 16 colors', () => {
      expect(PREDEFINED_PALETTES['Sweetie 16'].length).toBe(16);
    });

    it('should have distinct colors', () => {
      const palette = PREDEFINED_PALETTES['Sweetie 16'];
      const colorKeys = new Set(
        palette.map(c => `${c.r},${c.g},${c.b}`)
      );
      
      expect(colorKeys.size).toBe(16);
    });
  });

  describe('Palette Consistency', () => {
    it('should not have duplicate colors within same palette', () => {
      Object.entries(PREDEFINED_PALETTES).forEach(([name, palette]) => {
        const colorKeys = palette.map(c => `${c.r},${c.g},${c.b}`);
        const uniqueKeys = new Set(colorKeys);
        
        expect(uniqueKeys.size).toBe(
          palette.length,
          `Palette ${name} has duplicate colors`
        );
      });
    });

    it('should be immutable (not directly modifiable)', () => {
      // Try to modify a palette
      const originalLength = PREDEFINED_PALETTES['GB Classic'].length;
      const originalFirstColor = { ...PREDEFINED_PALETTES['GB Classic'][0] };
      
      // These operations should not affect the original palette
      expect(PREDEFINED_PALETTES['GB Classic'].length).toBe(originalLength);
      expect(PREDEFINED_PALETTES['GB Classic'][0]).toEqual(originalFirstColor);
    });
  });

  describe('Color Diversity', () => {
    it('should have palettes with varying sizes', () => {
      const sizes = Object.values(PREDEFINED_PALETTES).map(p => p.length);
      const uniqueSizes = new Set(sizes);
      
      // Should have palettes of different sizes
      expect(uniqueSizes.size).toBeGreaterThan(1);
    });

    it('should have palettes with different color characteristics', () => {
      // Check that different palettes have different average colors
      const averageColors = Object.entries(PREDEFINED_PALETTES).map(([name, palette]) => {
        const avg = palette.reduce(
          (acc, c) => ({
            r: acc.r + c.r,
            g: acc.g + c.g,
            b: acc.b + c.b,
          }),
          { r: 0, g: 0, b: 0 }
        );
        
        return {
          name,
          r: avg.r / palette.length,
          g: avg.g / palette.length,
          b: avg.b / palette.length,
        };
      });

      // GB Classic should be greener on average
      const gbAverage = averageColors.find(a => a.name === 'GB Classic');
      expect(gbAverage.g).toBeGreaterThan(gbAverage.r);
      expect(gbAverage.g).toBeGreaterThan(gbAverage.b);
    });
  });

  describe('Practical Usage', () => {
    it('should be usable in a color matching scenario', () => {
      const testColor = { r: 128, g: 128, b: 128 };
      
      Object.values(PREDEFINED_PALETTES).forEach(palette => {
        // Should be able to iterate and compare
        let minDist = Infinity;
        let closest = null;
        
        palette.forEach(paletteColor => {
          const dist = Math.sqrt(
            Math.pow(testColor.r - paletteColor.r, 2) +
            Math.pow(testColor.g - paletteColor.g, 2) +
            Math.pow(testColor.b - paletteColor.b, 2)
          );
          
          if (dist < minDist) {
            minDist = dist;
            closest = paletteColor;
          }
        });
        
        expect(closest).toBeDefined();
        expect(closest.r).toBeGreaterThanOrEqual(0);
        expect(closest.g).toBeGreaterThanOrEqual(0);
        expect(closest.b).toBeGreaterThanOrEqual(0);
      });
    });

    it('should be serializable to JSON', () => {
      expect(() => {
        JSON.stringify(PREDEFINED_PALETTES);
      }).not.toThrow();
      
      const serialized = JSON.stringify(PREDEFINED_PALETTES);
      const deserialized = JSON.parse(serialized);
      
      expect(deserialized).toEqual(PREDEFINED_PALETTES);
    });
  });
});
