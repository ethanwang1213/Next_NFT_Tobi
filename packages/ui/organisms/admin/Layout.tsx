import {
  AuthProvider,
  isApplyPage,
  isPageForNonBusinessAccount,
  useAuth,
} from "contexts/AdminAuthProvider";
import { NavbarProvider } from "contexts/AdminNavbarProvider";
import { CustomUnityProvider } from "contexts/CustomUnityContext";
import { auth } from "fetchers/firebase/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import Navbar from "ui/organisms/admin/Navbar";
import Sidebar from "ui/organisms/admin/Sidebar";
import ContentSuspendedComponent from "./ContentSuspendedComponent";
import SpSidebar from "./SpSidebar";

type Props = {
  children: ReactNode;
  content?: String;
};

const Layout = ({ children, content }: Props) => {
  return (
    <>
      <Head>
        <title>Tobiratory Admin</title>
      </Head>
      <AuthProvider>
        <CustomUnityProvider>
          <Contents content={content}>{children}</Contents>
        </CustomUnityProvider>
      </AuthProvider>
    </>
  );
};

const MainContents = ({ children }: Props) => {
  const spinner = (
    <div className={"h-[100dvh] flex justify-center"}>
      <span className={"loading loading-spinner text-info loading-md"} />
    </div>
  );

  const { user } = useAuth();
  const router = useRouter();
  if (
    !user ||
    (user.hasBusinessAccount && isApplyPage(router.pathname)) ||
    (!user.hasBusinessAccount && !isPageForNonBusinessAccount(router.pathname))
  ) {
    return spinner;
  }
  return <>{children}</>;
};

const Contents = ({ children, content }: Props) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pagesWithoutSidebar = [
    "/authentication",
    "/auth/password_reset",
    "/auth/password_update",
    "/auth/reauth_password",
    "/auth/reauth_sns",
    "/auth/confirmation_email_for_auth_page",
  ];

  if (
    !pagesWithoutSidebar.includes(router.pathname) &&
    auth.currentUser &&
    user?.hasFlowAccount
  ) {
    return (
      <NavbarProvider>
        <div className="flex flex-col h-screen">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <SpSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <Sidebar>
            {content === "reported" ? (
              <ContentSuspendedComponent />
            ) : (
              <MainContents>{children}</MainContents>
            )}
          </Sidebar>
        </div>
      </NavbarProvider>
    );
  }

  return (
    <div
      className={
        "flex flow-row sm:justify-center min-h-screen h-min min-w-[760px]"
      }
    >
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
