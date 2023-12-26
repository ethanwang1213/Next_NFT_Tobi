import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

const NavbarCenter = ({ className, children }: Props) => {
  return <div className={`navbar-center ${className ?? ""}`}>{children}</div>;
};

export default NavbarCenter;
