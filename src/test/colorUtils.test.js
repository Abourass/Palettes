import { describe, it, expect } from 'vitest';
import {
  rgbToHex,
  hexToRgb,
  colorDistance,
  getLuminance,
  getSaturation,
  getHue,
  hueDistance,
  rgbToHsl,
  hslToRgb,
  findClosestColor,
  findClosestByLuminosity,
  findClosestByHue,
  findClosestBySaturation,
  findInvertedLuminosity,
  findComplementaryHue,
  extractColors,
  parseHexColorFile,
  createColorMapping,
} from '../utils/colorUtils';

describe('Color Conversion Functions', () => {
  describe('rgbToHex', () => {
    it('should convert RGB to hex correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    });

    it('should handle single digit hex values with leading zeros', () => {
      expect(rgbToHex(15, 15, 15)).toBe('#0f0f0f');
      expect(rgbToHex(1, 2, 3)).toBe('#010203');
    });
  });

  describe('hexToRgb', () => {
    it('should convert hex to RGB correctly', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should handle hex without # prefix', () => {
      expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should handle uppercase hex values', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#AABBCC')).toEqual({ r: 170, g: 187, b: 204 });
    });

    it('should return null for invalid hex strings', () => {
      expect(hexToRgb('#gg0000')).toBeNull();
      expect(hexToRgb('#ff00')).toBeNull();
      expect(hexToRgb('invalid')).toBeNull();
    });
  });

  describe('rgbToHsl and hslToRgb', () => {
    it('should convert RGB to HSL and back', () => {
      const rgb = { r: 255, g: 0, b: 0 };
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const converted = hslToRgb(hsl.h, hsl.s, hsl.l);
      
      expect(converted.r).toBeCloseTo(rgb.r, 0);
      expect(converted.g).toBeCloseTo(rgb.g, 0);
      expect(converted.b).toBeCloseTo(rgb.b, 0);
    });

    it('should handle grayscale colors', () => {
      const hsl = rgbToHsl(128, 128, 128);
      expect(hsl.s).toBeCloseTo(0, 1);
      expect(hsl.l).toBeCloseTo(50.2, 1);
    });

    it('should handle pure colors', () => {
      const redHsl = rgbToHsl(255, 0, 0);
      expect(redHsl.h).toBeCloseTo(0, 1);
      expect(redHsl.s).toBeCloseTo(100, 1);

      const greenHsl = rgbToHsl(0, 255, 0);
      expect(greenHsl.h).toBeCloseTo(120, 1);

      const blueHsl = rgbToHsl(0, 0, 255);
      expect(blueHsl.h).toBeCloseTo(240, 1);
    });
  });
});

