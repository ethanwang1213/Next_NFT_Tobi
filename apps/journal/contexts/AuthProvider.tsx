import { signInAnonymously, onAuthStateChanged } from "@firebase/auth";
import { Timestamp, doc, getDoc, setDoc } from "@firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "@/firebase/client";
import { Birthday, User, UserContextType } from "@/types/type";

const AuthContext = createContext<UserContextType>(undefined);

/**
 * firebaseによるユーザー情報やログイン状態を管理するコンテキストプロバイダー
 * @param param0
 * @returns
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ユーザー情報を格納するstate
  const [user, setUser] = useState<User>();

  // ユーザー作成用関数
  function createUser(uid: string, email?: string) {
    const ref = doc(db, `users/${uid}`);
    const appUser: User = {
      id: uid,
      name: email ? email.split("@")[0] : "",
      email: email ? email : "",
      icon: "", // TODO: アイコンの初期値を設定する
      createdAt: Date.now(),
      discord: "",
      birthday: {
        year: 0,
        month: 0,
        day: 0,
      },
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

        try {
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
            createUser(firebaseUser.uid, firebaseUser.email);
          }
        } catch (error) {
          console.error(error);
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

  const updateProfile = (
    newIcon: string,
    newName: string,
    newBirthday: Birthday
  ) => {
    const newUser = {
      ...user,
      icon: newIcon,
      name: newName,
      birthday: newBirthday,
    };
    setUser(newUser);
  };

  const setJoinTobiratoryAt = (joinDate: Date) => {
    // 既に参加日が設定されている場合は何もしない
    if (!!user.characteristic && !!user.characteristic.join_tobiratory_at)
      return;
    const newUser = { ...user };
    const joinAt = Timestamp.fromDate(joinDate);

    newUser.characteristic
      ? (newUser.characteristic.join_tobiratory_at = joinAt)
      : (newUser.characteristic = { join_tobiratory_at: joinAt });
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, updateProfile, setJoinTobiratoryAt }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
