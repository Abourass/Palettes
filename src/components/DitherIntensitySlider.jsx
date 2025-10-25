import { createSignal, createEffect, Show } from 'solid-js';

export default function DitherIntensitySlider(props) {
  const [localValue, setLocalValue] = createSignal(props.value || 1.0);

  // Update local value when prop changes
  createEffect(() => {
    setLocalValue(props.value || 1.0);
  });

  const handleChange = (e) => {
    const value = parseFloat(e.target.value);
    setLocalValue(value);
    props.onChange?.(value);
  };

  // Only show slider if a dithering method is selected (not 'none')
  const shouldShow = () => props.ditheringMethod && props.ditheringMethod !== 'none';

  return (
    <Show when={shouldShow()}>
      <div class="space-y-3 pt-3 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-semibold text-gray-700">
            Dither Intensity
          </label>
          <span class="text-sm font-medium text-gray-600">
            {(localValue() * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={localValue()}
          onInput={handleChange}
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div class="flex justify-between text-xs text-gray-500">
          <span>Subtle (0%)</span>
          <span>Normal (100%)</span>
          <span>Strong (200%)</span>
        </div>
      </div>
    </Show>
  );
}
