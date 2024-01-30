import { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Button from "ui/atoms/Button";

type Props = {
  label: string;
  type: "button" | "submit" | "reset";
  icon: IconProp;
  size: SizeProp;
  className: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const FontAwesomeIconButton = ({
  label,
  type,
  icon,
  size,
  className,
  onClick,
}: Props) => {
  return (
    <Button label={label} className={className} type={type} onClick={onClick}>
      <FontAwesomeIcon icon={icon} size={size} />
    </Button>
  );
};

export default FontAwesomeIconButton;
