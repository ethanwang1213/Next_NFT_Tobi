import { useEffect } from "react";

type Props = {
  loadData: any; // TODO(toruto): define type
  postMessageToLoadData: (loadData: any) => void;
};

export const useUnityLoad = ({ loadData, postMessageToLoadData }: Props) => {
  useEffect(() => {
    // TODO(toruto): implement to load data
  }, [loadData]);

  return;
};
