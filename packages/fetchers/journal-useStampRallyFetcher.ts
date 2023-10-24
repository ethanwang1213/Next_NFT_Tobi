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

  const requestReward = (data: StampRallyRewardFormType) => {
    console.log(data);
    isSubmitting.set(true);

    const callable = httpsCallable<BodyType, StampRallyResultType>(
      functions,
      "stampRallyBadge-checkReward"
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

        // debug
        if (process.env.NEXT_PUBLIC_STAMPRALLY_DEBUG === "true") {
          setTimeout(async () => {
            const userSrcRef = doc(db, `users/${auth.user.id}`);
            const newData = {
              mintStatus: {
                ...auth.user?.mintStatus,
                TOBIRAPOLISFESTIVAL2023: {
                  ...auth.user?.mintStatus?.TOBIRAPOLISFESTIVAL2023,
                  [result.data.stamp]: "DONE",
                },
              },
            };
            await setDoc(userSrcRef, newData, { merge: true });
            setMintStatus(
              "TOBIRAPOLISFESTIVAL2023",
              result.data.stamp,
              "DONE",
              result.data.isComplete
            );
          }, 10000);
        }
      })
      .catch((error) => {
        console.log(error);
        isSubmitting.set(false);
      });
  };

  return { isSubmitting, requestReward };
};
