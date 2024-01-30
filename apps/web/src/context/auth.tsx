import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "fetchers/firebase/client";
import { User, UserContextType } from "@/types/user";

const AuthContext = createContext<UserContextType>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ユーザー情報を格納するstate
  const [user, setUser] = useState<UserContextType>();

  // ユーザー作成用関数
  function createUser(uid: string) {
    const ref = doc(db, `users/${uid}`);
    const appUser: User = {
      id: uid,
      createdAt: Date.now(),
      policyAccepted: false,
      isSkipTutorial: false,
      failedAcstRequestAt: 0,
    };
    setDoc(ref, appUser).then(() => {
      setUser(appUser);
    });
  }

  useEffect(() => {
    // ログイン状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // ログイン状態の場合
      if (firebaseUser) {
        console.log(`UID: ${firebaseUser.uid}`);
        console.log(`メールアドレス: ${firebaseUser.email}`);

        // ユーザーコレクションからユーザーデータを参照
        const ref = doc(db, `users/${firebaseUser.uid}`);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          // ユーザーデータを取得してstateに格納
          const appUser = (await getDoc(ref)).data() as User;
          // console.log(`データ取得: ${appUser?.id}`);
          setUser(appUser);
        } else {
          // ユーザーが未作成の場合、新規作成して格納
          // console.log(`データ作成: ${firebaseUser.uid}`);
          createUser(firebaseUser.uid);
        }
      } else {
        // ログインしていない場合、匿名ログイン
        signInAnonymously(auth).then(async (e) => {
          // console.log(`匿名ログイン: ${e.user.uid}`);
          if (e.user) {
            createUser(e.user.uid);
          }
        });
      }

      return unsubscribe;
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
