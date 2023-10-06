import { MetaMaskInpageProvider } from "@metamask/providers";
import { Dispatch, ReactElement } from "react";
import { Timestamp } from "firebase/firestore/lite";
import { StampRallyRewardFormType, StampRallyMintStatusType } from "types/journal-types";

export declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
