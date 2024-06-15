import { useAuth } from "contexts/journal-AuthProvider";
import { useStampRallyForm } from "contexts/journal-StampRallyFormProvider";
import { httpsCallable } from "firebase/functions";
import {
  StampRallyResultType,
  StampRallyRewardFormType,
  Tmf2024StampType,
  Tpf2023StampType,
} from "types/stampRallyTypes";
import { functions } from "./firebase/journal-client";

type BodyType = {
  keyword: string;
};

/**
 * スタンプラリーの報酬を受け取るための外部通信を行うhook
 * @returns
 */
export const useStampRallyFetcher = () => {
  const { setMintStatus } = useAuth();
  const { isSubmitting } = useStampRallyForm();

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

    const callable = httpsCallable<
      BodyType,
      StampRallyResultType<Tmf2024StampType>
    >(functions, "journalStampRally-checkRewardTmf2024");
    callable({ keyword: data.keyword })
      .then((result) => {
        console.log(result);
        const d = result.data;
        setMintStatus(
          "TOBIRAPOLISMUSICFESTIVAL2024",
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

  return { isSubmitting, requestTpf2023Reward, requestTmf2024Reward };
};
