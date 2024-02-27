import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import RedeemDataLine from "./RedeemDataLine";

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
