import { useTranslations } from "next-intl";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useEffect, useState } from "react";

interface BrightnessPickerProps {
  initialValue?: number;
  onBrightnessChanged: (newValue: number) => void;
  afterChangeHandle: (newValue: number) => void;
}

const BrightnessPicker: React.FC<BrightnessPickerProps> = ({
  initialValue,
  onBrightnessChanged,
  afterChangeHandle,
}) => {
  const [brightness, setBrightness] = useState<number>(initialValue);
  const handleBrightnessChange = (newValue: number) => {
    setBrightness(newValue);
    onBrightnessChanged(newValue);
  };
  const t = useTranslations("Showcase");

  useEffect(() => {
    setBrightness(initialValue);
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);

    if (!isNaN(newValue) && newValue >= -50 && newValue <= 50) {
      setBrightness(newValue);
      onBrightnessChanged(newValue);
    }
  };

  const handleStyle = {
    borderColor: "#FAFAFA",
    height: 20,
    width: 20,
    marginLeft: 0,
    backgroundColor: "#FAFAFA",
  };

  const trackStyle = {
    backgroundColor: "#9F9C9C",
    height: 8,
  };

  const railStyle = {
    backgroundColor: "#9F9C9C",
    height: 8,
  };

  return (
    <div className="flex flex-col mt-6">
      <div className="flex items-center">
        <div className="text-[16px] font-[700] leading-[20px] w-[76px]">
          {t("Brightness")}
        </div>
        <input
          className="w-[64px] h-[32px] rounded-[5px] bg-[#A5A1A1] text-white text-center font-[400] text-[16px] leading-[120%] mx-4 outline-none no-spinner"
          value={brightness}
          onChange={handleInputChange}
          type="number"
        ></input>
      </div>

      <div className="flex items-center mt-[18px] mb-[16px]">
        <Slider
          min={-50}
          max={50}
          styles={{ handle: handleStyle, track: trackStyle, rail: railStyle }}
          value={brightness}
          defaultValue={0}
          onAfterChange={(value: number) => {
            afterChangeHandle(value);
          }}
          onChange={(value: number) => handleBrightnessChange(value)}
        />
      </div>
    </div>
  );
};

export default BrightnessPicker;
