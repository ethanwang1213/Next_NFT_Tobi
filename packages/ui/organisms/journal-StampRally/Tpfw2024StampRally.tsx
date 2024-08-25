import { useAuth } from "contexts/journal-AuthProvider";
import { useStampRallyFetcher } from "fetchers/journal-useStampRallyFetcher";
import {
  FormStatus,
  MintStatusType,
  StampRallyEvents,
  Tpfw2024StampType,
} from "types/stampRallyTypes";
import { BasicStampRallyForm } from "../../molecules/journal-BasicStampRallyForm";
import { useStampRallyForm } from "contexts/journal-StampRallyFormProvider";
import { useCallback, useMemo } from "react";
import { BasicStampRallyTitle } from "../../atoms/journal-BasicStampRallyTitle";

type StampDataType = {
  key: Tpfw2024StampType;
  blankSrc: string;
  src: string;
  status: MintStatusType;
};

export const Tpfw2024StampRally: React.FC = () => {
  const { requestStampRallyReward } = useStampRallyFetcher();
  const { isSubmitting, isIncorrect } = useStampRallyForm();

  const keys: Tpfw2024StampType[] = ["TobirapolisFireworks2024"];
  const user = useAuth().user;
  const stampRally = user?.mintStatus?.TOBIRAPOLISFIREWORKS2024;
  const statuses: MintStatusType[] = useMemo(
    () => keys.map((key) => (!stampRally || !stampRally[key] ? "NOTHING" : stampRally[key])),
    [stampRally]
  );

  const checkStatus: () => FormStatus = useCallback(() => {
    if (isSubmitting.current) {
      return "Checking";
    } else if (isIncorrect.current) {
      return "Incorrect";
    } else if (statuses.includes("IN_PROGRESS")) {
      return "Minting";
    } else if (statuses.includes("DONE") || !statuses.includes("NOTHING")) {
      return "Success";
    } else {
      return "Nothing";
    }
  }, [statuses, isSubmitting.current, isIncorrect.current]);

  const stampRallyMode = process.env.NEXT_PUBLIC_STAMPRALLY_MODE as StampRallyEvents;
  const endDate = process.env.NEXT_PUBLIC_STAMPRALLY_END_DATE as string;
  // console.log(endDate, Date.now(), new Date(endDate).getTime());
  if (stampRallyMode !== "TOBIRAPOLISFIREWORKS2024" || Date.now() >= new Date(endDate).getTime()) {
    return null;
  }

  return (
    <div className="pb-2 sm:pb-0">
      <BasicStampRallyTitle />
      <div>
        <BasicStampRallyForm
          event="TOBIRAPOLISFIREWORKS2024"
          status={checkStatus()}
          onSubmit={requestStampRallyReward}
        />
      </div>
    </div>
  );
};
