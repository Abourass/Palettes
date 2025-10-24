import { createSignal, Show, onCleanup } from 'solid-js';
import ImageUpload from './components/ImageUpload';
import PaletteSelector from './components/PaletteSelector';
import ImageGallery from './components/ImageGallery';
import PaletteEditor from './components/PaletteEditor';
import HexFileUpload from './components/HexFileUpload';
import DitheringSelector from './components/DitheringSelector';
import QuantizationSelector from './components/QuantizationSelector';
import ColorHarmonyGenerator from './components/ColorHarmonyGenerator';
import Button from './components/Button';
import ImageDisplay from './components/ImageDisplay';
import Separator from './components/Separator';
import LoadingIndicator from './components/LoadingIndicator';
import { rgbToHex } from './utils/colorUtils';
import { getWorkerManager, terminateWorkerManager } from './utils/workerManager';

function App() {
  const [uploadedImage, setUploadedImage] = createSignal(null);
  const [originalImageData, setOriginalImageData] = createSignal(null);
  const [selectedPaletteName, setSelectedPaletteName] = createSignal(null);
  const [currentPalette, setCurrentPalette] = createSignal(null);
  const [processedVariations, setProcessedVariations] = createSignal([]);
  const [similarPaletteImages, setSimilarPaletteImages] = createSignal([]);
  const [selectedImageData, setSelectedImageData] = createSignal(null);
  const [finalPalette, setFinalPalette] = createSignal(null);
  const [ditheringMethod, setDitheringMethod] = createSignal('none');
  const [quantizationMode, setQuantizationMode] = createSignal('preserve');
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [processingMessage, setProcessingMessage] = createSignal('');

  // Get worker manager instance
  const workerManager = getWorkerManager();

  // Cleanup worker on component unmount
  onCleanup(() => {
    terminateWorkerManager();
  });

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

  const handlePaletteSelect = async (name, palette) => {
    setSelectedPaletteName(name);
    setCurrentPalette(palette);
    
    // Generate images with the selected palette using all 6 different strategies
    if (originalImageData()) {
      setIsProcessing(true);
      setProcessingMessage('Generating palette variations...');
      
      try {
        const imageData = originalImageData();
        const preserveDistinctness = quantizationMode() === 'preserve';
        
        // Generate all 6 variations with different color matching strategies (in worker)
        const variations = await workerManager.generateVariations(
          imageData,
          palette,
          ditheringMethod(),
          preserveDistinctness
        );
        
        setProcessingMessage('Generating similar palettes...');
        
        // Generate 6 similar palettes and apply them (in worker)
        const similarResults = await workerManager.generateSimilarPalettes(
          imageData,
          palette,
          ditheringMethod(),
          preserveDistinctness,
          6
        );
        
        setProcessedVariations(variations);
        setSimilarPaletteImages(similarResults);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image: ' + error.message);
      } finally {
        setIsProcessing(false);
        setProcessingMessage('');
      }
    }
  };

  const handleImageSelect = async (imageData, index) => {
    setSelectedImageData(imageData);
    
    // Extract colors from selected image to use as refined palette
    setIsProcessing(true);
    setProcessingMessage('Extracting colors from selected image...');
    
    try {
      const colors = await workerManager.extractColors(imageData, 16);
      setFinalPalette(colors);
    } catch (error) {
      console.error('Error extracting colors:', error);
      alert('Failed to extract colors: ' + error.message);
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const handlePaletteEdit = async (newPalette) => {
    setFinalPalette(newPalette);
    
    // Reapply palette to original image using standard matching
    if (originalImageData()) {
      setIsProcessing(true);
      setProcessingMessage('Applying edited palette...');
      
      try {
        const preserveDistinctness = quantizationMode() === 'preserve';
        const result = await workerManager.applyPalette(
          originalImageData(),
          newPalette,
          ditheringMethod(),
          preserveDistinctness,
          'perceptual'
        );
        setSelectedImageData(result.imageData);
      } catch (error) {
        console.error('Error applying palette:', error);
        alert('Failed to apply palette: ' + error.message);
      } finally {
        setIsProcessing(false);
        setProcessingMessage('');
      }
    }
  };

  const handleDitheringChange = (method) => {
    setDitheringMethod(method);
    
    // Regenerate variations if palette is already selected
    if (currentPalette() && originalImageData()) {
      handlePaletteSelect(selectedPaletteName(), currentPalette());
    }
  };

  const handleQuantizationChange = (mode) => {
    setQuantizationMode(mode);
    
    // Regenerate variations if palette is already selected
    if (currentPalette() && originalImageData()) {
      handlePaletteSelect(selectedPaletteName(), currentPalette());
    }
  };

  const handleCustomPaletteLoad = (palette) => {
    setSelectedPaletteName('Custom');
    setCurrentPalette(palette);
    handlePaletteSelect('Custom', palette);
  };

  const handleHarmonyPaletteGenerated = (palette, name) => {
    setSelectedPaletteName(name);
    setCurrentPalette(palette);
    handlePaletteSelect(name, palette);
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
      <LoadingIndicator show={isProcessing()} message={processingMessage()} />
      
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
              <h2 class="text-2xl font-semibold mb-6 text-gray-800">Step 2: Choose Palette & Dithering</h2>
              
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-700">Upload Custom Palette</h3>
                <HexFileUpload onPaletteLoad={handleCustomPaletteLoad} />
              </div>
              
              <Separator />
              
              <div class="mt-6 mb-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-700">Choose Preset Palette</h3>
                <PaletteSelector 
                  selectedPalette={selectedPaletteName()}
                  onSelect={handlePaletteSelect}
                />
              </div>
              
              <Separator />
              
              <div class="mt-6 mb-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-700">Generate Color Harmony</h3>
                <ColorHarmonyGenerator
                  imageData={originalImageData()}
                  onPaletteGenerated={handleHarmonyPaletteGenerated}
                />
              </div>
              
              <Separator />
              
              <div class="mt-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-700">Dithering Method</h3>
                <DitheringSelector
                  selected={ditheringMethod()}
                  onSelect={handleDitheringChange}
                />
              </div>
              
              <Separator />
              
              <div class="mt-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-700">Color Mapping Mode</h3>
                <QuantizationSelector
                  selected={quantizationMode()}
                  onSelect={handleQuantizationChange}
                />
              </div>
            </div>
          </Show>

          {/* Step 3: View Results */}
          <Show when={processedVariations().length > 0}>
            <div class="bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl">
              <h2 class="text-2xl font-semibold mb-6 text-gray-800">Step 3: Choose Your Favorite</h2>
              
              <div class="mb-8">
                <ImageGallery 
                  title="Color Matching Variations"
                  images={processedVariations().map(v => v.imageData)}
                  labels={processedVariations().map(v => v.name)}
                  descriptions={processedVariations().map(v => v.description)}
                  onSelect={handleImageSelect}
                />
              </div>

              <Separator />

              <div class="mt-8">
                <ImageGallery 
                  title="Similar Palettes"
                  images={similarPaletteImages().map(v => v.imageData)}
                  labels={['Similar 1', 'Similar 2', 'Similar 3', 'Similar 4', 'Similar 5', 'Similar 6']}
                  onSelect={(imageData, index) => handleImageSelect(imageData, index + 6)}
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
