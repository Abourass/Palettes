import { Image as KobalteImage } from "@kobalte/core/image";

export default function ImageDisplay(props) {
  const { src, alt, fallbackDelay = 600, class: className, style, ...rest } = props;
  
  return (
    <KobalteImage 
      fallbackDelay={fallbackDelay}
      class="max-w-md mx-auto"
      {...rest}
    >
      <KobalteImage.Img
        src={src}
        alt={alt}
        class={`border-2 border-gray-300 rounded-lg shadow-sm ${className || ''}`}
        style={{
          'image-rendering': 'pixelated',
          ...style
        }}
      />
      <KobalteImage.Fallback class="flex items-center justify-center h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
        <div class="text-center text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Loading image...</p>
        </div>
      </KobalteImage.Fallback>
    </KobalteImage>
  );
}
