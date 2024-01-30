import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import FontAwesomeIconButton from "ui/atoms/FontAwesomeIconButton";

type Props = {
  label: string;
  size: SizeProp;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const AppleIconButton = ({ label, size, className, onClick }: Props) => {
  return (
    <FontAwesomeIconButton
      label={label}
      type={"button"}
      icon={faApple}
      size={size}
      className={className}
      onClick={onClick}
    />
  );
};

export default AppleIconButton;
