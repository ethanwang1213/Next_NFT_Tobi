import clsx from "clsx";
import { useState } from "react";

const SizeInput = ({
  className,
  height,
  width,
  deep,
}: {
  className: string;
  height?: number;
  width?: number;
  deep?: number;
}) => {
  const [inputWidth, setInputWidth] = useState(width);
  const [inputHeight, setInputHeight] = useState(height);
  const [inputDeep, setInputDeep] = useState(deep);

  const handleWidthChange = (e) => {
    setInputWidth(e.target.value.replace(/\D/g, ""));
  };

  const handleHeightChange = (e) => {
    setInputHeight(e.target.value.replace(/\D/g, ""));
  };

  const handleDeepChange = (e) => {
    setInputDeep(e.target.value.replace(/\D/g, ""));
  };

  return (
    <div
      className={clsx(
        "border-2 border-[#717171]/50 rounded-lg cursor-text flex",
        className,
        "hover:border-[#1779DE]/25 focus-within:border-[#1779DE]/50 hover:focus-within:border-[#1779DE]/50"
      )}
    >
      <span className="mt-3.5 mx-0.5 text-sm text-[#717171]/50 font-normal">
        H
      </span>
      <input
        type="text"
        className="h-12 w-4 flex-1 text-sm outline-none text-right"
        value={inputWidth}
        onChange={handleWidthChange}
      />
      <span className="mt-3.5 mx-0.5 text-sm text-[#717171]/50 font-normal">
        mm
      </span>
      <div className="w-0.5 bg-[#717171]/50"></div>
      <span className="mt-3.5 mx-0.5 text-sm text-[#717171]/50 font-normal">
        W
      </span>
      <input
        type="text"
        className="h-12 w-4 flex-1 text-sm outline-none text-right"
        value={inputHeight}
        onChange={handleHeightChange}
      />
      <span className="mt-3.5 mx-0.5 text-sm text-[#717171]/50 font-normal">
        mm
      </span>
      <div className="w-0.5 bg-[#717171]/50"></div>
      <span className="mt-3.5 mx-0.5 text-sm text-[#717171]/50 font-normal">
        D
      </span>
      <input
        type="text"
        className="h-12 w-4 flex-1 text-sm outline-none text-right"
        value={inputDeep}
        onChange={handleDeepChange}
      />
      <span className="mt-3.5 mx-0.5 text-sm text-[#717171]/50 font-normal">
        mm
      </span>
    </div>
  );
};

export default SizeInput;
