import { For } from 'solid-js';
import { PREDEFINED_PALETTES } from '../utils/palettes';
import { rgbToHex } from '../utils/colorUtils';

export default function PaletteSelector(props) {
  return (
    <div class="w-full">
      <h3 class="text-lg font-semibold mb-4">Select a Palette</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={Object.entries(PREDEFINED_PALETTES)}>
          {([name, colors]) => (
            <div
              class={`border-2 rounded-lg p-4 cursor-pointer transition-all
                ${props.selectedPalette === name 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }`}
              onClick={() => props.onSelect?.(name, colors)}
            >
              <h4 class="font-medium mb-2">{name}</h4>
              <div class="flex flex-wrap gap-1">
                <For each={colors}>
                  {(color) => (
                    <div
                      class="w-8 h-8 rounded border border-gray-300"
                      style={{
                        'background-color': rgbToHex(color.r, color.g, color.b)
                      }}
                      title={rgbToHex(color.r, color.g, color.b)}
                    />
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
