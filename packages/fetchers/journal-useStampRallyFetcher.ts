import { useAuth } from "contexts/journal-AuthProvider";
import { useStampRallyForm } from "contexts/journal-StampRallyFormProvider";
import { httpsCallable } from "firebase/functions";
import {
  StampRallyResultType,
  StampRallyRewardFormType,
} from "types/journal-types";
import { functions } from "./firebase/journal-client";

type BodyType = {
  keyword: string;
};

/**
 * スタンプラリーの受け取るための外部通信を行うhook
 * @returns
 */
export const useStampRallyFetcher = () => {
  const { setMintStatus } = useAuth();
  const { isSubmitting } = useStampRallyForm();

  const requestReward = (data: StampRallyRewardFormType) => {
    console.log(data);
    isSubmitting.set(true);

    const callable = httpsCallable<BodyType, StampRallyResultType>(
      functions,
      "stampRallyBadge-checkReward",
    );
    callable({ keyword: data.keyword })
      .then((result) => {
        console.log(result);
        setMintStatus(
          "TOBIRAPOLISFESTIVAL2023",
          result.data.stamp,
          "IN_PROGRESS",
          result.data.isComplete,
        );
        isSubmitting.set(false);
      })
      .catch((error) => {
        console.log(error);
        isSubmitting.set(false);
      });
  };

  return { isSubmitting, requestReward };
};
