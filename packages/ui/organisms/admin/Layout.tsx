import AuthAction from "admin/src/pages/auth/auth_action";
import {
  AuthProvider,
  isApplyPage,
  isPageForNonBusinessAccount,
  useAuth,
} from "contexts/AdminAuthProvider";
import { NavbarProvider } from "contexts/AdminNavbarProvider";
import { CustomUnityProvider } from "contexts/CustomUnityContext";
import { LoadingProvider, useLoading } from "contexts/LoadingContext";
import { auth } from "fetchers/firebase/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import Navbar from "ui/organisms/admin/Navbar";
import Sidebar from "ui/organisms/admin/Sidebar";
import SpSidebar from "./SpSidebar";

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
        <CustomUnityProvider>
          <Contents>{children}</Contents>
        </CustomUnityProvider>
      </AuthProvider>
    </>
  );
};

function PageLoader({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setPageLoaded(false); // Reset when navigation starts
      setLoading(true);
    };

    const handleComplete = () => {
      setPageLoaded(true);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, setLoading]);
  useEffect(() => {
    if (pageLoaded) {
      setLoading(false);
    }
  }, [pageLoaded, setLoading]);

  return <>{children}</>;
}

const MainContents = ({ children }: Props) => {
  const { user } = useAuth();
  const router = useRouter();

  const spinner = (
    <div className="h-[100dvh] flex justify-center">
      <span className="loading loading-spinner text-info loading-md" />
    </div>
  );

  if (
    !user ||
    (user.hasBusinessAccount === "exist" && isApplyPage(router.pathname)) ||
    (user.hasBusinessAccount !== "exist" &&
      !isPageForNonBusinessAccount(router.pathname))
  ) {
    return spinner;
  }
  return <>{children}</>;
};

const Contents = ({ children }: Props) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pagesWithoutSidebar = [
    "/authentication",
    "/auth/email_update",
    "/auth/password_reset",
    "/auth/verified_email",
    "/auth/auth_action",
    "/auth/password_update",
    "/auth/reauth_password",
    "/auth/reauth_sns",
    "/auth/confirmation_email_for_auth_page",
  ];
  const isVerifiedActionPage = router.pathname === "/auth/auth_action";

  if (isVerifiedActionPage) {
    return (
      <div className="flex flow-row sm:justify-center min-h-screen min-w-[320px]">
        <div className="grow flex flex-col self-stretch">
          <AuthAction />
        </div>
      </div>
    );
  }

  if (
    !pagesWithoutSidebar.includes(router.pathname) &&
    auth.currentUser &&
    user?.hasFlowAccount
  ) {
    return (
      <LoadingProvider>
        <PageLoader>
          <NavbarProvider>
            <div className="flex flex-col h-screen">
              <Navbar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <SpSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <Sidebar>
                <MainContents>{children}</MainContents>
              </Sidebar>
            </div>
          </NavbarProvider>
        </PageLoader>
      </LoadingProvider>
    );
  }
  return (
    <div className="flex flow-row sm:justify-center min-h-screen min-w-[320px]">
      <div className="grow flex flex-col self-stretch">
        <div className="grow">{children}</div>
        <div className="flex justify-center">
          <div className="self-end font-normal text-xs text-base-content pb-6">
            Tobiratory Inc. all rights reserved.
          </div>
        </div>
      </div>
      <div className="flex flex-row max-sm:hidden grow overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/admin/images/admin-logo.svg"
          alt="Tobiratory Logo"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default Layout;
