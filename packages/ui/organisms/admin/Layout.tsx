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
  if (auth.currentUser && user?.registeredFlowAccount) {
    return (
      <NavbarProvider>
        <div className="flex flex-col h-screen">
          <Navbar />
          <Sidebar>{children}</Sidebar>
        </div>
      </NavbarProvider>
    );
  }

  return (
    <div className={"flex flow-row sm:justify-center min-h-screen h-min"}>
      <div className={"grow flex flex-col self-stretch"}>
        {children}
        <div className={"flex grow justify-center"}>
          <div className="self-end font-normal text-[12px] text-base-content">
            Tobiratory Inc. all rights reserved.
          </div>
        </div>
      </div>
      <div className={"flex flex-row max-sm:hidden grow overflow-hidden"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={"/admin/images/admin-logo.svg"}
          alt={"Tobiratory Logo"}
          className={"object-cover"}
        />
      </div>
    </div>
  );
};

export default Layout;
