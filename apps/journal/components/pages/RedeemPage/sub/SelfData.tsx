import { useContext } from "react";
import { RedeemContext } from "../../../../contexts/RedeemContextProvider";
import RedeemDataLine from "./RedeemDataLine";
import { useAuth } from "@/contexts/AuthProvider";

const SelfData: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="grid gap-[1%] sm:gap-10">
      <RedeemDataLine
        dataType={"受け取り対象アカウント名"}
        dataValue={user && user.name !== "" ? user.name : "-"}
      />
      <RedeemDataLine
        dataType={"受け取り対象メールアドレス"}
        dataValue={user && user.email ? user.email : "-"}
        hidable={true}
      />
    </div>
  );
};

export default SelfData;
