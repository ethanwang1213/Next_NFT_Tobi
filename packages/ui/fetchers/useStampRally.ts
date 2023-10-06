import { StampRallyRewardFormType } from "../types";

/**
 * スタンプラリーの受け取るための外部通信を行うhook
 * @returns 
 */
export const useStampRally = () => {
  const requestReward = (data: StampRallyRewardFormType) => {
    console.log(data);
  }

  return { requestReward }
}