import { auth } from "fetchers/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "types/adminTypes";

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
      await router.push("/signin");
    } catch (error) {
      console.error("サインアウトに失敗しました。", error);
    }
  };

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
};

export const useAuth = () => useContext(AuthContext);
