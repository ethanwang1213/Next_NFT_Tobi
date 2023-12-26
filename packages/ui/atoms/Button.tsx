import React, { ReactNode } from "react";

type Props = {
  label: string;
  type: "button" | "submit" | "reset";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
};

const Button = ({ label, type, className, onClick, children }: Props) => {
  return (
    <button className={`btn ${className ?? ""}`} type={type} onClick={onClick}>
      {children}
      {label}
    </button>
  );
};

export default Button;
