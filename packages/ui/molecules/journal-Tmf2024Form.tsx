import {
  Nothing,
  Checking,
  Minting,
  Incorrect,
  Success,
} from "../atoms/journal-Tmf2024Status";
import { Tmf2024Input } from "../atoms/journal-Tmf2024Input";
import { Tmf2024RedirectButton } from "../atoms/journal-Tmf2024RedirectButton";

type Status = "Nothing" | "Checking" | "Minting" | "Incorrect" | "Success";

type Props = {
  status: Status;
};

export const Tmf2024Form: React.FC<Props> = ({ status }) => {
  return (
    <div>
      <div className="flex justify-center pt-10">
        {status === "Nothing" && <Nothing />}
        {status === "Checking" && <Checking />}
        {status === "Minting" && <Minting />}
        {status === "Incorrect" && <Incorrect />}
        {status === "Success" && <Success />}
      </div>
      <div className="h-8">
        {(status === "Nothing" || status === "Incorrect") && <Tmf2024Input />}
        {(status === "Checking" || status === "Minting") && <div></div>}
        {status === "Success" && <Tmf2024RedirectButton />}
      </div>
    </div>
  );
};
