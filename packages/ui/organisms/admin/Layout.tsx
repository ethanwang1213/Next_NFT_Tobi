import { AuthProvider, useAuth } from "contexts/AdminAuthProvider";
import { NavbarProvider } from "contexts/AdminNavbarProvider";
import { auth } from "fetchers/firebase/client";
import Head from "next/head";
import { ReactNode } from "react";
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
      <AuthProvider>
        <Contents>{children}</Contents>
      </AuthProvider>
    </>
  );
};

const Contents = ({ children }: Props) => {
  const { user } = useAuth();
  if (auth.currentUser && user.registeredFlowAccount) {
    return (
      <NavbarProvider>
        <div className="flex flex-col h-screen">
          <Navbar />
          <Sidebar>{children}</Sidebar>
        </div>
      </NavbarProvider>
    );
  }

  return <>{children}</>;
};

export default Layout;
