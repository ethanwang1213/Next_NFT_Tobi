import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

const NavbarEnd = ({ className, children }: Props) => {
  return (
    <div className={`navbar-end  sm:inline-flex hidden${className ?? ""}`}>
      {children}
    </div>
  );
};

export default NavbarEnd;
