import { StampRallyRewardFormType } from "types/journal-types";
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase/journal-client";
import { useAuth } from "contexts/journal-AuthProvider";

/**
 * スタンプラリーの受け取るための外部通信を行うhook
 * @returns 
 */
export const useStampRally = () => {
  const { setStampRallyMintStatus } = useAuth();

  const requestReward = (data: StampRallyRewardFormType) => {
    console.log(data);
    const callable = httpsCallable(functions, "stampRallyBadge-checkReward");
    callable({ keyword: data.keyword })
      .then((result) => {
        console.log(result);
        setStampRallyMintStatus("IN_PROGRESS");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return { requestReward }
}