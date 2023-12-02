import { auth } from "fetchers/firebase/admin-client";
import { onAuthStateChanged } from "firebase/auth";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "types/admin-types";

type Props = {
  children: ReactNode;
};

// AuthContextのデータ型
type ContextType = {
  user?: User;
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
  const MAX_NAME_LENGTH = 12;
  // ユーザー作成用関数
  function createUser(uid: string, email?: string | null) {
    const appUser: User = {
      id: uid,
      name: email?.split("@")[0].slice(0, MAX_NAME_LENGTH) ?? "", // nameには、メールアドレスの@より前でMAX_NAME_LENGTH文字までを格納する
      email: email ?? "",
    };
    setUser(appUser);
  }

  useEffect(() => {
    // ログイン状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // ログイン状態の場合
      if (firebaseUser) {
        console.log(`UID: ${firebaseUser.uid}`);
        console.log(`メールアドレス: ${firebaseUser.email}`);
        createUser(firebaseUser.uid, firebaseUser.email);
      }
      return unsubscribe;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
