export type User = {
  id: string;
  createdAt: number;
  policyAccepted: boolean;
  isSkipTutorial: boolean;
  failedAcstRequestAt: number;
};

export type Media = {
  url: string;
};

export type UserContextType = User | null | undefined;
