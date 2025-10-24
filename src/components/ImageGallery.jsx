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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <For each={props.images}>
          {(imageData, index) => (
            <div
              class={`border-2 rounded-lg p-2 cursor-pointer transition-all
                ${selectedImage() === index() 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }`}
              onClick={() => handleImageClick(imageData, index())}
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
                class="w-full h-auto"
                style={{ 'image-rendering': 'pixelated' }}
              />
              <Show when={props.labels && props.labels[index()]}>
                <p class="text-sm text-gray-600 mt-2 text-center">
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
