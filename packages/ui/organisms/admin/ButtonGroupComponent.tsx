import NextImage from "next/image";
import React from "react";
import Button from "ui/atoms/Button";

const ButtonGroupComponent = (props: {
  backButtonHandler: () => void;
  nextButtonHandler: () => void;
}) => {
  return (
    <div className="flex justify-between">
      <Button
        className="w-[72px] h-8 rounded-lg border border-primary flex items-center justify-center gap-1"
        onClick={props.backButtonHandler}
      >
        <NextImage
          width={20}
          height={20}
          src="/admin/images/icon/arrow-left-s-line.svg"
          alt="left arrow"
        />
        <span className="text-primary text-sm font-medium">Back</span>
      </Button>
      <Button
        className="w-[72px] h-8 rounded-lg bg-primary flex items-center justify-center gap-1"
        onClick={props.nextButtonHandler}
      >
        <span className="text-base-white text-sm font-medium">Next</span>
        <NextImage
          width={20}
          height={20}
          src="/admin/images/icon/arrow-right-s-line.svg"
          alt="left arrow"
        />
      </Button>
    </div>
  );
};

export default React.memo(ButtonGroupComponent);
