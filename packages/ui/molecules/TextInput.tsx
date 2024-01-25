import clsx from "clsx";
import Image from "next/image";

const TextInput = ({
  className,
  value,
  changeHandler,
  placeholder,
  tooltip,
}: {
  className: string;
  value?: string;
  changeHandler?: (value) => void;
  placeholder?: string;
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
        type="text"
        placeholder={placeholder}
        className="w-full h-12 text-sm placeholder:text-[#717171]/50 placeholder:font-normal outline-none flex-grow"
        defaultValue={value ? value : undefined}
        onChange={(e) => {
          changeHandler ? changeHandler(e.target.value) : undefined;
        }}
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

export default TextInput;
