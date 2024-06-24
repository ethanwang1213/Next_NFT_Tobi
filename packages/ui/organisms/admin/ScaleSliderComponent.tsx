import NextImage from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useCallback, useState } from "react";

type Props = {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  className: string;
};

const ScaleSliderComponent: React.FC<Props> = ({
  scale,
  setScale,
  className,
}) => {
  const [inputValue, setInputValue] = useState("1");

  const inputValueChangeHandler = useCallback(
    (value) => {
      // Remove the degree sign and parse the number
      setInputValue(value);
      let numericValue = parseFloat(value);

      if (!isNaN(numericValue)) {
        if (numericValue > 2) numericValue = 2;
        if (numericValue < 0) numericValue = 0;
        setScale(numericValue);
      }
    },
    [setScale],
  );

  const sliderValueChangeHandler = useCallback(
    (value) => {
      setInputValue(`${value}`);
      setScale(value);
    },
    [setScale],
  );

  console.log("scale slider", scale);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-[220px] relative">
        <Slider
          min={0}
          max={2}
          styles={{
            handle: {
              borderColor: "#1779DE",
              height: 8,
              width: 8,
              marginLeft: 0,
              marginTop: -3,
              backgroundColor: "#1779DE",
            },
            track: {
              backgroundColor: "#1779DE",
              height: 2,
            },
            rail: {
              backgroundColor: "#1779DE",
              height: 2,
            },
          }}
          value={scale}
          onChange={(value: number) => sliderValueChangeHandler(value)}
          step={0.1}
        />
        <span className="absolute left-0 -top-2 text-primary-400 text-[8px] font-medium">
          0
        </span>
        <span className="absolute left-[109px] -ml-0 top-0 h-3 border border-primary-300"></span>
        <span className="absolute right-0 -top-2 text-primary-400 text-[8px] font-medium">
          2
        </span>
      </div>
      <NextImage
        width={16}
        height={16}
        src="/admin/images/icon/rotate_right.svg"
        alt="rotate right"
        className={`cursor-pointer mt-4`}
        onClick={() => {
          setScale(1);
        }}
      />
      <input
        type="text"
        className="w-8 h-4 mt-2 rounded-[3px] border border-primary bg-[#D9F1FD] outline-none
          text-secondary text-[8px] text-center pl-1"
        value={inputValue}
        onChange={(v) => inputValueChangeHandler(v.target.value)}
      />
    </div>
  );
};

export default React.memo(ScaleSliderComponent);
