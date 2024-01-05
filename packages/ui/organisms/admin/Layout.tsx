import { AuthProvider } from "contexts/AdminAuthProvider";
import { ReactNode } from "react";
import FontLoader from "ui/atoms/FontLoader";
import Header from "ui/organisms/admin/Header";
import Navbar from "ui/organisms/admin/Navbar";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <FontLoader />
      <AuthProvider>
        <Navbar />
        {children}
      </AuthProvider>
    </>
  );
};

export default Layout;
