import { useState } from "react";
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
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    if (isDisabled) return;

    setIsDisabled(true);
    clickHandler?.();

    setTimeout(() => setIsDisabled(false), 3000);
  };

  return (
    label.length > 0 && (
      <Button
        style={{ height }}
        onClick={handleClick}
        disabled={isDisabled}
        className={`rounded-[30px] bg-primary pl-3 pr-4 flex items-center text-white gap-1
          transition-colors hover:bg-blue-500 
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
          add
        </span>
        <span className="text-xl leading-8 font-semibold uppercase text-center">
          {label}
        </span>
      </Button>
    )
  );
}
