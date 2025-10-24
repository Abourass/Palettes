// Loading indicator component for image processing
import { Show } from 'solid-js';

function LoadingIndicator(props) {
  return (
    <Show when={props.show}>
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div class="flex flex-col items-center">
            {/* Spinner */}
            <div class="relative w-16 h-16 mb-4">
              <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            
            {/* Message */}
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Processing Image
            </h3>
            <p class="text-gray-600 text-center">
              {props.message || 'Applying palette transformations...'}
            </p>
            
            {/* Optional progress indicator */}
            <Show when={props.progress !== undefined}>
              <div class="w-full mt-4">
                <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    class="bg-blue-500 h-full transition-all duration-300 ease-out"
                    style={{ width: `${props.progress}%` }}
                  />
                </div>
                <p class="text-sm text-gray-500 text-center mt-2">
                  {Math.round(props.progress)}% complete
                </p>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}

export default LoadingIndicator;
