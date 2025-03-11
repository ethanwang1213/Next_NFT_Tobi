import { doc, setDoc } from "firebase/firestore/lite";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { useStampRallyForm } from "journal-pkg/contexts/journal-StampRallyFormProvider";
import {
  StampRallyResultType,
  StampRallyRewardFormType,
  Tmf2024StampType,
  Tpf2023StampType,
  Tpf2025StampType,
  Tpfw2024StampType,
} from "journal-pkg/types/stampRallyTypes";
import { db, functions } from "./firebase/journal-client";

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
          d.isComplete,
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
          d.isComplete,
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

  const requestTpfw2024Reward = (data: StampRallyRewardFormType) => {
    console.log(data);
    isSubmitting.set(true);
    isIncorrect.set(false);

    const callable = httpsCallable<
      BodyType,
      StampRallyResultType<Tpfw2024StampType>
    >(functions, "journalStampRally-checkRewardTpfw2024");
    callable({ keyword: data.keyword })
      .then((result) => {
        console.log(result);
        const d = result.data;
        setMintStatus(
          "TOBIRAPOLISFIREWORKS2024",
          d.stamp,
          "IN_PROGRESS",
          d.isComplete,
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

  const requestTpf2025Reward = (data: StampRallyRewardFormType) => {
    console.log(data);
    isSubmitting.set(true);
    isIncorrect.set(false);

    const callable = httpsCallable<
      BodyType,
      StampRallyResultType<Tpf2025StampType>
    >(functions, "journalStampRally-checkRewardTpf2025");
    callable({ keyword: data.keyword })
      .then((result) => {
        console.log(result);
        const d = result.data;
        setMintStatus(
          "TOBIRAPOLISFESTIVAL2025",
          d.stamp,
          "IN_PROGRESS",
          d.isComplete,
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

  const requestStampRallyReward = (data: StampRallyRewardFormType) => {
    switch (data.event) {
      case "TOBIRAPOLISFESTIVAL2023":
        requestTpf2023Reward(data);
        break;
      case "TOBIRAMUSICFESTIVAL2024":
        requestTmf2024Reward(data);
        break;
      case "TOBIRAPOLISFIREWORKS2024":
        console.log("tpfw2024");
        requestTpfw2024Reward(data);
        break;
      case "TOBIRAPOLISFESTIVAL2025":
        requestTpf2025Reward(data);
        break;
      default:
        break;
    }
  };

  const checkMintedTmf2024Stamp = () => {
    if (!user) return;
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

  const checkMintedTpfw2024Stamp = () => {
    if (!user) return;
    try {
      if (user.isStampTpfw2024Checked) return true;

      const usersSrcRef = doc(db, `users/${user.id}`);
      setDoc(usersSrcRef, { isStampTpfw2024Checked: true }, { merge: true });
      checkLocalStampMinted();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const checkMintedTpf2025Stamp = () => {
    try {
      if (user.isStampTpf2025Checked) return true;

      const usersSrcRef = doc(db, `users/${user.id}`);
      setDoc(usersSrcRef, { isStampTpf2025Checked: true }, { merge: true });
      checkLocalStampMinted();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return {
    isSubmitting,
    requestStampRallyReward,
    checkMintedTmf2024Stamp,
    checkMintedTpfw2024Stamp,
    checkMintedTpf2025Stamp,
  };
};
