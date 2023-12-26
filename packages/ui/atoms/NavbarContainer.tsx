import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

const NavbarContainer = ({ className, children }: Props) => {
  return <div className={`navbar ${className ?? ""}`}>{children}</div>;
};

export default NavbarContainer;
