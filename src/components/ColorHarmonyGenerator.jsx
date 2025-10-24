import { createSignal, For, Show } from 'solid-js';
import { 
  generateAllHarmonies, 
  generatePaletteFromHex,
  extractPaletteFromImage,
  extractPaletteMedianCut
} from '../utils/colorHarmony';
import { rgbToHex, hexToRgb } from '../utils/colorUtils';
import ColorSwatch from './ColorSwatch';
import Button from './Button';

const HARMONY_TYPES = [
  { value: 'complementary', name: 'Complementary', description: 'Opposite colors on the color wheel' },
  { value: 'analogous', name: 'Analogous', description: 'Adjacent colors, harmonious feel' },
  { value: 'triadic', name: 'Triadic', description: 'Three colors evenly spaced' },
  { value: 'split-complementary', name: 'Split-Complementary', description: 'Base + two adjacent to complement' },
  { value: 'tetradic', name: 'Tetradic', description: 'Four colors evenly spaced' },
  { value: 'monochromatic', name: 'Monochromatic', description: 'Single hue with variations' },
  { value: 'compound', name: 'Compound', description: 'Two pairs of complementary colors' }
];

export default function ColorHarmonyGenerator(props) {
  const [mode, setMode] = createSignal('base-color'); // 'base-color', 'from-image'
  const [baseColor, setBaseColor] = createSignal('#3498db');
  const [selectedHarmony, setSelectedHarmony] = createSignal('complementary');
  const [generatedPalettes, setGeneratedPalettes] = createSignal(null);
  const [extractionMethod, setExtractionMethod] = createSignal('kmeans'); // 'kmeans', 'median-cut'

  const handleGenerateFromColor = () => {
    const rgb = hexToRgb(baseColor());
    if (!rgb) return;

    const harmonies = generateAllHarmonies(rgb);
    setGeneratedPalettes(harmonies);
  };

  const handleGenerateFromImage = () => {
    if (!props.imageData) return;

    let extractedPalette;
    if (extractionMethod() === 'kmeans') {
      extractedPalette = extractPaletteFromImage(props.imageData, 8, 10);
    } else {
      extractedPalette = extractPaletteMedianCut(props.imageData, 8);
    }

    // Generate harmonies from the most dominant color
    if (extractedPalette.length > 0) {
      const harmonies = generateAllHarmonies(extractedPalette[0]);
      // Add the extracted palette itself
      harmonies.extracted = extractedPalette;
      setGeneratedPalettes(harmonies);
    }
  };

  const handleUsePalette = (palette) => {
    props.onPaletteGenerated?.(palette, mode() === 'from-image' ? 'Generated from Image' : 'Color Harmony');
  };

  return (
    <div class="space-y-6">
      {/* Mode Selection */}
      <div class="flex gap-3">
        <button
          onClick={() => setMode('base-color')}
          class={`
            flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all
            ${mode() === 'base-color'
              ? 'border-blue-500 bg-blue-50 text-blue-900'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }
          `}
        >
          <div class="text-sm mb-1">Generate from Color</div>
          <div class="text-xs text-gray-600">Choose a base color</div>
        </button>
        <button
          onClick={() => setMode('from-image')}
          disabled={!props.imageData}
          class={`
            flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all
            ${mode() === 'from-image'
              ? 'border-blue-500 bg-blue-50 text-blue-900'
              : props.imageData
                ? 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <div class="text-sm mb-1">Extract from Image</div>
          <div class="text-xs text-gray-600">Use uploaded image</div>
        </button>
      </div>

      {/* Base Color Input */}
      <Show when={mode() === 'base-color'}>
        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            Choose Base Color
          </label>
          <div class="flex items-center gap-4">
            <input
              type="color"
              value={baseColor()}
              onInput={(e) => setBaseColor(e.target.value)}
              class="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-300"
            />
            <div class="flex-1">
              <input
                type="text"
                value={baseColor()}
                onInput={(e) => setBaseColor(e.target.value)}
                placeholder="#3498db"
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm"
              />
              <p class="text-xs text-gray-600 mt-2">
                Pick a color or enter a hex code to generate color harmonies
              </p>
            </div>
            <Button onClick={handleGenerateFromColor} variant="primary">
              Generate Harmonies
            </Button>
          </div>
        </div>
      </Show>

      {/* Image Extraction Options */}
      <Show when={mode() === 'from-image'}>
        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            Extraction Method
          </label>
          <div class="flex gap-3 mb-4">
            <button
              onClick={() => setExtractionMethod('kmeans')}
              class={`
                flex-1 px-4 py-2 rounded-lg border-2 text-sm transition-all
                ${extractionMethod() === 'kmeans'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              K-Means Clustering
              <div class="text-xs text-gray-600 mt-1">Better for gradients</div>
            </button>
            <button
              onClick={() => setExtractionMethod('median-cut')}
              class={`
                flex-1 px-4 py-2 rounded-lg border-2 text-sm transition-all
                ${extractionMethod() === 'median-cut'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Median Cut
              <div class="text-xs text-gray-600 mt-1">Better for distinct regions</div>
            </button>
          </div>
          <Button onClick={handleGenerateFromImage} variant="primary" class="w-full">
            Extract & Generate Harmonies
          </Button>
        </div>
      </Show>

      {/* Generated Palettes */}
      <Show when={generatedPalettes()}>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800">Generated Color Harmonies</h3>
          
          {/* Show extracted palette first if from image */}
          <Show when={mode() === 'from-image' && generatedPalettes().extracted}>
            <div class="bg-white p-4 rounded-lg border-2 border-gray-200">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h4 class="font-semibold text-gray-900">Extracted from Image</h4>
                  <p class="text-xs text-gray-600">Dominant colors from your image</p>
                </div>
                <Button
                  onClick={() => handleUsePalette(generatedPalettes().extracted)}
                  variant="small"
                >
                  Use This Palette
                </Button>
              </div>
              <div class="flex flex-wrap gap-2">
                <For each={generatedPalettes().extracted}>
                  {(color) => (
                    <div class="flex flex-col items-center gap-1">
                      <ColorSwatch color={color} size="md" />
                      <span class="text-xs font-mono text-gray-600">
                        {rgbToHex(color.r, color.g, color.b)}
                      </span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>

          {/* Harmony Palettes */}
          <For each={HARMONY_TYPES}>
            {(harmonyType) => (
              <Show when={generatedPalettes()[harmonyType.value]}>
                <div class="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all">
                  <div class="flex items-center justify-between mb-3">
                    <div>
                      <h4 class="font-semibold text-gray-900">{harmonyType.name}</h4>
                      <p class="text-xs text-gray-600">{harmonyType.description}</p>
                    </div>
                    <Button
                      onClick={() => handleUsePalette(generatedPalettes()[harmonyType.value])}
                      variant="small"
                    >
                      Use This Palette
                    </Button>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <For each={generatedPalettes()[harmonyType.value]}>
                      {(color) => (
                        <div class="flex flex-col items-center gap-1">
                          <ColorSwatch color={color} size="md" />
                          <span class="text-xs font-mono text-gray-600">
                            {rgbToHex(color.r, color.g, color.b)}
                          </span>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            )}
          </For>
        </div>
      </Show>

      {/* Help Text */}
      <Show when={!generatedPalettes()}>
        <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <p class="font-semibold mb-2">💡 How to use Color Harmony Generator:</p>
          <ul class="list-disc list-inside space-y-1 text-blue-800">
            <li><strong>From Color:</strong> Pick a base color to generate 7 different color harmonies</li>
            <li><strong>From Image:</strong> Extract dominant colors and generate harmonies based on your image</li>
            <li>Click "Use This Palette" to apply any generated palette to your image</li>
          </ul>
        </div>
      </Show>
    </div>
  );
}
