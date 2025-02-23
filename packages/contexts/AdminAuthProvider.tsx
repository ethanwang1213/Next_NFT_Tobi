import { fetchMyProfile } from "fetchers/adminUserAccount";
import { checkBusinessAccount } from "fetchers/businessAccount";
import { auth } from "fetchers/firebase/client";
import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
} from "firebase/auth";
import useRestfulAPI from "hooks/useRestfulAPI";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { HasBusinessAccount, ProviderId, User } from "types/adminTypes";
import { LocalePlaceholder } from "types/localeTypes";
import Loading from "ui/atoms/Loading";

type Props = {
  children: ReactNode;
};

type ReauthStatus = {
  [ProviderId.GOOGLE]: boolean;
  [ProviderId.APPLE]: boolean;
};

// AuthContextのデータ型
type ContextType = {
  user: User | null;
  reauthStatus: ReauthStatus;
  signOut: () => Promise<void>;
  finishFlowAccountRegistration: () => void;
  finishBusinessAccountRegistration: () => void;
  setReauthStatus: React.Dispatch<React.SetStateAction<ReauthStatus>>;
  updateUserEmail: (email: string) => void;
  setUser: (user: User) => void;
};

const AuthContext = createContext<ContextType>({} as ContextType);

export const PASSWORD_RESET_PATH = `/admin/${LocalePlaceholder}/auth/password_reset`;
export const VERIFIED_EMAIL_PATH = `/admin/${LocalePlaceholder}/auth/verified_email`;

