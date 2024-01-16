import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

const NavbarEnd = ({ className, children }: Props) => {
  return <div className={`navbar-end ${className ?? ""}`}>{children}</div>;
};

export default NavbarEnd;
