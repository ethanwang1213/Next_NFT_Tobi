import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  className?: string;
  children?: ReactNode;
};

const GhostButton = ({ className, children, ...props }: Props) => {
  return (
    <button
      className={`btn btn-ghost over:bg-none hover:bg-opacity-0 border-0 ${
        className ?? ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GhostButton;
