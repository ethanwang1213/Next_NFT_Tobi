import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore/lite";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "fetchers/firebase/journal-client";
import {
  Birthday,
  MintStatusForSetMethod,
  MintStatusType,
  Tpf2023Complete,
  User,
} from "types/journal-types";
import _ from "lodash";

type Props = {
  children: ReactNode;
};

// AuthContextのデータ型
type ContextType = {
  user: User | null | undefined;
  dbIconUrl: string;
  MAX_NAME_LENGTH: number;
  updateProfile: (
    newIcon: string,
    newName: string,
    newBirthday: Birthday,
    newDbIconPath: string
  ) => void;
  setDbIconUrl: Dispatch<SetStateAction<string>>;
  setJoinTobiratoryInfo: (discordId: string, joinDate: Date) => void;
  // TOBIRAPOLIS祭スタンプラリー用
  setMintStatus: <T extends keyof MintStatusForSetMethod>(
    event: T,
    type: keyof MintStatusForSetMethod[T],
    status: MintStatusType,
    isComplete: boolean
  ) => void;
  refetchUserMintStatus: () => void;
  //
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
  const [dbIconUrl, setDbIconUrl] = useState<string>("");
  const MAX_NAME_LENGTH = 12;

  // ユーザー作成用関数
  function createUser(uid: string, email?: string | null) {
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
        if (process.env.NEXT_PUBLIC_DEBUG_MODE !== "true") {
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
    if (!user) return;
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

  // 初めてのdiscord認証時のみに書き込む仕様なので
  // 条件分岐は冗長かもとも思うが、予期しないデータの修正しても、
  // 最初の参加日を保証するという意味では、この実装でいいのかもしれない
  const setJoinTobiratoryInfo = (discordId: string, joinDate: Date) => {
    if (!user) return;
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

  // TOBIRAPOLIS祭スタンプラリー用。
  // スタンプラリーのmint状態を更新する
  const setMintStatus: ContextType["setMintStatus"] = (
    event,
    type,
    status,
    isComplete
  ) => {
    if (!user) return;
    setUser((state) => {
      if (!state) return null;

      // 現状のuserデータに存在するmint状態データを取得
      const currentDataOrEmpty =
        state.mintStatus && state.mintStatus[event]
          ? state.mintStatus[event]
          : {};

      // これでスタンプコンプリートだったらCompleteも"IN_PROGRESS"に設定
      const completeOrEmpty: { [cmp in Tpf2023Complete]: string } | {} =
        isComplete ? { Complete: "IN_PROGRESS" } : {};

      return {
        ...state,
        mintStatus: {
          [event]: {
            ...currentDataOrEmpty, // 現状のuserのmint状態データの展開
            [type]: status, // 新規mint状態データ
            ...completeOrEmpty, // completeを設定
          },
        },
      };
    });
  };

  // TOBIRAPOLIS祭スタンプラリー用。
  // mintStatusを監視するための関数
  const refetchUserMintStatus = async () => {
    if (!user) return;

    // ユーザーコレクションからユーザーデータを参照
    const ref = doc(db, `users/${user.id}`);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      // ユーザーデータを取得してstateに格納
      const appUser = (await getDoc(ref)).data() as User;
      // mintStatusに更新があった時のみuserデータ更新
      if (
        !_.isEqual(
          user.mintStatus?.TOBIRAPOLISFESTIVAL2023,
          appUser.mintStatus?.TOBIRAPOLISFESTIVAL2023
        )
      ) {
        console.log(
          "updated!!!!!!!!!!!!",
          user.mintStatus?.TOBIRAPOLISFESTIVAL2023,
          appUser.mintStatus?.TOBIRAPOLISFESTIVAL2023
        );
        setUser(appUser);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbIconUrl,
        MAX_NAME_LENGTH: MAX_NAME_LENGTH,
        updateProfile,
        setDbIconUrl,
        setJoinTobiratoryInfo,
        // TOBIRAPOLIS祭スタンプラリー用
        setMintStatus,
        refetchUserMintStatus,
        //
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
