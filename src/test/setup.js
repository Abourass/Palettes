import '@testing-library/jest-dom/vitest';

// Setup test environment
// This file is run before all test files

// Polyfill ImageData for test environment
if (typeof global.ImageData === 'undefined') {
  global.ImageData = class ImageData {
    constructor(data, width, height) {
      if (data instanceof Uint8ClampedArray) {
        this.data = data;
        this.width = width;
        this.height = height ||  (data.length / (width * 4));
      } else if (typeof data === 'number') {
        // new ImageData(width, height)
        this.width = data;
        this.height = width;
        this.data = new Uint8ClampedArray(this.width * this.height * 4);
      }
    }
  };
}

// Global setup for vitest tests
// jest-dom provides additional matchers for DOM testing if needed in the future
