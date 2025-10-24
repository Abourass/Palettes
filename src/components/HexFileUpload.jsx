import { parseHexColorFile } from '../utils/colorUtils';

export default function HexFileUpload(props) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const colors = parseHexColorFile(text);
        if (colors.length > 0) {
          props.onPaletteLoad?.(colors);
        } else {
          alert('No valid hex colors found in file. Format: one hex color per line (e.g., #FF0000)');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div class="w-full">
      <label class="block">
        <span class="text-sm font-medium text-gray-700 mb-2 block">
          Upload Hex Color File
        </span>
        <input
          type="file"
          accept=".txt,.hex,.pal"
          onChange={handleFileChange}
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p class="mt-1 text-xs text-gray-500">
          Text file with one hex color per line (e.g., #FF0000)
        </p>
      </label>
    </div>
  );
}
