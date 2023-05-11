import { NextPage } from "next";
import RedeemPage from "../../../components/pages/RedeemPage/RedeemPage";
import RedeemStatusContextProvider from "../../../contexts/RedeemContextProvider";

/**
 * 主にスマホ表示のテスト用ページ
 * @returns
 */
const TestRedeem0: NextPage = () => {
  return (
    <div className="h-[90vh]">
      <RedeemPage pageNum={0} />
    </div>
  );
};

export default TestRedeem0;
