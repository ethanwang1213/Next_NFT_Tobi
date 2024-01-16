import { AuthProvider } from "contexts/AdminAuthProvider";
import Head from "next/head";
import { ReactNode } from "react";
import FontLoader from "ui/atoms/FontLoader";
import Navbar from "ui/organisms/admin/Navbar";

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
        <Navbar />
        {children}
      </AuthProvider>
    </>
  );
};

export default Layout;
