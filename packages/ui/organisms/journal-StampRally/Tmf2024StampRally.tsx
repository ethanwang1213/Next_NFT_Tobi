import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "contexts/journal-AuthProvider";
import { useStampRallyFetcher } from "fetchers/journal-useStampRallyFetcher";
import { MintStatusType, Tmf2024StampType } from "types/stampRallyTypes";
import { Tpf2023RewardForm } from "../../molecules/journal-Tpf2023RewardForm";
import TobirapolisIcon from "../../../../apps/journal/public/images/icon/tobirapolis_icon.svg";
import { Tmf2024Form } from "../../molecules/journal-Tmf2024Form";

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
        <Tmf2024Form status="Success" />
      </div>
    </div>
  );
};
