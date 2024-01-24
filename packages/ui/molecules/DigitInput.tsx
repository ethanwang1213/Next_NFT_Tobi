"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

const DigitInput = ({
  className,
  placeholder,
  tooltip,
}: {
  className: string;
  placeholder: string;
  tooltip?: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setInputValue(value);
  };

  return (
    <div
      className={clsx(
        "pl-5 pr-4 border-2 border-[#717171]/50 rounded-lg flex flex-row",
        className
      )}
    >
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-12 text-sm placeholder:text-[#717171]/50 placeholder:font-normal outline-none flex-grow"
        value={inputValue}
        onChange={handleInputChange}
      />
      {tooltip && tooltip.length ? (
        <Image
          src="/admin/images/info-icon-2.svg"
          width={16}
          height={16}
          alt={tooltip}
          className="ml-2"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default DigitInput;
