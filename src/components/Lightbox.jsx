import { Show, onMount, onCleanup } from 'solid-js';

export default function Lightbox(props) {
  let dialogRef;

  onMount(() => {
    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && props.isOpen) {
        props.onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    onCleanup(() => {
      document.removeEventListener('keydown', handleEscape);
    });
  });

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop, not the content
    if (e.target === e.currentTarget) {
      props.onClose?.();
    }
  };

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 backdrop-blur-sm"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
      >
        <div class="relative max-w-7xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-auto">
          {/* Close button */}
          <button
            onClick={() => props.onClose?.()}
            class="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Close lightbox"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image content */}
          <div class="p-8">
            <Show when={props.title}>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                {props.title}
              </h3>
            </Show>
            
            <Show when={props.description}>
              <p class="text-gray-600 mb-6">
                {props.description}
              </p>
            </Show>

            <div class="flex justify-center">
              <canvas
                ref={(canvas) => {
                  if (canvas && props.imageData) {
                    canvas.width = props.imageData.width;
                    canvas.height = props.imageData.height;
                    const ctx = canvas.getContext('2d');
                    ctx.putImageData(props.imageData, 0, 0);
                  }
                }}
                class="max-w-full h-auto border-2 border-gray-300 rounded-lg shadow-lg"
                style={{ 
                  'image-rendering': 'pixelated',
                  'max-height': '70vh'
                }}
              />
            </div>

            {/* Action buttons */}
            <div class="mt-6 flex gap-4 justify-center">
              <Show when={props.onSelect}>
                <button
                  onClick={() => {
                    props.onSelect?.();
                    props.onClose?.();
                  }}
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Select This Variation
                </button>
              </Show>
              
              <button
                onClick={() => props.onClose?.()}
                class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
