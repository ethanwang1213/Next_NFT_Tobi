import {
  StampRallyEvents,
  StampRallyRewardFormType,
} from "journal-pkg/types/stampRallyTypes";
import { BasicStampRallyInput } from "journal-pkg/ui/atoms/journal-BasicStampRallyInput";
import { BasicStampRallyRedirectButton } from "journal-pkg/ui/atoms/journal-BasicStampRallyRedirectButton";
import {
  Checking,
  Incorrect,
  Minting,
  Nothing,
  Success,
} from "journal-pkg/ui/atoms/journal-BasicStampRallyStatus";

export type FormStatus =
  | "Nothing"
  | "Checking"
  | "Minting"
  | "Incorrect"
  | "Success";

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
        {status === "Success" && (
          <BasicStampRallyRedirectButton onClick={onRedirectClick} />
        )}
      </div>
    </div>
  );
};
