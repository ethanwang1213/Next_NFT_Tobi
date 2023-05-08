import { NextPage } from "next";
import RedeemPage from "../../../components/pages/RedeemPage/RedeemPage";

const TestRedeem1: NextPage = () => {
  return (
    <div className="h-[90vh]">
      <RedeemPage pageNum={1} />
    </div>
  );
};

export default TestRedeem1;
