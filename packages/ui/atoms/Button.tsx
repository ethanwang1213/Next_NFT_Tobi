import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  className?: string;
  children?: ReactNode;
};

const Button = ({ className, children, ...props }: Props) => {
  return (
    <button
      className={`relative enabled:hover:shadow-xl enabled:hover:-top-[3px] transition-shadow ${
        className ?? ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
