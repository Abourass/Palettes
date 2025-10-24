// Toast notification component for image processing
import { Show } from 'solid-js';

function LoadingIndicator(props) {
  const isError = () => props.message && props.message.startsWith('Error:');
  
  return (
    <Show when={props.show}>
      {/* Toast notification in upper right corner */}
      <div class="fixed top-4 right-4 z-50 animate-slide-in-right">
        <div class={`bg-white rounded-lg shadow-2xl p-4 max-w-sm border-l-4 ${
          isError() ? 'border-red-500' : 'border-blue-500'
        }`}>
          <div class="flex items-start gap-3">
            {/* Spinner or Error Icon */}
            <div class="flex-shrink-0">
              <Show when={!isError()} fallback={
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }>
                <div class="relative w-6 h-6">
                  <div class="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
                  <div class="absolute inset-0 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
              </Show>
            </div>
            
            {/* Message Content */}
            <div class="flex-1 min-w-0">
              <h3 class={`text-sm font-semibold mb-1 ${isError() ? 'text-red-600' : 'text-gray-800'}`}>
                {isError() ? 'Processing Failed' : 'Processing Image'}
              </h3>
              <p class="text-xs text-gray-600 break-words">
                {props.message || 'Applying palette transformations...'}
              </p>
              
              {/* Optional progress indicator */}
              <Show when={props.progress !== undefined && !isError()}>
                <div class="mt-2">
                  <div class="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      class="bg-blue-500 h-full transition-all duration-300 ease-out"
                      style={{ width: `${props.progress}%` }}
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    {Math.round(props.progress)}% complete
                  </p>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}

export default LoadingIndicator;
