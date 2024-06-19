import { useAuth } from "contexts/journal-AuthProvider";
import { useStampRallyFetcher } from "fetchers/journal-useStampRallyFetcher";
import {
  FormStatus,
  MintStatusType,
  Tmf2024StampType,
} from "types/stampRallyTypes";
import { Tmf2024Form } from "../../molecules/journal-Tmf2024Form";
import { useStampRallyForm } from "contexts/journal-StampRallyFormProvider";
import { useCallback, useMemo } from "react";
import { Tmf2024Title } from "../../atoms/journal-Tmf2024Title";

type StampDataType = {
  key: Tmf2024StampType;
  blankSrc: string;
  src: string;
  status: MintStatusType;
};

export const Tmf2024StampRally: React.FC = () => {
  const { requestTmf2024Reward, checkMintedStamp } = useStampRallyFetcher();
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
        !stampRally || !stampRally[key] ? "NOTHING" : stampRally[key]
      ),
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
    } else if (
      (statuses.includes("DONE") && !isStampChecked) ||
      !statuses.includes("NOTHING")
    ) {
      return "Success";
    } else {
      return "Nothing";
    }
  }, [statuses, isSubmitting.current, isIncorrect.current, isStampChecked]);

  // TODO: display stamprally
  return (
    <div>
      <Tmf2024Title />
      <div>
        <Tmf2024Form
          status={checkStatus()}
          onSubmit={requestTmf2024Reward}
          onRedirectClick={checkMintedStamp}
        />
      </div>
    </div>
  );
};
