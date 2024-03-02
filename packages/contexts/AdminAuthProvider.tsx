import { auth } from "fetchers/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import Router, { useRouter } from "next/router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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
  confirmFlowAccountRegistration: () => void;
};

const AuthContext = createContext<ContextType>({} as ContextType);

const unauthenticatedPages = ["/auth/email_auth", "/authentication"];

/**
 * firebaseによるユーザー情報やログイン状態を管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
export const AuthProvider: React.FC<Props> = ({ children }) => {
  // ユーザー情報を格納するstate
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const MAX_NAME_LENGTH = 12;

  useEffect(() => {
    // ログイン状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // ログイン状態の場合
      if (firebaseUser) {
        // TODO: リリースする前に消そう
        console.log(`UID: ${firebaseUser.uid}`);
        console.log(`メールアドレス: ${firebaseUser.email}`);
        // TODO: check flow account by API
        if (true) {
          // not registered flow account yet
          createUser(firebaseUser.uid, false, firebaseUser.email);
          console.log("register flow account");
          if (Router.pathname !== "/auth/email_auth") {
            Router.push("/auth/sns_auth");
          }
        } else {
          createUser(firebaseUser.uid, true, firebaseUser.email);
          // If we use the router, we need to include it in the dependencies,
          // and useEffect gets called multiple times. So, let's avoid using the router.
          if (Router.pathname === "/authentication") {
            Router.push("/");
          }
        }
      } else {
        setUser(null);
        if (!unauthenticatedPages.includes(Router.pathname)) {
          Router.push("/authentication");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // ユーザー作成用関数
  const createUser = (
    uid: string,
    registeredFlowAccount: boolean,
    email?: string | null,
  ) => {
    const appUser: User = {
      id: uid,
      name: email?.split("@")[0].slice(0, MAX_NAME_LENGTH) ?? "", // nameには、メールアドレスの@より前でMAX_NAME_LENGTH文字までを格納する
      email: email ?? "",
      registeredFlowAccount: registeredFlowAccount,
    };
    setUser(appUser);
  };

  const signOut = async () => {
    try {
      if (user?.email) {
        await auth.signOut();
      }
      router.push("/authentication");
    } catch (error) {
      console.error("サインアウトに失敗しました。", error);
    }
  };

  const confirmFlowAccountRegistration = () => {
    if (!user) {
      router.push("/authentication");
    }

    if (user.registeredFlowAccount) {
      return;
    }

    setUser((prev) => ({ ...prev, registeredFlowAccount: true }));
  };

  if (user || unauthenticatedPages.includes(router.pathname)) {
    return (
      <AuthContext.Provider
        value={{
          user,
          signOut,
          confirmFlowAccountRegistration,
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

export const useAuth = () => useContext(AuthContext);
