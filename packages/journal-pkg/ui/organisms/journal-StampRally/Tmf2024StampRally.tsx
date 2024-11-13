import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { useStampRallyForm } from "journal-pkg/contexts/journal-StampRallyFormProvider";
import { useStampRallyFetcher } from "journal-pkg/fetchers/journal-useStampRallyFetcher";
import {
  FormStatus,
  MintStatusType,
  Tmf2024StampType,
} from "journal-pkg/types/stampRallyTypes";
import { BasicStampRallyTitle } from "journal-pkg/ui/atoms/journal-BasicStampRallyTitle";
import { BasicStampRallyForm } from "journal-pkg/ui/molecules/journal-BasicStampRallyForm";
import { useCallback, useMemo } from "react";

export const Tmf2024StampRally: React.FC = () => {
  const { requestStampRallyReward, checkMintedTmf2024Stamp: checkMintedStamp } =
    useStampRallyFetcher();
  const { isSubmitting, isIncorrect } = useStampRallyForm();

  const keys: Tmf2024StampType[] = [
    "TobiraMusicFestival2024",
    "YouSoTotallyRock",
  ];
  const user = useAuth().user;
  const stampRally = user?.mintStatus?.TOBIRAMUSICFESTIVAL2024;
  const statuses: MintStatusType[] = useMemo(
    () =>
      keys.map((key) =>
        !stampRally || !stampRally[key] ? "NOTHING" : stampRally[key],
      ),
    [stampRally],
  );
  const isStampChecked = user?.isStampTmf2024Checked;

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

  return (
    <div className="pb-2 sm:pb-0">
      <BasicStampRallyTitle />
      <div>
        <BasicStampRallyForm
          event="TOBIRAMUSICFESTIVAL2024"
          status={checkStatus()}
          onSubmit={requestStampRallyReward}
          onRedirectClick={checkMintedStamp}
        />
      </div>
    </div>
  );
};
