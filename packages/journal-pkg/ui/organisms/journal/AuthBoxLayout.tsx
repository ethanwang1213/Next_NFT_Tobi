import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AuthBoxLayout = ({ children }: Props) => {
  return (
    <div className="bg-white p-7 sm:p-10 rounded-[66px] sm:rounded-[50px] flex flex-col items-center md:translate-x-[250px] max-w-[496px] z-10">
      {children}
    </div>
  );
};

export default AuthBoxLayout;
