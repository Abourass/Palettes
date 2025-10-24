# Testing Documentation

This document provides comprehensive information about the automated testing infrastructure for the Palettes project.

## Overview

The Palettes project uses **Vitest** as its testing framework. Vitest is a modern, fast test runner built on top of Vite, providing excellent performance and a great developer experience.

## Test Structure

### Test Files Location
All test files are located in the `src/test/` directory:
- `colorUtils.test.js` - Tests for color utility functions
- `colorHarmony.test.js` - Tests for color harmony generation
- `palettes.test.js` - Tests for predefined palettes
- `setup.js` - Test environment setup

### Test Coverage

Current test coverage (as of last run):
- **colorHarmony.js**: ~90% coverage
- **colorUtils.js**: ~47% coverage (core functions fully tested)
- **palettes.js**: 100% coverage
- **Overall**: ~61% coverage with 103 passing tests

## Running Tests

### Available Commands

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (re-runs on file changes)
pnpm test:watch

# Run tests with interactive UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

### Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run tests:
   ```bash
   pnpm test
   ```

## Test Suites

### 1. Color Utilities Tests (`colorUtils.test.js`)

Tests core color manipulation and conversion functions:

#### Color Conversion
- RGB to Hex conversion
- Hex to RGB conversion
- RGB to HSL conversion
- HSL to RGB conversion
- Validates edge cases (grayscale, pure colors, invalid input)

#### Color Measurement
- Color distance calculation (Euclidean)
- Luminance calculation (perceived brightness)
- Saturation measurement
- Hue extraction
- Hue distance (circular wraparound)

#### Color Matching
- `findClosestColor` - Standard RGB distance matching
- `findClosestByLuminosity` - Brightness-based matching
- `findClosestByHue` - Hue-based matching
- `findClosestBySaturation` - Saturation-based matching
- `findInvertedLuminosity` - Inverted brightness matching
- `findComplementaryHue` - Opposite hue matching

#### Color Extraction and Parsing
- Extract colors from image data
- Parse hex color files
- Create color mappings with distinctness preservation
- Handle transparent pixels

**Total Tests**: 46 tests covering all core color operations

### 2. Color Harmony Tests (`colorHarmony.test.js`)

Tests color harmony generation algorithms based on color theory:

#### Harmony Generation Functions
- **Complementary** - Opposite colors (180° apart)
- **Analogous** - Adjacent colors (30° spread)
- **Triadic** - Evenly spaced colors (120° apart)
- **Split-Complementary** - Base + adjacent to complement
- **Tetradic** - Four evenly spaced colors (90° apart)
- **Monochromatic** - Single hue variations
- **Compound** - Two complementary pairs

#### Palette Extraction
- K-means clustering extraction
- Median cut algorithm
- Extract from image data
- Generate harmonies from extracted colors

#### Integration Tests
- `generateAllHarmonies` - Creates all harmony types from one color
- `generatePaletteFromHex` - Generates palettes from hex strings
- Edge cases (black, white, grayscale colors)

**Total Tests**: 37 tests covering all harmony types and extraction methods

### 3. Predefined Palettes Tests (`palettes.test.js`)

Tests the integrity and quality of built-in pixel art palettes:

#### Palette Structure
- Validates all expected palettes exist
- Checks RGB value ranges (0-255)
- Ensures integer values
- Verifies no duplicate colors within palettes

#### Specific Palette Tests
- **GB Classic** - Game Boy green palette (4 colors)
- **NES** - Nintendo Entertainment System colors
- **Pico-8** - Fantasy console palette (16 colors)
- **Commodore 64** - Classic computer palette (16 colors)
- **ENDESGA 32** - Modern pixel art palette
- **Sweetie 16** - Popular indie game palette (16 colors)

#### Quality Checks
- Color diversity across palettes
- Serialization/deserialization
- Practical usage scenarios
- Immutability verification

**Total Tests**: 20 tests ensuring palette quality and consistency

## Test Configuration

### Vitest Configuration (`vitest.config.js`)

