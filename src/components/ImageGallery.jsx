import { For, Show, createSignal } from 'solid-js';

export default function ImageGallery(props) {
  const [selectedImage, setSelectedImage] = createSignal(null);

  const handleImageClick = (imageData, index) => {
    setSelectedImage(index);
    props.onSelect?.(imageData, index);
  };

  return (
    <div class="w-full">
      <h3 class="text-lg font-semibold mb-4">{props.title}</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <For each={props.images}>
          {(imageData, index) => (
            <div
              class={`border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-lg
                ${selectedImage() === index() 
                  ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200 scale-105' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              onClick={() => handleImageClick(imageData, index())}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleImageClick(imageData, index());
                }
              }}
              role="button"
              tabindex={0}
            >
              <canvas
                ref={(canvas) => {
                  if (canvas && imageData) {
                    canvas.width = imageData.width;
                    canvas.height = imageData.height;
                    const ctx = canvas.getContext('2d');
                    ctx.putImageData(imageData, 0, 0);
                  }
                }}
                class="w-full h-auto rounded shadow-sm"
                style={{ 'image-rendering': 'pixelated' }}
              />
              <Show when={props.labels && props.labels[index()]}>
                <p class="text-sm font-medium text-gray-700 mt-3 text-center">
                  {props.labels[index()]}
                </p>
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
