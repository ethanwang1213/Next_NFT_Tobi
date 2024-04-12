export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  registeredFlowAccount: boolean;
};

export enum FILTER_TYPE {
  CHECKBOX,
  RADIO,
}

export interface FILTER {
  type: FILTER_TYPE;
  label: string;
  children?: Array<FILTER>;
}

export type ErrorMessage = {
  code: string;
  message: string;
};

export type ApiProfileData = {
  userId: string;
  username: string;
  email: string;
  icon: string;
  sns: string;
  aboutMe: string;
  socialLinks: string[];
  gender: string;
  birth: string;
  flow: {
    flowAddress: string;
    publicKey: string;
    txId: string;
  },
  createdAt: string;
}
