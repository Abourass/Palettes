import { For } from 'solid-js';
import { rgbToHex, hexToRgb } from '../utils/colorUtils';
import Button from './Button';
import ColorSwatch from './ColorSwatch';
import Separator from './Separator';

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
        <Button
          onClick={handleAddColor}
          variant="small"
        >
          Add Color
        </Button>
      </div>
      <Separator />
      <div class="flex flex-wrap gap-4 mt-6">
        <For each={props.palette}>
          {(color, index) => (
            <div class="flex flex-col items-center gap-2">
              <div class="relative group">
                <ColorSwatch color={color} size="lg" showTooltip={false} />
                <input
                  type="color"
                  value={rgbToHex(color.r, color.g, color.b)}
                  onInput={(e) => handleColorChange(index(), e.target.value)}
                  class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="Click to change color"
                />
                {props.palette.length > 1 && (
                  <button
                    onClick={() => handleRemoveColor(index())}
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-all shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Remove color"
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
