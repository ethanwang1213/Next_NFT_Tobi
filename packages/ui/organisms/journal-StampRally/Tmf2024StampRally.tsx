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

  const keys: Tmf2024StampType[] = [
    "TobiraMusicFestival2024",
    "YouSoTotallyRock",
  ];
  const STAMP_DIR = "/journal/images/tobiramusicfestival/2024/";
  const stampRally = useAuth().user?.mintStatus?.TOBIRAMUSICFESTIVAL2024;
  const stamps: StampDataType[] = keys.map((key) => ({
    key: key,
    src: `${STAMP_DIR}${key.toLowerCase()}.png`,
    blankSrc: `${STAMP_DIR}${key.toLowerCase()}_blank.png`,
    status: !stampRally || !stampRally[key] ? "NOTHING" : stampRally[key],
  }));

  // TODO: display stamprally
  return (
    <div>
      {stamps.map((v) => {
        if (v.status === "NOTHING") {
          return <div key={v.key}>nothing</div>;
        } else if (v.status === "IN_PROGRESS") {
          return (
            <div key={v.key}>
              <FontAwesomeIcon
                className=""
                fontSize={32}
                icon={faSpinner}
                spin
              />
            </div>
          );
        } else if (v.status === "DONE") {
          return <div key={v.key}>minted</div>;
        }
      })}
      <div className="w-full mt-4 sm:mt-10">
        <StampRallyRewardForm
          onSubmit={requestTmf2024Reward}
          event="TOBIRAMUSICFESTIVAL2024"
        />
      </div>
    </div>
  );
};
