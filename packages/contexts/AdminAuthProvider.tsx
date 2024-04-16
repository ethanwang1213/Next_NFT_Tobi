import { fetchMyProfile } from "fetchers/adminUserAccount";
import { checkBusinessAccount } from "fetchers/businessAccount";
import { auth } from "fetchers/firebase/client";
import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
} from "firebase/auth";
import Router, { useRouter } from "next/router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "types/adminTypes";
import Loading from "ui/atoms/Loading";

type Props = {
  children: ReactNode;
};

// AuthContextのデータ型
type ContextType = {
  user?: User;
  signOut: () => Promise<void>;
  finishFlowAccountRegistration: () => void;
};

const AuthContext = createContext<ContextType>({} as ContextType);

/**
 * firebaseによるユーザー情報やログイン状態を管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
export const AuthProvider: React.FC<Props> = ({ children }) => {
  // ユーザー情報を格納するstate
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const unrestrictedPaths = useMemo(
    () => ["/authentication", "/auth/password_reset"],
    [],
  );
  const maxNameLength = 12;

  useEffect(() => {
    // ログイン状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // ログイン状態の場合
      if (firebaseUser) {
        // If we use the router, we need to include it in the dependencies,
        // and useEffect gets called multiple times. So, let's avoid using the router.
        const profile = await fetchMyProfile().catch((error) => {
          console.error(error);
          auth.signOut();
        });
        if (!profile) {
          Router.push("/authentication");
          return;
        }

        const hasFlowAccount = !!profile?.data?.flow?.flowAddress;
        if (hasFlowAccount) {
          const hasBusinessAccount = await checkBusinessAccount().catch(
            (error) => {
              console.error(error);
              auth.signOut();
            },
          );
          await createUser(
            profile.data.userId,
            profile.data.email,
            profile.data.username,
            firebaseUser.emailVerified,
            true,
            hasBusinessAccount,
          );
          const inaccessiblePaths = [
            "/authentication",
            "/auth/email_auth",
            "/auth/sns_auth",
          ];
          if (inaccessiblePaths.includes(Router.pathname)) {
            Router.push("/");
          } else if (hasBusinessAccount && isApplyPage(Router.pathname)) {
            Router.push("/");
          } else if (
            !hasBusinessAccount &&
            !isPageForNonBusinessAccount(Router.pathname)
          ) {
            Router.push("/apply");
          }
          return;
        }

        const signInMethods = await fetchSignInMethodsForEmail(
          auth,
          firebaseUser.email,
        );

        if (Router.pathname === "/authentication") {
          // new user sign up
          if (!firebaseUser.emailVerified) {
            return;
          }
        } else if (Router.pathname === "/auth/password_reset") {
          return;
        } else if (Router.pathname === "/auth/email_auth") {
          if (
            !signInMethods.includes(
              EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
            ) ||
            !firebaseUser.emailVerified
          ) {
            Router.push("/authentication");
            return;
          }
          await createUser(
            firebaseUser.uid,
            firebaseUser.email,
            "",
            firebaseUser.emailVerified,
            false,
            false,
          );
          return;
        } else if (Router.pathname === "/auth/sns_auth") {
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
          firebaseUser.uid,
          firebaseUser.email,
          "",
          firebaseUser.emailVerified,
          false,
          false,
        );
        Router.push("/auth/sns_auth");
      } else {
        setUser(null);
        if (!unrestrictedPaths.includes(Router.pathname)) {
          Router.push("/authentication");
        }
      }
    });
    return () => unsubscribe();
  }, [unrestrictedPaths]);

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
    emailVerified: boolean,
    hasFlowAccount: boolean,
    hasBusinessAccount: boolean,
  ) => {
    try {
      const appUser: User = {
        uuid,
        name: name || email.split("@")[0],
        email,
        emailVerified,
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

  const signOut = async () => {
    try {
      if (user) {
        await auth.signOut();
      }
      router.push("/authentication");
    } catch (error) {
      console.error("サインアウトに失敗しました。", error);
    }
  };

  const finishFlowAccountRegistration = () => {
    if (!user) {
      router.push("/authentication");
      return;
    }

    if (user.hasFlowAccount) {
      return;
    }

    setUser((prev) => ({ ...prev, hasFlowAccount: true }));
  };

  if (user || unrestrictedPaths.includes(router.pathname)) {
    return (
      <AuthContext.Provider
        value={{
          user,
          signOut,
          finishFlowAccountRegistration: finishFlowAccountRegistration,
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
  return path === "/apply" || path.startsWith("/apply/");
};

export const isPageForNonBusinessAccount = (path: string) => {
  return (
    isApplyPage(path) ||
    path === "/" ||
    path.startsWith("/auth/") ||
    path === "/account" ||
    path.startsWith("/account/")
  );
};

export const useAuth = () => useContext(AuthContext);
