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
  const [inputValue, setInputValue] = useState("0");

  const inputValueChangeHandler = useCallback(
    (value: string) => {
      let numericValue = parseInt(value.replace(/[^0-9-]/g, ""), 10);
      if (value.charAt(0) === "-") {
        if (numericValue > 0 || isNaN(numericValue)) {
          numericValue = NaN;
        } else {
          numericValue = Math.max(-180, numericValue);
        }
      } else {
        if (!isNaN(numericValue)) {
          numericValue = Math.max(-180, Math.min(180, numericValue));
        }
      }
      if (!isNaN(numericValue)) {
        setRotate(180 - numericValue);
        setInputValue(`${numericValue}`);
      } else {
        setInputValue(value === "" ? "" : "-");
      }
    },
    [setRotate],
  );

  const sliderValueChangeHandler = useCallback(
    (value: number) => {
      setInputValue(`${value}`);
      setRotate(180 - value);
    },
    [setRotate],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      setInputValue((prev) => {
        const newValue = prev.slice(0, -1);
        inputValueChangeHandler(newValue);
        return newValue;
      });
    } else if (e.key === "ArrowUp") {
      const newValue = Math.min(180, parseInt(inputValue || "0", 10) + 1);
      setInputValue(newValue.toString());
      setRotate(180 - newValue);
    } else if (e.key === "ArrowDown") {
      const newValue = Math.max(-180, parseInt(inputValue || "0", 10) - 1);
      setInputValue(newValue.toString());
      setRotate(180 - newValue);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-[220px] relative">
        <Slider
          min={-180}
          max={180}
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
          value={Number(inputValue)}
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
        className="cursor-pointer mt-4"
        onClick={() => {
          setRotate(0);
          setInputValue("0");
        }}
      />
      <div className="flex h-4 justify-between mt-2 rounded-[3px] border border-primary bg-[#D9F1FD]">
        <input
          type="text"
          className="w-6 flex-col rounded-[3px] bg-[#D9F1FD] outline-none text-secondary text-[8px] text-center pl-1 pr-0"
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={(e) => inputValueChangeHandler(e.target.value)}
        />
        <div className="select-none h-1 text-xs">°</div>
      </div>
    </div>
  );
};

export default React.memo(RotateSliderComponent);
