import Image from "next/image";
import Button from "ui/atoms/Button";

export default function CreateButton({
  label,
  height,
  clickHandler,
}: {
  label: string;
  height: number;
  clickHandler?: () => void;
}) {
  return (
    label.length > 0 && (
      <Button
        style={{ height: height }}
        onClick={clickHandler ?? null}
        className={`h-14 rounded-[30px] bg-primary
          px-6 flex items-center gap-4 text-white
          transition-colors hover:bg-blue-500 
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
      >
        <Image
          src="/admin/images/icon/plus-icon.svg"
          alt="plus"
          width={26}
          height={26}
        />
        <span className="text-xl font-semibold uppercase text-center">
          {label}
        </span>
      </Button>
    )
  );
}
