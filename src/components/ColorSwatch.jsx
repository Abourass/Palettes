import { Tooltip } from "@kobalte/core/tooltip";
import { rgbToHex } from '../utils/colorUtils';

export default function ColorSwatch(props) {
  const { color, size = "lg", onClick, class: className, showTooltip = true } = props;
  const hexColor = rgbToHex(color.r, color.g, color.b);
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };
  
  const swatchContent = (
    <div
      class={`${sizeClasses[size]} rounded-lg border-2 border-gray-300 shadow-sm transition-all hover:scale-105 hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className || ''}`}
      style={{
        'background-color': hexColor
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabindex={onClick ? 0 : undefined}
    />
  );
  
  if (!showTooltip) {
    return swatchContent;
  }
  
  return (
    <Tooltip>
      <Tooltip.Trigger>
        {swatchContent}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm shadow-lg z-50">
          <div class="font-mono">{hexColor}</div>
          <div class="text-xs text-gray-300">
            RGB({color.r}, {color.g}, {color.b})
          </div>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip>
  );
}
