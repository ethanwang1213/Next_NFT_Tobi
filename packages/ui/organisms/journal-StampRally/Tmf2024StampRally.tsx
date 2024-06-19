import { useAuth } from "contexts/journal-AuthProvider";
import { useStampRallyFetcher } from "fetchers/journal-useStampRallyFetcher";
import {
  FormStatus,
  MintStatus,
  MintStatusType,
  Tmf2024StampType,
} from "types/stampRallyTypes";
import TobirapolisIcon from "../../../../apps/journal/public/images/icon/tobirapolis_icon.svg";
import { Tmf2024Form } from "../../molecules/journal-Tmf2024Form";
import { useBookContext } from "../../../../apps/journal/contexts/journal-BookProvider";
import { useStampRallyForm } from "contexts/journal-StampRallyFormProvider";
import { useCallback } from "react";

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
  const statuses: MintStatusType[] = keys.map((key) =>
    !stampRally || !stampRally[key] ? "NOTHING" : stampRally[key]
  );
  const isStampChecked = user?.isStampTmf2024Checked;

  const checkStatus: () => FormStatus = useCallback(() => {
    console.log("check status");
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
      <div className="flex">
        <div className="py-2">
          <TobirapolisIcon />
        </div>
        <div className="pl-6 pt-1">
          <h3 className="text-dark-brown text-[32px] font-bold">
            Enter the Keyword
          </h3>
          <p className="text-primary text-xs font-bold">
            If you enter the correct keyword, it will be recorded in your
            Journal.
          </p>
        </div>
      </div>
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
