import Image from "next/image";
import React from "react";
import Button from "ui/atoms/Button";

type Props = {
  label: string;
  type: "button" | "submit" | "reset";
  imagePath: string;
  alt?: string;
  width?: number;
  height?: number;
  buttonClassName?: string;
  iconClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const ImageIconButton = ({
  label,
  type,
  imagePath,
  alt,
  width,
  height,
  buttonClassName,
  iconClassName,
  onClick,
}: Props) => {
  const fill = !(width && height);
  return (
    <Button
      label={label}
      className={buttonClassName}
      type={type}
      onClick={onClick}
    >
      <div className={iconClassName}>
        <Image
          src={imagePath}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
        />
      </div>
    </Button>
  );
};

export default ImageIconButton;