describe('Color Measurement Functions', () => {
  describe('colorDistance', () => {
    it('should return 0 for identical colors', () => {
      const color = { r: 100, g: 150, b: 200 };
      expect(colorDistance(color, color)).toBe(0);
    });

    it('should calculate Euclidean distance correctly', () => {
      const c1 = { r: 0, g: 0, b: 0 };
      const c2 = { r: 255, g: 255, b: 255 };
      const expected = Math.sqrt(255 * 255 * 3);
      expect(colorDistance(c1, c2)).toBeCloseTo(expected, 2);
    });

    it('should be commutative', () => {
      const c1 = { r: 100, g: 50, b: 75 };
      const c2 = { r: 200, g: 150, b: 100 };
      expect(colorDistance(c1, c2)).toBe(colorDistance(c2, c1));
    });
  });

  describe('getLuminance', () => {
    it('should return 0 for black', () => {
      expect(getLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
    });

    it('should return 255 for white', () => {
      expect(getLuminance({ r: 255, g: 255, b: 255 })).toBe(255);
    });

    it('should weight green more heavily', () => {
      const red = getLuminance({ r: 100, g: 0, b: 0 });
      const green = getLuminance({ r: 0, g: 100, b: 0 });
      const blue = getLuminance({ r: 0, g: 0, b: 100 });
      
      expect(green).toBeGreaterThan(red);
      expect(green).toBeGreaterThan(blue);
    });
  });

  describe('getSaturation', () => {
    it('should return 0 for grayscale colors', () => {
      expect(getSaturation({ r: 128, g: 128, b: 128 })).toBe(0);
      expect(getSaturation({ r: 0, g: 0, b: 0 })).toBe(0);
      expect(getSaturation({ r: 255, g: 255, b: 255 })).toBe(0);
    });

    it('should return 1 for pure colors', () => {
      expect(getSaturation({ r: 255, g: 0, b: 0 })).toBe(1);
      expect(getSaturation({ r: 0, g: 255, b: 0 })).toBe(1);
      expect(getSaturation({ r: 0, g: 0, b: 255 })).toBe(1);
    });

    it('should return values between 0 and 1', () => {
      const sat = getSaturation({ r: 200, g: 100, b: 150 });
      expect(sat).toBeGreaterThanOrEqual(0);
      expect(sat).toBeLessThanOrEqual(1);
    });
  });

  describe('getHue', () => {
    it('should return hue in 0-360 range', () => {
      const hue = getHue({ r: 200, g: 100, b: 150 });
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    });

    it('should return approximately 0 for red', () => {
      const hue = getHue({ r: 255, g: 0, b: 0 });
      expect(hue).toBeCloseTo(0, 1);
    });

    it('should return approximately 120 for green', () => {
      const hue = getHue({ r: 0, g: 255, b: 0 });
      expect(hue).toBeCloseTo(120, 1);
    });

    it('should return approximately 240 for blue', () => {
      const hue = getHue({ r: 0, g: 0, b: 255 });
      expect(hue).toBeCloseTo(240, 1);
    });
  });

  describe('hueDistance', () => {
    it('should handle wraparound correctly', () => {
      expect(hueDistance(10, 350)).toBe(20);
      expect(hueDistance(350, 10)).toBe(20);
    });

    it('should return 0 for identical hues', () => {
      expect(hueDistance(100, 100)).toBe(0);
    });

    it('should return 180 for opposite hues', () => {
      expect(hueDistance(0, 180)).toBe(180);
      expect(hueDistance(90, 270)).toBe(180);
    });

    it('should use shorter distance around the circle', () => {
      expect(hueDistance(10, 350)).toBe(20);
      expect(hueDistance(10, 190)).toBeLessThanOrEqual(180);
    });
  });
});

describe('Color Matching Functions', () => {
  const palette = [
    { r: 0, g: 0, b: 0 },       // Black
    { r: 255, g: 255, b: 255 }, // White
    { r: 255, g: 0, b: 0 },     // Red
    { r: 0, g: 255, b: 0 },     // Green
    { r: 0, g: 0, b: 255 },     // Blue
  ];

  describe('findClosestColor', () => {
    it('should find exact matches', () => {
      const result = findClosestColor({ r: 255, g: 0, b: 0 }, palette);
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should find nearest color for non-exact matches', () => {
      const result = findClosestColor({ r: 250, g: 10, b: 10 }, palette);
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return first color if palette has one color', () => {
      const singlePalette = [{ r: 100, g: 100, b: 100 }];
      const result = findClosestColor({ r: 200, g: 50, b: 75 }, singlePalette);
      expect(result).toEqual({ r: 100, g: 100, b: 100 });
    });
  });

  describe('findClosestByLuminosity', () => {
    it('should match by brightness', () => {
      const darkColor = { r: 10, g: 10, b: 10 };
      const result = findClosestByLuminosity(darkColor, palette);
      expect(result).toEqual({ r: 0, g: 0, b: 0 }); // Should match black
    });

    it('should match bright colors by luminance', () => {
      const brightColor = { r: 200, g: 200, b: 200 };
      const result = findClosestByLuminosity(brightColor, palette);
      // Bright gray (200,200,200) has luminance of 200
      // White (255,255,255) has luminance of 255 (distance: 55)
      // Green (0,255,0) has luminance of 149.685 (distance: 50.315)
      // Green is actually closer by luminance!
      expect(result).toEqual({ r: 0, g: 255, b: 0 }); // Should match green
    });
  });

  describe('findClosestByHue', () => {
    it('should match colors by hue family', () => {
      const orangeColor = { r: 255, g: 100, b: 0 };
      const result = findClosestByHue(orangeColor, palette);
      expect(result).toEqual({ r: 255, g: 0, b: 0 }); // Should match red
    });
  });

  describe('findClosestBySaturation', () => {
    it('should match by color vividness', () => {
      const saturatedColor = { r: 255, g: 0, b: 0 };
      const result = findClosestBySaturation(saturatedColor, palette);
      // Should match one of the pure colors
      expect([
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 }
      ]).toContainEqual(result);
    });
  });

  describe('findInvertedLuminosity', () => {
    it('should invert brightness', () => {
      const darkColor = { r: 0, g: 0, b: 0 };
      const result = findInvertedLuminosity(darkColor, palette);
      expect(result).toEqual({ r: 255, g: 255, b: 255 }); // Dark should match light
    });

    it('should map bright to dark', () => {
      const brightColor = { r: 255, g: 255, b: 255 };
      const result = findInvertedLuminosity(brightColor, palette);
      expect(result).toEqual({ r: 0, g: 0, b: 0 }); // Bright should match dark
    });
  });

  describe('findComplementaryHue', () => {
    it('should find opposite hue', () => {
      const redColor = { r: 255, g: 0, b: 0 };
      const result = findComplementaryHue(redColor, palette);
      // Red's complement should be closer to green/cyan
      expect(result).not.toEqual({ r: 255, g: 0, b: 0 });
    });
  });
});

