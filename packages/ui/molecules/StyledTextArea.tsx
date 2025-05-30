import clsx from "clsx";
import { MutableRefObject, useEffect, useState } from "react";

const StyledTextArea = ({
  className,
  value,
  label,
  placeholder,
  changeHandler,
  maxLen,
  inputRef,
  readOnly,
}: {
  className: string;
  value: string;
  label: string;
  changeHandler: (e) => void;
  placeholder: string;
  maxLen?: number;
  inputRef?: MutableRefObject<HTMLTextAreaElement>;
  readOnly?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [uniqueId, setUniqueId] = useState("");

  const handleFocus = () => {
    if (!readOnly) setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (maxLen) {
      value = value.substring(0, maxLen);
    }

    setInputValue(value);
    changeHandler(value);
  };

  useEffect(() => {
    setUniqueId(Math.random().toString(36).substring(2, 11));
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={clsx(className, "relative")}>
      <textarea
        className={clsx(
          "w-full h-[180px] pl-5 pt-5 pr-3 resize-none",
          "outline-none border-2 rounded-lg border-secondary",
          !readOnly
            ? "hover:border-hover-color focus:border-focus-color"
            : "bg-secondary-200",
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
        readOnly={readOnly}
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

export default StyledTextArea;
