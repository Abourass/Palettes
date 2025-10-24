import { For, Show, createSignal } from 'solid-js';
import Lightbox from './Lightbox';

export default function ImageGallery(props) {
  const [selectedImage, setSelectedImage] = createSignal(null);
  const [lightboxOpen, setLightboxOpen] = createSignal(false);
  const [lightboxIndex, setLightboxIndex] = createSignal(null);

  const handleImageClick = (imageData, index) => {
    setSelectedImage(index);
    props.onSelect?.(imageData, index);
  };

  const handleLightboxOpen = (index, e) => {
    e.stopPropagation(); // Prevent the card click handler
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxSelect = () => {
    const index = lightboxIndex();
    if (index !== null && props.images[index]) {
      handleImageClick(props.images[index], index);
    }
  };

  const handlePrevious = () => {
    const currentIndex = lightboxIndex();
    if (currentIndex > 0) {
      setLightboxIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    const currentIndex = lightboxIndex();
    if (currentIndex < props.images.length - 1) {
      setLightboxIndex(currentIndex + 1);
    }
  };

  const getCurrentImageData = () => {
    const index = lightboxIndex();
    return index !== null ? props.images[index] : null;
  };

  const getCurrentTitle = () => {
    const index = lightboxIndex();
    return props.labels && index !== null ? props.labels[index] : null;
  };

  const getCurrentDescription = () => {
    const index = lightboxIndex();
    return props.descriptions && index !== null ? props.descriptions[index] : null;
  };

  return (
    <div class="w-full">
      <h3 class="text-lg font-semibold mb-4">{props.title}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={props.images}>
          {(imageData, index) => (
            <div
              class={`relative group border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-lg
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
              tabIndex={0}
            >
              {/* Magnifying glass button */}
              <button
                onClick={(e) => handleLightboxOpen(index(), e)}
                class="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-blue-50 hover:shadow-lg transition-all opacity-80 group-hover:opacity-100 hover:scale-110"
                aria-label="View full size"
                title="View full size"
              >
                <svg class="w-5 h-5 text-gray-700 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>

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
              <Show when={props.descriptions && props.descriptions[index()]}>
                <p class="text-xs text-gray-500 mt-1 text-center">
                  {props.descriptions[index()]}
                </p>
              </Show>
            </div>
          )}
        </For>
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen()}
        imageData={getCurrentImageData()}
        title={getCurrentTitle()}
        description={getCurrentDescription()}
        currentIndex={lightboxIndex()}
        totalCount={props.images.length}
        hasPrevious={lightboxIndex() > 0}
        hasNext={lightboxIndex() < props.images.length - 1}
        onClose={() => setLightboxOpen(false)}
        onSelect={handleLightboxSelect}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
}