describe('Color Extraction and Parsing', () => {
  describe('extractColors', () => {
    it('should extract colors from imageData', () => {
      // Create a simple 2x2 image with 2 colors
      const imageData = {
        data: new Uint8ClampedArray([
          255, 0, 0, 255,    // Red
          255, 0, 0, 255,    // Red
          0, 255, 0, 255,    // Green
          0, 255, 0, 255,    // Green
        ]),
        width: 2,
        height: 2,
      };

      const colors = extractColors(imageData, 10);
      expect(colors.length).toBeGreaterThan(0);
      expect(colors.length).toBeLessThanOrEqual(2);
    });

    it('should skip transparent pixels', () => {
      const imageData = {
        data: new Uint8ClampedArray([
          255, 0, 0, 255,    // Red (opaque)
          0, 255, 0, 0,      // Green (transparent)
          0, 0, 255, 255,    // Blue (opaque)
          255, 255, 0, 100,  // Yellow (semi-transparent)
        ]),
        width: 2,
        height: 2,
      };

      const colors = extractColors(imageData, 10);
      // Should only extract opaque red and blue
      expect(colors.length).toBeLessThanOrEqual(2);
    });

    it('should respect maxColors parameter', () => {
      const imageData = {
        data: new Uint8ClampedArray([
          255, 0, 0, 255,
          0, 255, 0, 255,
          0, 0, 255, 255,
          255, 255, 0, 255,
          255, 0, 255, 255,
        ]),
        width: 5,
        height: 1,
      };

      const colors = extractColors(imageData, 3);
      expect(colors.length).toBeLessThanOrEqual(3);
    });
  });

  describe('parseHexColorFile', () => {
    it('should parse valid hex colors', () => {
      const text = `#ff0000
#00ff00
#0000ff`;
      const colors = parseHexColorFile(text);
      
      expect(colors).toHaveLength(3);
      expect(colors[0]).toEqual({ r: 255, g: 0, b: 0 });
      expect(colors[1]).toEqual({ r: 0, g: 255, b: 0 });
      expect(colors[2]).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should skip empty lines and invalid colors', () => {
      const text = `#ff0000

invalid
#00ff00
not-a-color
#0000ff`;
      const colors = parseHexColorFile(text);
      
      expect(colors).toHaveLength(3);
    });

    it('should handle whitespace', () => {
      const text = `  #ff0000  
  #00ff00  
  #0000ff  `;
      const colors = parseHexColorFile(text);
      
      expect(colors).toHaveLength(3);
    });

    it('should return empty array for invalid input', () => {
      expect(parseHexColorFile('')).toEqual([]);
      expect(parseHexColorFile('no colors here')).toEqual([]);
    });
  });
});

describe('Color Mapping', () => {
  describe('createColorMapping', () => {
    it('should create distinct mappings when possible', () => {
      const sourceColors = [
        { r: 255, g: 0, b: 0, count: 100 },
        { r: 0, g: 255, b: 0, count: 50 },
      ];
      
      const targetPalette = [
        { r: 200, g: 0, b: 0 },
        { r: 0, g: 200, b: 0 },
        { r: 0, g: 0, b: 200 },
      ];

      const mapping = createColorMapping(sourceColors, targetPalette);
      
      expect(mapping.size).toBe(2);
      
      // Each source color should map to a different target
      const values = Array.from(mapping.values());
      const uniqueValues = new Set(values.map(v => `${v.r},${v.g},${v.b}`));
      expect(uniqueValues.size).toBe(2);
    });

    it('should prioritize more frequent colors', () => {
      const sourceColors = [
        { r: 255, g: 0, b: 0, count: 100 },
        { r: 0, g: 255, b: 0, count: 10 },
      ];
      
      const targetPalette = [
        { r: 200, g: 0, b: 0 },
      ];

      const mapping = createColorMapping(sourceColors, targetPalette);
      
      // Both should map, even though there's only one target
      expect(mapping.size).toBe(2);
    });

    it('should handle empty source colors', () => {
      const mapping = createColorMapping([], [{ r: 255, g: 0, b: 0 }]);
      expect(mapping.size).toBe(0);
    });
  });
});
