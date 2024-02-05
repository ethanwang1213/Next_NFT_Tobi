import clsx from "clsx";
import Image from "next/image";
import React, { MutableRefObject, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export enum TextKind {
  Text = 0,
  Digit,
}

const StyledTextInput = ({
  className,
  value,
  label,
  placeholder,
  changeHandler,
  inputMask,
  tooltip,
  inputRef,
}: {
  className: string;
  value: string;
  label: string;
  changeHandler?: (e) => void;
  placeholder?: string;
  inputMask?: TextKind;
  tooltip?: string;
  inputRef?: MutableRefObject<HTMLInputElement>;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [uniqueId, setUniqueId] = useState("");

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!inputMask) setInputValue(e.target.value);

    if (inputMask === TextKind.Digit)
      setInputValue(e.target.value.replace(/\D/g, ""));

    changeHandler(e.target.value);
  };

  useEffect(() => {
    setUniqueId(Math.random().toString(36).substring(2, 11));
  }, []);

  return (
    <div className={clsx(className, "relative")}>
      <input
        type="text"
        className={clsx(
          "w-full h-12 pl-5 pt-4",
          tooltip && tooltip.length ? "pr-8" : "pr-3",
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
        ref={inputRef ? inputRef : null}
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
      {tooltip && tooltip.length ? (
        <>
          <Image
            src="/admin/images/info-icon-2.svg"
            width={16}
            height={16}
            alt=""
            className="absolute right-2 top-3.5"
            id={`image_${uniqueId}`}
            data-tooltip-id={`tooltip_${uniqueId}`}
            data-tooltip-content={tooltip}
          />
          <Tooltip
            id={`tooltip_${uniqueId}`}
            data-tooltip-id={`image_${uniqueId}`}
            place="left"
            noArrow={true}
            border="1px solid #717171"
            style={{
              backgroundColor: "#FFFFFF80",
              color: "#1779DE",
              fontSize: "12px",
              lineHeight: "18px",
              paddingLeft: "8px",
              paddingRight: "6px",
              paddingTop: "4px",
              paddingBottom: "4px",
              borderRadius: "8px",
            }}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default StyledTextInput;