/**
 * firebaseによるユーザー情報やログイン状態を管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
export const AuthProvider: React.FC<Props> = ({ children }) => {
  // ユーザー情報を格納するstate
  const [user, setUser] = useState<User | null>(null);
  const [
    shouldRedirectToVerifiedEmailPath,
    setShouldRedirectToVerifiedEmailPath,
  ] = useState<boolean>(false);
  const [reauthStatus, setReauthStatus] = useState<ReauthStatus>({
    [ProviderId.GOOGLE]: false,
    [ProviderId.APPLE]: false,
  });

  const router = useRouter();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);

  const unrestrictedPaths = useMemo(
    () => [
      "/authentication",
      "/auth/auth_action",
      "/auth/confirmation_email_for_auth_page",
    ],
    [],
  );
  const profileApiUrl = "native/my/profile";
  const { postData: saveEmail, error } = useRestfulAPI(null);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!currentPath) {
      return;
    }

    // Enable navigation to VERIFIED_EMAIL_PATH after logging in.
    if (VERIFIED_EMAIL_PATH.endsWith(currentPath) && !user) {
      setShouldRedirectToVerifiedEmailPath(true);
    } else if (
      !VERIFIED_EMAIL_PATH.endsWith(currentPath) &&
      user &&
      shouldRedirectToVerifiedEmailPath
    ) {
      setShouldRedirectToVerifiedEmailPath(false);
      router.push(VERIFIED_EMAIL_PATH.replace("/admin", ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    // ログイン状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // ログイン状態の場合|
      if (firebaseUser && firebaseUser.email) {
        const profile = await fetchMyProfile().catch((error) => {
          console.error(error);
          auth.signOut();
        });
        if (!profile || !profile.data) {
          router.push("/authentication");
          return;
        }

        if (!firebaseUser.emailVerified) {
          if (unrestrictedPaths.includes(currentPath)) {
            return;
          } else {
            await auth.signOut();
            router.push("/authentication");
            return;
          }
        }

        const hasFlowAccount = !!profile?.data?.flow?.flowAddress;
        if (hasFlowAccount) {
          const hasBusinessAccount = await checkBusinessAccount(
            "businessAccount",
          ).catch((error) => {
            console.error(error);
            auth.signOut();
          });

          if (
            firebaseUser.emailVerified &&
            firebaseUser.email !== profile.data.email
          ) {
            await saveEmail(profileApiUrl, {
              account: {
                userId: profile.data.userId,
                email: firebaseUser.email,
              },
            });
          }

          await createUser(
            profile.data.userId,
            firebaseUser.email,
            profile.data.username,
            profile.data.icon || "",
            firebaseUser.emailVerified,
            true,
            true,
            hasBusinessAccount,
          );
          const inaccessiblePaths = [
            "/authentication",
            "/auth/email_auth",
            "/auth/sns_auth",
          ];
          if (inaccessiblePaths.includes(currentPath)) {
            router.push("/");
          } else if (
            hasBusinessAccount === "exist" &&
            isApplyPage(currentPath)
          ) {
            router.push("/");
          } else if (
            hasBusinessAccount !== "exist" &&
            !isPageForNonBusinessAccount(currentPath)
          ) {
            router.push("/apply");
          }
          return;
        }

        const signInMethods = await fetchSignInMethodsForEmail(
          auth,
          firebaseUser.email,
        );

        if (currentPath === "/authentication") {
          if (!firebaseUser.emailVerified) {
            return;
          }
        } else if (currentPath === "/auth/auth_action") {
          return;
        } else if (currentPath === "/auth/email_auth") {
          if (
            !signInMethods.includes(
              EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
            ) ||
            !firebaseUser.emailVerified
          ) {
            router.push("/authentication");
            return;
          }
          await createUser(
            "",
            firebaseUser.email,
            "",
            "",
            firebaseUser.emailVerified,
            !!profile?.data?.userId,
            false,
            "not-exist",
          );
          return;
        } else if (currentPath === "/auth/sns_auth") {
          if (emailLinkOnly(signInMethods) || !firebaseUser.emailVerified) {
            await auth.signOut();
            return;
          }
        }

        if (emailLinkOnly(signInMethods)) {
          await auth.signOut();
          return;
        }

        // not registered flow account yet
        await createUser(
          "",
          firebaseUser.email,
          "",
          "",
          firebaseUser.emailVerified,
          !!profile?.data?.userId,
          false,
          "not-exist",
        );
        router.push("/auth/sns_auth");
      } else {
        setUser(null);
        if (!unrestrictedPaths.includes(currentPath)) {
          router.push("/authentication");
        }
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unrestrictedPaths, currentPath]);

  const emailLinkOnly = (signInMethods: string[]) => {
    return (
      signInMethods.length === 1 &&
      signInMethods[0] === EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
    );
  };

  const createUser = async (
    uuid: string,
    email: string,
    name: string,
    icon: string,
    emailVerified: boolean,
    hasTobiratoryAccount: boolean,
    hasFlowAccount: boolean,
    hasBusinessAccount: HasBusinessAccount,
  ) => {
    try {
      const appUser: User = {
        uuid,
        name: name || email.split("@")[0],
        email,
        icon,
        emailVerified,
        hasTobiratoryAccount,
        hasFlowAccount,
        hasBusinessAccount,
      };
      setUser(appUser);
    } catch (error) {
      console.error("sign in methods error", error);
      setUser(null);
      await auth.signOut();
    }
  };

  const updateUserEmail = async (email: string) => {
    if (!user) {
      return;
    }
    setUser((prev) => ({ ...prev!, email }));
  };

  const signOut = async () => {
    try {
      if (user) {
        await auth.signOut();
      }

      localStorage.clear();
      sessionStorage.clear();

      router.replace("/authentication");

      if (typeof window !== "undefined") {
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
          router.replace("/authentication");
        };
      }
    } catch (error) {
      console.error("ログアウトに失敗しました。", error);
    }
  };

  const finishFlowAccountRegistration = async () => {
    if (!user) {
      router.push("/authentication");
      return;
    }

    if (user.hasFlowAccount) {
      return;
    }

    const profile = await fetchMyProfile().catch((error) => {
      console.error(error);
      auth.signOut();
    });
    if (!profile) {
      router.push("/authentication");
      return;
    }
    setUser((prev) => ({
      ...prev!,
      uuid: profile.data.userId,
      hasFlowAccount: true,
    }));
  };

  const finishBusinessAccountRegistration = () => {
    if (!user) {
      router.push("/authentication");
      return;
    }

    if (user.hasBusinessAccount === "exist") {
      return;
    }

    setUser((prev) => ({ ...prev!, hasBusinessAccount: "not-approved" }));
  };

  if (user || unrestrictedPaths.includes(pathname)) {
    return (
      <AuthContext.Provider
        value={{
          user: user || null,
          reauthStatus,
          signOut,
          finishFlowAccountRegistration: finishFlowAccountRegistration,
          finishBusinessAccountRegistration: finishBusinessAccountRegistration,
          setReauthStatus,
          updateUserEmail,
          setUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  } else {
    return (
      <div className={"h-[100dvh] flex justify-center"}>
        <Loading className={"loading-spinner text-info loading-md"} />
      </div>
    );
  }
};

export const isApplyPage = (path: string) => {
  return (
    path === "/apply" ||
    (path.startsWith("/apply/") && path !== "/apply/contentApproval")
  );
};

export const isPageForNonBusinessAccount = (path: string) => {
  return (
    isApplyPage(path) ||
    path === "/" ||
    path.startsWith("/auth/") ||
    path === "/account" ||
    path.startsWith("/account/") ||
    path === "/apply/contentApproval" ||
    path === "/apply/contentRepoted"
  );
};

export const hasPassword = async (email: string) => {
  const signInMethods = await fetchSignInMethodsForEmail(auth, email);
  return signInMethods.includes(
    EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
  );
};

export const hasAccountWithProviderId = (providerId: ProviderId) => {
  return auth?.currentUser?.providerData.some(
    (profile) => profile.providerId === providerId,
  );
};

export const hasGoogleAccount = () => {
  return hasAccountWithProviderId(ProviderId.GOOGLE);
};

export const hasAppleAccount = () => {
  return hasAccountWithProviderId(ProviderId.APPLE);
};

export const hasPasswordAccount = () => {
  return hasAccountWithProviderId(ProviderId.PASSWORD);
};

export const getMailAddressByProviderId = (providerId: ProviderId) => {
  return auth?.currentUser?.providerData.find(
    (profile) => profile.providerId === providerId,
  )?.email;
};

export const getMailAddressOfPasswordAccount = () => {
  return getMailAddressByProviderId(ProviderId.PASSWORD);
};

export const getMailAddressOfGoogleAccount = () => {
  return getMailAddressByProviderId(ProviderId.GOOGLE);
};

export const getMailAddressOfAppleAccount = () => {
  return getMailAddressByProviderId(ProviderId.APPLE);
};

export const getProviderName = (providerId: ProviderId) => {
  switch (providerId) {
    case ProviderId.GOOGLE:
      return "Google";
    case ProviderId.APPLE:
      return "Apple";
    default:
      return "";
  }
};

export const useAuth = () => useContext(AuthContext);
