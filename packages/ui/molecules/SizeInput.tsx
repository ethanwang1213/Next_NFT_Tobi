import clsx from "clsx";
import { useState } from "react";

const SizeInput = ({
  className,
  height,
  width,
  depth,
}: {
  className: string;
  height?: number;
  width?: number;
  depth?: number;
}) => {
  const [inputWidth, setInputWidth] = useState(width);
  const [inputHeight, setInputHeight] = useState(height);
  const [inputDepth, setInputDepth] = useState(depth);

  const handleWidthChange = (e) => {
    setInputWidth(e.target.value.replace(/\D/g, ""));
  };

  const handleHeightChange = (e) => {
    setInputHeight(e.target.value.replace(/\D/g, ""));
  };

  const handleDepthChange = (e) => {
    setInputDepth(e.target.value.replace(/\D/g, ""));
  };

  return (
    <div
      className={clsx(
        "border-2 border-normal-color rounded-lg cursor-text flex",
        className,
        "font-normal text-sm text-placeholder-color",
        "hover:border-hover-color focus-within:border-focus-color hover:focus-within:border-focus-color"
      )}
    >
      <span className="mt-3.5 mx-0.5">H</span>
      <input
        type="text"
        className="h-12 w-4 flex-1 outline-none text-right text-input-color"
        value={inputWidth}
        onChange={handleWidthChange}
      />
      <span className="mt-3.5 mx-0.5">mm</span>
      <div className="w-0.5 bg-[#717171]/50"></div>
      <span className="mt-3.5 mx-0.5">W</span>
      <input
        type="text"
        className="h-12 w-4 flex-1 outline-none text-right text-input-color"
        value={inputHeight}
        onChange={handleHeightChange}
      />
      <span className="mt-3.5 mx-0.5">mm</span>
      <div className="w-0.5 bg-[#717171]/50"></div>
      <span className="mt-3.5 mx-0.5">D</span>
      <input
        type="text"
        className="h-12 w-4 flex-1 outline-none text-right text-input-color"
        value={inputDepth}
        onChange={handleDepthChange}
      />
      <span className="mt-3.5 mx-0.5">mm</span>
    </div>
  );
};

export default SizeInput;
