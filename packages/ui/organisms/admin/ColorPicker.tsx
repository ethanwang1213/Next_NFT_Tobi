import { useShowcaseEditUnity } from "contexts/ShowcaseEditUnityContext";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
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
  const pickerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Showcase");

  const { pauseUnityInputs, resumeUnityInputs } = useShowcaseEditUnity();

  useEffect(() => {
    if (!showPicker) {
      setColor(initialColor);
    }
  }, [initialColor, showPicker]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onColorChanged(newColor);
  };

  const handlePickerToggle = () => {
    setShowPicker(!showPicker);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    onColorChanged(newColor);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="flex items-center space-x-4" ref={pickerRef}>
      {mode && (
        <div className="text-[16px] font-[700] leading-[20px] w-[92px]">
          {t("Tint")}
        </div>
      )}
      {!mode && (
        <div className="text-[16px] font-[700] leading-[20px] w-[80px]">
          {t("Tint")}
        </div>
      )}

      <div className="w-[144px] h-[32px]">
        <input
          type="text"
          maxLength={7}
          value={color}
          onChange={handleInputChange}
          onFocus={pauseUnityInputs}
          onBlur={resumeUnityInputs}
          className="w-full h-full border-none outline-none rounded-[5px] bg-[#A5A1A1] flex items-center justify-between px-4 font-[400]"
        />
      </div>

      <div
        className="w-[32px] h-[32px] rounded-full cursor-pointer border-[1px] border-white"
        style={{ backgroundColor: color }}
        onClick={handlePickerToggle}
      />

      {showPicker && (
        <div className="absolute z-10">
          <HexColorPicker color={color} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
