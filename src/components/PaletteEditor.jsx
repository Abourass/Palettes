import { For, createSignal } from 'solid-js';
import { rgbToHex, hexToRgb } from '../utils/colorUtils';

export default function PaletteEditor(props) {
  const handleColorChange = (index, newHex) => {
    const rgb = hexToRgb(newHex);
    if (rgb) {
      const newPalette = [...props.palette];
      newPalette[index] = rgb;
      props.onChange?.(newPalette);
    }
  };

  const handleAddColor = () => {
    const newPalette = [...props.palette, { r: 128, g: 128, b: 128 }];
    props.onChange?.(newPalette);
  };

  const handleRemoveColor = (index) => {
    if (props.palette.length > 1) {
      const newPalette = props.palette.filter((_, i) => i !== index);
      props.onChange?.(newPalette);
    }
  };

  return (
    <div class="w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Edit Palette</h3>
        <button
          onClick={handleAddColor}
          class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add Color
        </button>
      </div>
      <div class="flex flex-wrap gap-3">
        <For each={props.palette}>
          {(color, index) => (
            <div class="flex flex-col items-center gap-2">
              <div class="relative">
                <input
                  type="color"
                  value={rgbToHex(color.r, color.g, color.b)}
                  onInput={(e) => handleColorChange(index(), e.target.value)}
                  class="w-16 h-16 rounded border-2 border-gray-300 cursor-pointer"
                />
                {props.palette.length > 1 && (
                  <button
                    onClick={() => handleRemoveColor(index())}
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
              <span class="text-xs text-gray-600 font-mono">
                {rgbToHex(color.r, color.g, color.b)}
              </span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
