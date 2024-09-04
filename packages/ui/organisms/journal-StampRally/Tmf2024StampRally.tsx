import { useAuth } from "contexts/journal-AuthProvider";
import { useStampRallyFetcher } from "fetchers/journal-useStampRallyFetcher";
import { FormStatus, MintStatusType, Tmf2024StampType } from "types/stampRallyTypes";
import { BasicStampRallyForm } from "../../molecules/journal-BasicStampRallyForm";
import { useStampRallyForm } from "contexts/journal-StampRallyFormProvider";
import { useCallback, useMemo } from "react";
import { BasicStampRallyTitle } from "../../atoms/journal-BasicStampRallyTitle";

export const Tmf2024StampRally: React.FC = () => {
  const { requestStampRallyReward, checkMintedTmf2024Stamp: checkMintedStamp } =
    useStampRallyFetcher();
  const { isSubmitting, isIncorrect } = useStampRallyForm();

  const keys: Tmf2024StampType[] = ["TobiraMusicFestival2024", "YouSoTotallyRock"];
  const user = useAuth().user;
  const stampRally = user?.mintStatus?.TOBIRAMUSICFESTIVAL2024;
  const statuses: MintStatusType[] = useMemo(
    () => keys.map((key) => (!stampRally || !stampRally[key] ? "NOTHING" : stampRally[key])),
    [stampRally]
  );
  const isStampChecked = user?.isStampTmf2024Checked;

  const checkStatus: () => FormStatus = useCallback(() => {
    if (isSubmitting.current) {
      return "Checking";
    } else if (isIncorrect.current) {
      return "Incorrect";
    } else if (statuses.includes("IN_PROGRESS")) {
      return "Minting";
    } else if ((statuses.includes("DONE") && !isStampChecked) || !statuses.includes("NOTHING")) {
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
