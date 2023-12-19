import { AuthProvider } from "contexts/AdminAuthProvider";
import { NavbarProvider } from "contexts/AdminNavbarProvider";
import Head from "next/head";
import { ReactNode } from "react";
import FontLoader from "ui/atoms/FontLoader";
import Navbar from "ui/organisms/admin/Navbar";
import Sidebar from "ui/organisms/admin/Sidebar";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <title>Tobiratory Admin</title>
      </Head>
      <FontLoader />
      <AuthProvider>
        <NavbarProvider>
          <Navbar />
          <Sidebar />
        </NavbarProvider>
        {children}
      </AuthProvider>
    </>
  );
};

export default Layout;
