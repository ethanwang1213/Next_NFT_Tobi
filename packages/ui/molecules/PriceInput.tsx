import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

const PriceInput = ({
  className,
  placeholder,
  value,
  changeHandler,
  tooltip,
}: {
  className: string;
  placeholder: string;
  value?: string | number;
  changeHandler?: (value) => void;
  tooltip?: string;
}) => {
  return (
    <div
      className={clsx(
        "pl-5 pr-4 border-2 border-secondary/50 rounded-lg flex flex-row",
        className,
      )}
    >
      <input
        type="number"
        placeholder={placeholder}
        className="w-full h-12 text-sm placeholder:text-secondary/50 placeholder:font-normal outline-none flex-grow"
        value={value ? value : undefined}
        step="0.01"
        min="0"
        onChange={(e) => changeHandler(e.target.value)}
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

export default PriceInput;
