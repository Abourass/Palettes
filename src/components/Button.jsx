import { Button as KobalteButton } from "@kobalte/core/button";

export default function Button(props) {
  const { variant = 'primary', children, class: className, ...rest } = props;
  
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 active:scale-95",
    secondary: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 active:scale-95",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 active:scale-95",
    small: "px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 active:scale-95",
  };
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className || ''}`;
  
  return (
    <KobalteButton class={combinedClassName} {...rest}>
      {children}
    </KobalteButton>
  );
}
