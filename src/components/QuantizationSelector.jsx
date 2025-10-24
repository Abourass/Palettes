import { For } from 'solid-js';

const QUANTIZATION_OPTIONS = [
  {
    value: 'preserve',
    name: 'Preserve Distinctness (Recommended for Pixel Art)',
    description: 'Ensures each unique color maps to a different palette color - prevents color merging'
  },
  {
    value: 'closest',
    name: 'Closest Match',
    description: 'Standard nearest-color matching - may merge similar colors together'
  }
];

export default function QuantizationSelector(props) {
  const handleChange = (value) => {
    props.onSelect?.(value);
  };

  return (
    <div class="space-y-3">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Color Mapping Mode
      </label>
      <p class="text-xs text-gray-600 mb-3">
        Choose how colors are matched when applying the palette
      </p>
      <div class="grid grid-cols-1 gap-3">
        <For each={QUANTIZATION_OPTIONS}>
          {(option) => (
            <button
              onClick={() => handleChange(option.value)}
              class={`
                text-left p-4 rounded-lg border-2 transition-all
                ${props.selected === option.value 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              <div class="font-semibold text-gray-900 mb-1">
                {option.name}
              </div>
              <div class="text-xs text-gray-600">
                {option.description}
              </div>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
