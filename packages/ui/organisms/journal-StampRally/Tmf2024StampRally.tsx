import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../../contexts/journal-AuthProvider";
import { useStampRallyFetcher } from "../../../fetchers/journal-useStampRallyFetcher";
import {
  MintStatusType,
  Tmf2024StampType,
} from "../../../types/stampRallyTypes";
import { StampRallyRewardForm } from "../../molecules/journal-StampRallyRewardForm";

type StampDataType = {
  key: Tmf2024StampType;
  blankSrc: string;
  src: string;
  status: MintStatusType;
};

export const Tmf2024StampRally: React.FC = () => {
  const { requestTmf2024Reward } = useStampRallyFetcher();

  const key: Tmf2024StampType = "Stamp";
  const STAMP_DIR = "/journal/images/tobirapolismusicfestival/2024/";
  const stampRally = useAuth().user?.mintStatus?.Tmf2024;
  const stamp: StampDataType = {
    key: key,
    src: `${STAMP_DIR}${key.toLowerCase()}.png`,
    blankSrc: `${STAMP_DIR}${key.toLowerCase()}_blank.png`,
    status: !stampRally || !stampRally[key] ? "NOTHING" : stampRally[key],
  };

  const loading = stamp.status === "IN_PROGRESS";

  // TODO: display stamprally
  return (
    <div>
      {loading ? (
        <div className="absolute w-full h-full left-0 top-0 flex justify-center grid content-center">
          <FontAwesomeIcon className="" fontSize={32} icon={faSpinner} spin />
        </div>
      ) : (
        <div>minted</div>
      )}
      <StampRallyRewardForm onSubmit={requestTmf2024Reward} />
    </div>
  );
};
