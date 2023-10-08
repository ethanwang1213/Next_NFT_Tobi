import {
  StampRallyResultType,
  StampRallyRewardFormType,
} from "types/journal-types";
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase/journal-client";
import { useAuth } from "contexts/journal-AuthProvider";

type BodyType = {
  keyword: string;
};

/**
 * スタンプラリーの受け取るための外部通信を行うhook
 * @returns
 */
export const useStampRally = () => {
  const { setMintStatus } = useAuth();

  const requestReward = (data: StampRallyRewardFormType) => {
    console.log(data);
    const callable = httpsCallable<BodyType, StampRallyResultType>(
      functions,
      "stampRallyBadge-checkReward"
    );
    callable({ keyword: data.keyword })
      .then((result) => {
        console.log(result);
        setMintStatus("tpf2023StampRally", "g0", "IN_PROGRESS");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { requestReward };
};
