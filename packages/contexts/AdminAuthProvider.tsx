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
  const MAX_NAME_LENGTH = 12;

  useEffect(() => {
    // ログイン状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // ログイン状態の場合
      if (firebaseUser) {
        // TODO: リリースする前に消そう
        console.log(`UID: ${firebaseUser.uid}`);
        console.log(`メールアドレス: ${firebaseUser.email}`);
        createUser(firebaseUser.uid, firebaseUser.email);
        // If we use the router, we need to include it in the dependencies, and useEffect gets called multiple times. So, let's avoid using the router.
        if (Router.pathname === "/signin") {
          Router.push("/");
        }
      } else {
        setUser(null);
        Router.push("/signin");
      }
      return unsubscribe;
    });
  }, []);

  // ユーザー作成用関数
  const createUser = (uid: string, email?: string | null) => {
    const appUser: User = {
      id: uid,
      name: email?.split("@")[0].slice(0, MAX_NAME_LENGTH) ?? "", // nameには、メールアドレスの@より前でMAX_NAME_LENGTH文字までを格納する
      email: email ?? "",
    };
    setUser(appUser);
  };

  const signOut = async () => {
    try {
      if (user?.email) {
        await auth.signOut();
      }
      router.push("/signin");
    } catch (error) {
      console.error("サインアウトに失敗しました。", error);
    }
  };

  if (user || router.pathname === "/signin") {
    return (
      <AuthContext.Provider
        value={{
          user,
          signOut,
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
