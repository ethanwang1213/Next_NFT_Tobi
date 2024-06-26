import { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  initialColor?: string;
  mode: boolean;
  onColorChanged: (newColor: string) => void;
}

const ColorPicker = ({
  initialColor = "#717171",
  mode = true,
  onColorChanged,
}: ColorPickerProps) => {
  const [color, setColor] = useState<string>(initialColor);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onColorChanged(newColor);
  };

  const handlePickerToggle = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Text */}
      {mode && (
        <div className="text-[16px] font-[700] leading-[20px] w-[92px]">
          Tint
        </div>
      )}
      {!mode && (
        <div className="text-[16px] font-[700] leading-[20px] w-[76px]">
          Tint
        </div>
      )}

      {/* Color container */}
      <div className="w-[144px] h-[32px] rounded-[5px] bg-[#A5A1A1] flex items-center justify-between px-4 font-[400]">
        <span>{color}</span>
      </div>

      <div
        className="w-[32px] h-[32px] rounded-full cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={handlePickerToggle}
      />

      {/* Color picker */}
      {showPicker && (
        <div className="absolute z-10">
          <HexColorPicker color={color} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
