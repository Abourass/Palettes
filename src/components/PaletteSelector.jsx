import { For } from 'solid-js';
import { PREDEFINED_PALETTES } from '../utils/palettes';
import ColorSwatch from './ColorSwatch';

export default function PaletteSelector(props) {
  return (
    <div class="w-full">
      <h3 class="text-lg font-semibold mb-4">Select a Palette</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={Object.entries(PREDEFINED_PALETTES)}>
          {([name, colors]) => (
            <div
              class={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg
                ${props.selectedPalette === name 
                  ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              onClick={() => props.onSelect?.(name, colors)}
              role="button"
              tabindex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  props.onSelect?.(name, colors);
                }
              }}
            >
              <h4 class="font-semibold mb-3 text-gray-900">{name}</h4>
              <div class="flex flex-wrap gap-2">
                <For each={colors}>
                  {(color) => (
                    <ColorSwatch color={color} size="sm" showTooltip={true} />
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
