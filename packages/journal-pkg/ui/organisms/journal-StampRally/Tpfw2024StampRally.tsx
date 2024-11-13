import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { useStampRallyForm } from "journal-pkg/contexts/journal-StampRallyFormProvider";
import { useStampRallyFetcher } from "journal-pkg/fetchers/journal-useStampRallyFetcher";
import {
  FormStatus,
  MintStatusType,
  StampRallyEvents,
  Tpfw2024StampType,
} from "journal-pkg/types/stampRallyTypes";
import { BasicStampRallyTitle } from "journal-pkg/ui/atoms/journal-BasicStampRallyTitle";
import { BasicStampRallyForm } from "journal-pkg/ui/molecules/journal-BasicStampRallyForm";
import { useCallback, useMemo } from "react";

export const Tpfw2024StampRally: React.FC = () => {
  const {
    requestStampRallyReward,
    checkMintedTpfw2024Stamp: checkMintedStamp,
  } = useStampRallyFetcher();
  const { isSubmitting, isIncorrect } = useStampRallyForm();

  const keys: Tpfw2024StampType[] = [
    "TobirapolisFireworks2024",
    "ReflectedInTheRiver",
  ];
  const user = useAuth().user;
  const stampRally = user?.mintStatus?.TOBIRAPOLISFIREWORKS2024;
  const statuses: MintStatusType[] = useMemo(
    () =>
      keys.map((key) =>
        !stampRally || !stampRally[key] ? "NOTHING" : stampRally[key],
      ),
    [stampRally],
  );
  const isStampChecked = user?.isStampTpfw2024Checked;

  const checkStatus: () => FormStatus = useCallback(() => {
    if (isSubmitting.current) {
      return "Checking";
    } else if (isIncorrect.current) {
      return "Incorrect";
    } else if (statuses.includes("IN_PROGRESS")) {
      return "Minting";
    } else if (
      (statuses.includes("DONE") && !isStampChecked) ||
      !statuses.includes("NOTHING")
    ) {
      return "Success";
    } else {
      return "Nothing";
    }
  }, [statuses, isSubmitting.current, isIncorrect.current, isStampChecked]);

  const stampRallyMode = process.env
    .NEXT_PUBLIC_STAMPRALLY_MODE as StampRallyEvents;
  const endDate = process.env.NEXT_PUBLIC_STAMPRALLY_END_DATE as string;
  // console.log(endDate, Date.now(), new Date(endDate).getTime());
  if (
    stampRallyMode !== "TOBIRAPOLISFIREWORKS2024" ||
    Date.now() >= new Date(endDate).getTime()
  ) {
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
          onRedirectClick={checkMintedStamp}
        />
      </div>
    </div>
  );
};
