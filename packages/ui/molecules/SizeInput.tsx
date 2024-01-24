import clsx from "clsx";

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
  return (
    <div
      className={clsx(
        "border-2 border-[#717171]/50 rounded-lg flex",
        className
      )}
    >
      <span className="mt-3.5 ml-0.5 text-sm text-[#717171]/50 font-normal">
        H
      </span>
      <input
        type="number"
        className="h-12 text-sm outline-none flex-auto w-32 mr-0.5 text-right placeholder:text-[#717171]/50 placeholder:font-normal"
        placeholder="mm"
      />
      <div className="w-0.5 bg-[#717171]/50"></div>
      <span className="mt-3.5 ml-0.5 text-sm text-[#717171]/50 font-normal">
        W
      </span>
      <input
        type="number"
        className="h-12 text-sm outline-none flex-auto w-32 mr-0.5 text-right placeholder:text-[#717171]/50 placeholder:font-normal"
        placeholder="mm"
      />
      <div className="w-0.5 bg-[#717171]/50"></div>
      <span className="mt-3.5 ml-0.5 text-sm text-[#717171]/50 font-normal">
        D
      </span>
      <input
        type="number"
        className="h-12 text-sm outline-none flex-auto w-32 mr-0.5 text-right placeholder:text-[#717171]/50 placeholder:font-normal"
        placeholder="mm"
      />
    </div>
  );
};

export default SizeInput;
