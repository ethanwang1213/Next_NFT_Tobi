import { useAuth } from "contexts/journal-AuthProvider";
import { useStampRallyForm } from "contexts/journal-StampRallyFormProvider";
import { httpsCallable } from "firebase/functions";
import {
  StampRallyResultType,
  StampRallyRewardFormType,
  Tmf2024StampType,
  Tpf2023StampType,
} from "types/stampRallyTypes";
import { db, functions } from "./firebase/journal-client";
import { doc, setDoc } from "firebase/firestore/lite";

type BodyType = {
  keyword: string;
};

/**
 * スタンプラリーの報酬を受け取るための外部通信を行うhook
 * @returns
 */
export const useStampRallyFetcher = () => {
  const {
    user,
    setMintStatus,
    checkStampMinted: checkLocalStampMinted,
  } = useAuth();
  const { isSubmitting, isIncorrect } = useStampRallyForm();

  const requestTpf2023Reward = (data: StampRallyRewardFormType) => {
    console.log(data);
    isSubmitting.set(true);

    const callable = httpsCallable<
      BodyType,
      StampRallyResultType<Tpf2023StampType>
    >(functions, "journalStampRally-checkRewardTpf2023");
    callable({ keyword: data.keyword })
      .then((result) => {
        console.log(result);
        const d = result.data;
        setMintStatus(
          "TOBIRAPOLISFESTIVAL2023",
          d.stamp,
          "IN_PROGRESS",
          d.isComplete
        );

        isSubmitting.set(false);
      })
      .catch((error) => {
        console.log(error);
        isSubmitting.set(false);
      });
  };

  const requestTmf2024Reward = (data: StampRallyRewardFormType) => {
    console.log(data);
    isSubmitting.set(true);
    isIncorrect.set(false);

    const callable = httpsCallable<
      BodyType,
      StampRallyResultType<Tmf2024StampType>
    >(functions, "journalStampRally-checkRewardTmf2024");
    callable({ keyword: data.keyword })
      .then((result) => {
        console.log(result);
        const d = result.data;
        setMintStatus(
          "TOBIRAMUSICFESTIVAL2024",
          d.stamp,
          "IN_PROGRESS",
          d.isComplete
        );

        isSubmitting.set(false);
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
        isSubmitting.set(false);
        isIncorrect.set(true);
        console.log("error");
      });
  };

  const checkMintedStamp = () => {
    try {
      if (user.isStampTmf2024Checked) return true;

      const usersSrcRef = doc(db, `users/${user.id}`);
      setDoc(usersSrcRef, { isStampTmf2024Checked: true }, { merge: true });
      checkLocalStampMinted();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return {
    isSubmitting,
    requestTpf2023Reward,
    requestTmf2024Reward,
    checkMintedStamp,
  };
};
