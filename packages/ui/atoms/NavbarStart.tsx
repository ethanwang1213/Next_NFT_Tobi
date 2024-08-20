import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};
const NavbarStart = ({ className, children }: Props) => {
  return <div className={`sm:navbar-start ${className ?? ""}`}>{children}</div>;
};

export default NavbarStart;
