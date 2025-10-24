import { Separator as KobalteSeparator } from "@kobalte/core/separator";

export default function Separator(props) {
  const { orientation = "horizontal", class: className, ...rest } = props;
  
  const styles = orientation === "horizontal" 
    ? "w-full h-px bg-gray-200 my-6"
    : "h-full w-px bg-gray-200 mx-4";
  
  return (
    <KobalteSeparator 
      orientation={orientation}
      class={`${styles} ${className || ''}`}
      {...rest}
    />
  );
}
