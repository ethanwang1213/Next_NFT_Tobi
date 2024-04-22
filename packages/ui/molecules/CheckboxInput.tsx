import clsx from "clsx";
import Image from "next/image";

const CheckboxInput = ({
  className,
  label,
  tooltip,
}: {
  className: string;
  label: string;
  tooltip?: string;
}) => {
  return (
    <div className={clsx("flex flex-row items-center", className)}>
      <input type="checkbox" className="w-6 h-6 mr-3" />
      <span className="text-sm text-secondary font-normal">{label}</span>
      {tooltip ? (
        <Image
          src="/admin/images/info-icon-2.svg"
          width={16}
          height={16}
          alt={tooltip}
          className="ml-2"
        ></Image>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CheckboxInput;
