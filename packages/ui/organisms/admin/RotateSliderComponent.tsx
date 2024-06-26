import NextImage from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useCallback, useState } from "react";

type Props = {
  rotate: number;
  setRotate: React.Dispatch<React.SetStateAction<number>>;
  className: string;
};

const RotateSliderComponent: React.FC<Props> = ({
  rotate,
  setRotate,
  className,
}) => {
  const [inputValue, setInputValue] = useState("0°");

  const inputValueChangeHandler = useCallback(
    (value) => {
      // Remove the degree sign and parse the number
      let numericValue = parseInt(value.replace("°", ""), 10);

      if (!isNaN(numericValue)) {
        if (numericValue > 180) numericValue = 180;
        if (numericValue < -180) numericValue = -180;
        setRotate(180 - numericValue);
        setInputValue(`${numericValue}°`);
      } else {
        setInputValue(value);
      }
    },
    [setRotate],
  );

  const sliderValueChangeHandler = useCallback(
    (value) => {
      setInputValue(`${180 - value}°`);
      setRotate(value);
    },
    [setRotate],
  );

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-[220px] relative">
        <Slider
          min={0}
          max={360}
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
          value={rotate}
          onChange={(value: number) => sliderValueChangeHandler(value)}
        />
        <span className="absolute left-0 -top-2 text-primary-400 text-[8px] font-medium">
          180
        </span>
        <span className="absolute left-[109px] -ml-0 top-0 h-3 border border-primary-300"></span>
        <span className="absolute right-0 -top-2 text-primary-400 text-[8px] font-medium">
          -180
        </span>
      </div>
      <NextImage
        width={16}
        height={16}
        src="/admin/images/icon/rotate_right.svg"
        alt="rotate right"
        className={`cursor-pointer mt-4`}
        onClick={() => {
          setRotate(180);
          setInputValue("0°");
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

export default React.memo(RotateSliderComponent);
