import { createSignal, Show, createEffect } from 'solid-js';
import ImageUpload from './components/ImageUpload';
import PaletteSelector from './components/PaletteSelector';
import ImageGallery from './components/ImageGallery';
import PaletteEditor from './components/PaletteEditor';
import HexFileUpload from './components/HexFileUpload';
import Button from './components/Button';
import ImageDisplay from './components/ImageDisplay';
import Separator from './components/Separator';
import { 
  extractColors, 
  applyPalette, 
  generateSimilarPalettes,
  rgbToHex 
} from './utils/colorUtils';

function App() {
  const [uploadedImage, setUploadedImage] = createSignal(null);
  const [originalImageData, setOriginalImageData] = createSignal(null);
  const [selectedPaletteName, setSelectedPaletteName] = createSignal(null);
  const [currentPalette, setCurrentPalette] = createSignal(null);
  const [processedImages, setProcessedImages] = createSignal([]);
  const [similarPaletteImages, setSimilarPaletteImages] = createSignal([]);
  const [selectedImageData, setSelectedImageData] = createSignal(null);
  const [finalPalette, setFinalPalette] = createSignal(null);

  const handleImageLoad = (dataUrl) => {
    setUploadedImage(dataUrl);
    
    // Load image and extract colors
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      setOriginalImageData(imageData);
    };
    img.src = dataUrl;
  };

  const handlePaletteSelect = (name, palette) => {
    setSelectedPaletteName(name);
    setCurrentPalette(palette);
    
    // Generate images with the selected palette
    if (originalImageData()) {
      const imageData = originalImageData();
      
      // Apply selected palette three times (same result, different references for UI)
      const result1 = applyPalette(imageData, palette);
      const result2 = applyPalette(imageData, palette);
      const result3 = applyPalette(imageData, palette);
      
      // Generate similar palettes and apply them
      const similarPalettes = generateSimilarPalettes(palette, 3);
      const similarResults = similarPalettes.map(p => applyPalette(imageData, p));
      
      setProcessedImages([result1, result2, result3]);
      setSimilarPaletteImages(similarResults);
    }
  };

  const handleImageSelect = (imageData, index) => {
    setSelectedImageData(imageData);
    
    // Extract colors from selected image to use as refined palette
    const colors = extractColors(imageData, 16);
    setFinalPalette(colors);
  };

  const handlePaletteEdit = (newPalette) => {
    setFinalPalette(newPalette);
    
    // Reapply palette to original image
    if (originalImageData()) {
      const result = applyPalette(originalImageData(), newPalette);
      setSelectedImageData(result);
    }
  };

  const handleCustomPaletteLoad = (palette) => {
    setSelectedPaletteName('Custom');
    setCurrentPalette(palette);
    handlePaletteSelect('Custom', palette);
  };

  const downloadPalette = () => {
    if (!finalPalette()) return;
    
    // Create palette file content
    const hexColors = finalPalette().map(c => rgbToHex(c.r, c.g, c.b)).join('\n');
    
    // Create and download file
    const blob = new Blob([hexColors], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadImage = () => {
    if (!selectedImageData()) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = selectedImageData().width;
    canvas.height = selectedImageData().height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(selectedImageData(), 0, 0);
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pixel-art-recolored.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div class="max-w-7xl mx-auto">
        <header class="text-center mb-12">
          <h1 class="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Palette Analyzer
          </h1>
          <p class="text-lg text-gray-600">
            Upload pixel art, choose a palette, and refine the colors
          </p>
        </header>

        <div class="space-y-8">
          {/* Step 1: Upload Image */}
          <div class="bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800">Step 1: Upload Image</h2>
            <ImageUpload onImageLoad={handleImageLoad} />
            
            <Show when={uploadedImage()}>
              <div class="mt-6">
                <Separator />
                <h3 class="text-lg font-semibold mb-4 mt-6">Original Image</h3>
                <ImageDisplay 
                  src={uploadedImage()} 
                  alt="Uploaded pixel art"
                />
              </div>
            </Show>
          </div>

          {/* Step 2: Select or Upload Palette */}
          <Show when={uploadedImage()}>
            <div class="bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl">
              <h2 class="text-2xl font-semibold mb-6 text-gray-800">Step 2: Choose Palette</h2>
              
              <div class="mb-6">
                <HexFileUpload onPaletteLoad={handleCustomPaletteLoad} />
              </div>
              
              <Separator />
              
              <div class="mt-6">
                <PaletteSelector 
                  selectedPalette={selectedPaletteName()}
                  onSelect={handlePaletteSelect}
                />
              </div>
            </div>
          </Show>

          {/* Step 3: View Results */}
          <Show when={processedImages().length > 0}>
            <div class="bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl">
              <h2 class="text-2xl font-semibold mb-6 text-gray-800">Step 3: Choose Your Favorite</h2>
              
              <div class="mb-8">
                <ImageGallery 
                  title="Selected Palette Variations"
                  images={processedImages()}
                  labels={['Variation 1', 'Variation 2', 'Variation 3']}
                  onSelect={handleImageSelect}
                />
              </div>

              <Separator />

              <div class="mt-8">
                <ImageGallery 
                  title="Similar Palettes"
                  images={similarPaletteImages()}
                  labels={['Similar 1', 'Similar 2', 'Similar 3']}
                  onSelect={handleImageSelect}
                />
              </div>
            </div>
          </Show>

          {/* Step 4: Refine and Download */}
          <Show when={finalPalette()}>
            <div class="bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl">
              <h2 class="text-2xl font-semibold mb-6 text-gray-800">Step 4: Refine & Download</h2>
              
              <div class="mb-6">
                <PaletteEditor 
                  palette={finalPalette()}
                  onChange={handlePaletteEdit}
                />
              </div>

              <Show when={selectedImageData()}>
                <div class="mb-6">
                  <Separator />
                  <h3 class="text-lg font-semibold mb-4 mt-6">Preview</h3>
                  <canvas
                    ref={(canvas) => {
                      if (canvas && selectedImageData()) {
                        canvas.width = selectedImageData().width;
                        canvas.height = selectedImageData().height;
                        const ctx = canvas.getContext('2d');
                        ctx.putImageData(selectedImageData(), 0, 0);
                      }
                    }}
                    class="max-w-md mx-auto border-2 border-gray-300 rounded-lg shadow-md"
                    style={{ 'image-rendering': 'pixelated' }}
                  />
                </div>
              </Show>

              <Separator />

              <div class="flex gap-4 justify-center mt-6">
                <Button
                  onClick={downloadPalette}
                  variant="primary"
                >
                  Download Palette
                </Button>
                <Button
                  onClick={downloadImage}
                  variant="secondary"
                >
                  Download Image
                </Button>
              </div>
            </div>
          </Show>
        </div>

        <footer class="text-center mt-12 text-gray-600 text-sm">
          <p>Built with SolidJS, Tailwind CSS, and Kobalte</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
