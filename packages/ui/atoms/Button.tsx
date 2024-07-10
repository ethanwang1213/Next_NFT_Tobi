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
      className={`relative enabled:hover:shadow-xl enabled:hover:-top-[3px] transition-shadow 
        enabled:hover:after:absolute enabled:hover:after:h-[5px] enabled:hover:after:-bottom-[5px] 
        enabled:hover:after:left-0 enabled:hover:after:right-0 
        ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
