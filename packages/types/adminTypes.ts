export type User = {
  id: string;
  name: string;
  email: string;
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
