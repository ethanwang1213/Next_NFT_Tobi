import {
  StampRallyResultType,
  StampRallyRewardFormType,
} from "types/journal-types";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "./firebase/journal-client";
import { useAuth } from "contexts/journal-AuthProvider";
import { useStampRallyForm } from "contexts/journal-StampRallyFormProvider";
import { doc, setDoc } from "firebase/firestore/lite";

type BodyType = {
  keyword: string;
};

/**
 * スタンプラリーの受け取るための外部通信を行うhook
 * @returns
 */
export const useStampRallyFetcher = () => {
  const auth = useAuth();
  const { setMintStatus } = useAuth();
  const { isSubmitting } = useStampRallyForm();

  // debug stamprally
  const transitionToDoneForDebug = (data: StampRallyResultType) => {
    setTimeout(async () => {
      const userSrcRef = doc(db, `users/${auth.user?.id}`);
      const newData = {
        mintStatus: {
          ...auth.user?.mintStatus,
          TOBIRAPOLISFESTIVAL2023: {
            ...auth.user?.mintStatus?.TOBIRAPOLISFESTIVAL2023,
            [data.stamp]: "DONE",
          },
        },
      };
      await setDoc(userSrcRef, newData, { merge: true });
      setMintStatus(
        "TOBIRAPOLISFESTIVAL2023",
        data.stamp,
        "DONE",
        data.isComplete
      );
    }, 10000);
  };
  // end debug stamprally

  const requestReward = (
    data: StampRallyRewardFormType,
    // debug stamprally
    mintChecked0: boolean,
    mintChecked1: boolean,
    mintChecked2: boolean
    // end debug stamprally
  ) => {
    console.log(data);
    isSubmitting.set(true);

    const isDebug = process.env.NEXT_PUBLIC_STAMPRALLY_DEBUG !== "false";
    const allChecked = mintChecked0 && mintChecked1 && mintChecked2;
    const useDebug = isDebug && !allChecked;
    console.log(useDebug);
    const callable = httpsCallable<BodyType, StampRallyResultType>(
      functions,
      useDebug
        ? "stampRallyBadgeForDebug-checkReward" // debug stamprally
        : "stampRallyBadge-checkReward"
    );
    callable({ keyword: data.keyword })
      .then((result) => {
        console.log(result);
        setMintStatus(
          "TOBIRAPOLISFESTIVAL2023",
          result.data.stamp,
          "IN_PROGRESS",
          result.data.isComplete
        );
        isSubmitting.set(false);

        // debug stamprally
        if (useDebug) {
          transitionToDoneForDebug(result.data);
        }
        // end debug sramprally
      })
      .catch((error) => {
        console.log(error);
        isSubmitting.set(false);
      });
  };

  return { isSubmitting, requestReward };
};
