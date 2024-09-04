import {
  Nothing,
  Checking,
  Minting,
  Incorrect,
  Success,
} from "../atoms/journal-BasicStampRallyStatus";
import { BasicStampRallyInput } from "../atoms/journal-BasicStampRallyInput";
import { BasicStampRallyRedirectButton } from "../atoms/journal-BasicStampRallyRedirectButton";
import { StampRallyEvents, StampRallyRewardFormType } from "types/stampRallyTypes";

export type FormStatus = "Nothing" | "Checking" | "Minting" | "Incorrect" | "Success";

type Props = {
  event: StampRallyEvents;
  status: FormStatus;
  onSubmit: (data: StampRallyRewardFormType) => void;
  onRedirectClick?: () => void;
};

export const BasicStampRallyForm: React.FC<Props> = ({
  event,
  status,
  onSubmit,
  onRedirectClick,
}) => {
  return (
    <div>
      <div className="flex justify-center pt-5 sm:pt-10">
        {status === "Nothing" && <Nothing />}
        {status === "Checking" && <Checking />}
        {status === "Minting" && <Minting />}
        {status === "Incorrect" && <Incorrect />}
        {status === "Success" && <Success />}
      </div>
      <div className="h-8">
        {(status === "Nothing" || status === "Incorrect") && (
          <BasicStampRallyInput event={event} onSubmit={onSubmit} />
        )}
        {(status === "Checking" || status === "Minting") && <div></div>}
        {status === "Success" && <BasicStampRallyRedirectButton onClick={onRedirectClick} />}
      </div>
    </div>
  );
};
