import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { useStampRallyForm } from "journal-pkg/contexts/journal-StampRallyFormProvider";
import { useStampRallyFetcher } from "journal-pkg/fetchers/journal-useStampRallyFetcher";
import {
  FormStatus,
  MintStatusType,
  StampRallyEvents,
  Tpf2025StampType,
} from "journal-pkg/types/stampRallyTypes";
import { useCallback, useMemo } from "react";
import { BasicStampRallyTitle } from "../../atoms/journal-BasicStampRallyTitle";
import { BasicStampRallyForm } from "../../molecules/journal-BasicStampRallyForm";

export const Tpf2025StampRally: React.FC = () => {
  const { requestStampRallyReward, checkMintedTpf2025Stamp: checkMintedStamp } =
    useStampRallyFetcher();
  const { isSubmitting, isIncorrect } = useStampRallyForm();

  const keys: Tpf2025StampType[] = ["TobirapolisFestival2025"];
  const user = useAuth().user;
  const stampRally = user?.mintStatus?.TOBIRAPOLISFESTIVAL2025;
  const statuses: MintStatusType[] = useMemo(
    () =>
      keys.map((key) =>
        !stampRally || !stampRally[key] ? "NOTHING" : stampRally[key],
      ),
    [stampRally],
  );
  const isStampChecked = user?.isStampTpf2025Checked;

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
    stampRallyMode !== "TOBIRAPOLISFESTIVAL2025" ||
    Date.now() >= new Date(endDate).getTime()
  ) {
    return null;
  }

  return (
    <div className="pb-2 sm:pb-0">
      <BasicStampRallyTitle />
      <div>
        <BasicStampRallyForm
          event="TOBIRAPOLISFESTIVAL2025"
          status={checkStatus()}
          onSubmit={requestStampRallyReward}
          onRedirectClick={checkMintedStamp}
        />
      </div>
    </div>
  );
};