```javascript
{
  environment: 'jsdom',           // DOM simulation for browser APIs
  globals: true,                   // Global test functions
  setupFiles: './src/test/setup.js',
  coverage: {
    provider: 'v8',               // Fast native coverage
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'src/test/',
      '**/*.config.js',
      'dist/',
    ],
  },
}
```

## Writing New Tests

### Basic Test Structure

```javascript
import { describe, it, expect } from 'vitest';
import { functionToTest } from '../utils/yourModule';

describe('Feature Name', () => {
  describe('Sub-feature', () => {
    it('should do something specific', () => {
      const result = functionToTest(input);
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Best Practices

1. **Organize with describe blocks**: Group related tests
2. **Use descriptive test names**: "should [expected behavior] when [condition]"
3. **Test edge cases**: null, undefined, empty arrays, boundary values
4. **Test error handling**: Invalid inputs, out of range values
5. **Keep tests independent**: Don't rely on order or shared state
6. **Test one thing**: Each test should verify one specific behavior

### Common Assertions

```javascript
// Equality
expect(value).toBe(exactValue);           // Strict equality (===)
expect(value).toEqual(object);            // Deep equality for objects/arrays

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThanOrEqual(10);
expect(value).toBeCloseTo(3.14, 2);      // Floating point comparison

// Arrays/Objects
expect(array).toHaveLength(3);
expect(object).toHaveProperty('key');
expect(array).toContain(item);
expect(array).toContainEqual(object);

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).not.toThrow();
```

## Continuous Integration

Tests are automatically run on:
- Pull request creation
- Push to any branch
- Manual workflow dispatch

### GitHub Actions Workflow

The test workflow:
1. Checks out the code
2. Sets up Node.js
3. Installs dependencies with pnpm
4. Runs the test suite
5. Reports results

## Test Coverage Goals

### Current Coverage
- Core color utilities: Well tested (conversion, measurement, matching)
- Color harmony: Excellent coverage (~90%)
- Predefined palettes: Complete coverage (100%)

### Areas Not Covered
Some areas have intentionally limited coverage:
- **Image processing functions** - Require complex ImageData mock setup
- **Dithering algorithms** - Visual algorithms that benefit from manual testing
- **Worker integration** - Web Worker functionality tested separately
- **UI components** - React/Solid components require component testing setup

These areas rely on:
- Manual testing during development
- Visual regression testing
- Integration testing in the browser

## Debugging Tests

### Run Specific Test File
```bash
pnpm test src/test/colorUtils.test.js
```

### Run Specific Test
```bash
pnpm test -t "should convert RGB to hex"
```

### Watch Mode for Development
```bash
pnpm test:watch
```

### Debug with UI
```bash
pnpm test:ui
```
Opens an interactive web UI for exploring and debugging tests.

## Troubleshooting

### Tests Fail After Code Changes
1. Run `pnpm test` to see which tests fail
2. Check if the test expectations need updating
3. Verify your changes didn't break existing behavior
4. Update tests if the new behavior is intentional

### Coverage Drops
1. Run `pnpm test:coverage` to see uncovered lines
2. Add tests for new functions
3. Consider if manual testing is more appropriate

### Test Performance Issues
1. Avoid expensive operations in tests
2. Mock heavy dependencies
3. Use `test.skip()` to temporarily disable slow tests
4. Run specific test files during development

## Contributing

When adding new features:

1. **Write tests first** (TDD approach) or alongside your implementation
2. **Aim for good coverage** of your new code
3. **Test edge cases** and error conditions
4. **Update this documentation** if adding new test patterns
5. **Run full test suite** before submitting PR

### Test Checklist for PRs
- [ ] All existing tests pass
- [ ] New features have test coverage
- [ ] Edge cases are tested
- [ ] Error conditions are handled
- [ ] Tests are documented if using new patterns

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Color Theory Background](./COLOR_HARMONY.md)
- [Dithering Algorithms](./DITHERING.md)

## Support

If you have questions about testing:
1. Check this documentation
2. Look at existing test examples
3. Run `pnpm test:ui` for interactive debugging
4. Open an issue for test-related questions
