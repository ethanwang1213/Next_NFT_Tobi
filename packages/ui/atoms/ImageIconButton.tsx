import Image from "next/image";
import React from "react";
import Button from "ui/atoms/Button";

type Props = {
  label: string;
  type: "button" | "submit" | "reset";
  imagePath: string;
  alt?: string;
  buttonClassName?: string;
  iconClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const ImageIconButton = ({
  label,
  type,
  imagePath,
  alt,
  buttonClassName,
  iconClassName,
  onClick,
}: Props) => {
  return (
    <Button
      label={label}
      className={buttonClassName}
      type={type}
      onClick={onClick}
    >
      <div className={iconClassName}>
        <Image src={imagePath} alt={alt} fill />
      </div>
    </Button>
  );
};

export default ImageIconButton;
