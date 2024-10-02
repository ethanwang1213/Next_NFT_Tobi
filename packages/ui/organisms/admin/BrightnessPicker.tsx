import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useEffect, useState } from "react";

interface BrightnessPickerProps {
  initialValue?: number;
  onBrightnessChanged: (newValue: number) => void;
  afterChangeHandle: (newValue: number) => void;
}

const BrightnessPicker: React.FC<BrightnessPickerProps> = ({
  initialValue = 50,
  onBrightnessChanged,
  afterChangeHandle,
}) => {
  const [brightness, setBrightness] = useState<number>(initialValue);
  const handleBrightnessChange = (newValue: number) => {
    setBrightness(newValue);
    onBrightnessChanged(newValue);
  };

  useEffect(() => {
    setBrightness(initialValue);
  }, [initialValue]);

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
      {/* Brightness text and value edit */}
      <div className="flex items-center">
        <div className="text-[16px] font-[700] leading-[20px] w-[76px]">
          Brightness
        </div>
        <div className="w-[64px] h-[32px] rounded-[5px] bg-[#A5A1A1] text-white flex items-center justify-center font-[400] text-[16px] leading-[120%] mx-4">
          {brightness}
        </div>
      </div>

      {/* Brightness slider */}
      <div className="flex items-center mt-[18px] mb-[16px]">
        <Slider
          min={0}
          max={100}
          styles={{ handle: handleStyle, track: trackStyle, rail: railStyle }}
          value={brightness}
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
