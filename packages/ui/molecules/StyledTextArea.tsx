import React, { useRef, useEffect, useState } from "react";
import clsx from "clsx";

const StyledTextInput = ({
  className,
  value,
  label,
  placeholder,
  changeHandler,
}: {
  className: string;
  value: string;
  label: string;
  changeHandler: (e) => void;
  placeholder: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    changeHandler(inputValue);
  };

  const uniqueId = Math.random().toString(36).substring(2, 11);

  return (
    <div className={clsx(className, "relative")}>
      <textarea
        className={clsx(
          "w-full h-32 pl-5 pt-4 pr-3 resize-none",
          "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
          "text-sm font-normal text-input-color",
          "placeholder:text-placeholder-color placeholder:font-normal",
        )}
        id={`input_${uniqueId}`}
        value={inputValue}
        placeholder={isFocused ? placeholder : undefined}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <label
        className={`absolute cursor-text left-5 font-normal transition-all duration-300 z-[1] ${
          isFocused || inputValue
            ? "text-xs top-1 text-input-color"
            : "text-sm top-3 text-placeholder-color"
        }`}
        htmlFor={`input_${uniqueId}`}
      >
        {label}
      </label>
    </div>
  );
};

export default StyledTextInput;
