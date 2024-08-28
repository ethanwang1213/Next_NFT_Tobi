import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { useEffect } from "react";
import { useRedeemStatus } from "../../../contexts/journal-RedeemStatusProvider";
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
  const { selfAccount, selfJournalId } = useRedeemStatus();
  const { user } = useAuth();

  // TODO: アカウント情報の読み込み
  useEffect(() => {
    if (!user) return;
    selfAccount.set(user.name);
    selfJournalId.set("keisukeId");
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return pageNum % 2 === 0 ? <RedeemPage0 /> : <RedeemPage1 />;
};

export default RedeemPage;
