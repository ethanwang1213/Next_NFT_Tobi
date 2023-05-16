import { useContext, useEffect } from "react";
import { RedeemContext } from "../../../contexts/RedeemContextProvider";
import RedeemPage0 from "./sub/RedeemPage0";
import RedeemPage1 from "./sub/RedeemPage1";

type Props = {
  pageNum: number;
};

/**
 * redeemページのコンポーネント
 * @param param0
 * @returns
 */
const RedeemPage: React.FC<Props> = ({ pageNum }) => {
  const { redeemStatus, selfAccount, selfJournalId } =
    useContext(RedeemContext);

  // TODO: アカウント情報の読み込み
  useEffect(() => {
    selfAccount.set("KEISUKE");
    selfJournalId.set("keisukeId");
  }, []);

  return pageNum % 2 === 0 ? <RedeemPage0 /> : <RedeemPage1 />;
};

export default RedeemPage;
