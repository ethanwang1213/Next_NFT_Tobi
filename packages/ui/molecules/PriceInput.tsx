import clsx from "clsx";
import Image from "next/image";

const PriceInput = ({
  className,
  placeholder,
  tooltip,
}: {
  className: string;
  placeholder: string;
  tooltip?: string;
}) => {
  return (
    <div
      className={clsx(
        "pl-5 pr-4 border-2 border-[#717171]/50 rounded-lg flex flex-row",
        className
      )}
    >
      <input
        type="number"
        placeholder={placeholder}
        className="w-full h-12 text-sm placeholder:text-[#717171]/50 placeholder:font-normal outline-none flex-grow"
        step="0.01"
        min="0"
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
