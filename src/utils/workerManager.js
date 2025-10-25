// Worker manager for handling Web Worker communication
// Provides a Promise-based API for the image processing worker

class ImageProcessorWorkerManager {
  constructor() {
    this.worker = null;
    this.messageId = 0;
    this.pendingMessages = new Map();
    this.initWorker();
  }

  initWorker() {
    // Create worker with module type support
    this.worker = new Worker(
      new URL('../workers/imageProcessor.worker.js', import.meta.url),
      { type: 'module' }
    );

    // Handle messages from worker
    this.worker.onmessage = (e) => {
      const { type, id, data, error } = e.data;
      
      const pending = this.pendingMessages.get(id);
      if (!pending) return;

      if (type === 'error') {
        pending.reject(new Error(error));
      } else {
        pending.resolve(data);
      }
      
      this.pendingMessages.delete(id);
    };

    // Handle worker errors
    this.worker.onerror = (error) => {
      console.error('Worker error:', error);
      // Reject all pending messages
      this.pendingMessages.forEach(pending => {
        pending.reject(new Error('Worker error: ' + error.message));
      });
      this.pendingMessages.clear();
    };
  }

  // Send message to worker and return a promise
  sendMessage(type, data) {
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      this.pendingMessages.set(id, { resolve, reject });
      
      // Serialize ImageData for transfer
      const serializedData = this.serializeImageData(data);
      
      this.worker.postMessage({
        type,
        id,
        data: serializedData
      });
    });
  }

  // Serialize ImageData objects for worker transfer
  serializeImageData(data) {
    const serialized = { ...data };
    
    if (data.imageData instanceof ImageData) {
      serialized.imageData = {
        data: Array.from(data.imageData.data),
        width: data.imageData.width,
        height: data.imageData.height
      };
    }
    
    return serialized;
  }

  // Deserialize ImageData from worker
  deserializeImageData(data) {
    if (data.imageData && data.imageData.data && data.imageData.width && data.imageData.height) {
      return new ImageData(
        new Uint8ClampedArray(data.imageData.data),
        data.imageData.width,
        data.imageData.height
      );
    }
    return data;
  }

  // Generate palette variations
  async generateVariations(imageData, palette, ditheringMethod, preserveDistinctness, ditherIntensity = 1.0) {
    const result = await this.sendMessage('generateVariations', {
      imageData,
      palette,
      ditheringMethod,
      preserveDistinctness,
      ditherIntensity
    });
    
    // Reconstruct ImageData objects
    return result.map(variation => ({
      ...variation,
      imageData: this.deserializeImageData(variation)
    }));
  }

  // Generate similar palettes
  async generateSimilarPalettes(imageData, palette, ditheringMethod, preserveDistinctness, count = 6, ditherIntensity = 1.0) {
    const result = await this.sendMessage('generateSimilarPalettes', {
      imageData,
      palette,
      ditheringMethod,
      preserveDistinctness,
      count,
      ditherIntensity
    });
    
    // Reconstruct ImageData objects
    return result.map(variation => ({
      ...variation,
      imageData: this.deserializeImageData(variation)
    }));
  }

  // Apply palette to image
  async applyPalette(imageData, palette, ditheringMethod, preserveDistinctness, matchingStrategy = 'perceptual', ditherIntensity = 1.0) {
    const result = await this.sendMessage('applyPalette', {
      imageData,
      palette,
      ditheringMethod,
      preserveDistinctness,
      matchingStrategy,
      ditherIntensity
    });
    
    return this.deserializeImageData(result);
  }

  // Extract colors from image
  async extractColors(imageData, maxColors = 16) {
    return await this.sendMessage('extractColors', {
      imageData,
      maxColors
    });
  }

  // Terminate worker
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.pendingMessages.clear();
    }
  }
}

// Create singleton instance
let workerManager = null;

export function getWorkerManager() {
  if (!workerManager) {
    workerManager = new ImageProcessorWorkerManager();
  }
  return workerManager;
}

export function terminateWorkerManager() {
  if (workerManager) {
    workerManager.terminate();
    workerManager = null;
  }
}
