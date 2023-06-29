import { signInAnonymously, onAuthStateChanged } from "@firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "@firebase/firestore";
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
  const [dbIconUrl, setDbIconUrl] = useState<string>("");
  const MAX_NAME_LENGTH = 12;

  // ユーザー作成用関数
  function createUser(uid: string, email?: string) {
    const ref = doc(db, `users/${uid}`);
    const appUser: User = {
      id: uid,
      name: email ? email.split("@")[0].slice(0, MAX_NAME_LENGTH) : "", // nameには、メールアドレスの@より前でMAX_NAME_LENGTH文字までを格納する
      email: email ? email : "",
      icon: "",
      createdAt: Date.now(),
      discord: "",
      birthday: {
        year: 0,
        month: 0,
        day: 0,
      },
    };
    setDoc(ref, appUser).then(async () => {
      const nftRef = collection(db, `users/${uid}/nft`);
      addDoc(nftRef, {}).then(() => {
        setUser(appUser);
      });
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
            setDbIconUrl(appUser.icon);
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
        if (process.env.NEXT_PUBLIC_DEBUG_MODE === "false") {
          signInAnonymously(auth).then(async (e) => {
            // console.log(`匿名ログイン: ${e.user.uid}`);
            if (e.user) {
              createUser(e.user.uid);
            }
          });
        }
      }

      return unsubscribe;
    });
  }, []);

  const updateProfile = (
    newIcon: string,
    newName: string,
    newBirthday: Birthday,
    newDbIconUrl: string | null
  ) => {
    const newUser = {
      ...user,
      icon: newIcon,
      name: newName,
      birthday: newBirthday,
    };
    setUser(newUser);
    if (newDbIconUrl) {
      setDbIconUrl(newDbIconUrl);
    }
  };

  const setJoinTobiratoryInfo = (discordId: string, joinDate: Date) => {
    const newUser = { ...user };
    newUser.discord = discordId;
    if (!user.characteristic || !user.characteristic.join_tobiratory_at) {
      // 初めて参加日する場合に設定
      const joinAt = Timestamp.fromDate(joinDate);
      newUser.characteristic
        ? (newUser.characteristic.join_tobiratory_at = joinAt)
        : (newUser.characteristic = { join_tobiratory_at: joinAt });
    }
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbIconUrl,
        updateProfile,
        setDbIconUrl,
        setJoinTobiratoryInfo,
        MAX_NAME_LENGTH: MAX_NAME_LENGTH,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
