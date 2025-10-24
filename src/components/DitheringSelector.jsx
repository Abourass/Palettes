import { For } from 'solid-js';

const DITHERING_OPTIONS = [
  {
    value: 'none',
    name: 'No Dithering',
    description: 'Clean, sharp color transitions'
  },
  {
    value: 'floyd-steinberg',
    name: 'Floyd-Steinberg',
    description: 'Most popular, smooth gradients (recommended)'
  },
  {
    value: 'ordered',
    name: 'Ordered/Bayer',
    description: 'Retro crosshatch pattern aesthetic'
  },
  {
    value: 'atkinson',
    name: 'Atkinson',
    description: 'HyperCard style, preserves highlights'
  }
];

export default function DitheringSelector(props) {
  const handleChange = (value) => {
    props.onSelect?.(value);
  };

  return (
    <div class="space-y-3">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Dithering Method
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <For each={DITHERING_OPTIONS}>
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
              <div class="text-sm text-gray-600">
                {option.description}
              </div>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
