import { NextPage } from "next";
import RedeemPage from "../../../components/pages/RedeemPage/RedeemPage";
import RedeemStatusContextProvider from "../../../contexts/RedeemStatusContextProvider";

const TestRedeem1: NextPage = () => {
  return (
    <div className="h-[90vh] flex">
      <RedeemStatusContextProvider>
        <RedeemPage pageNum={0} />
        <RedeemPage pageNum={1} />
      </RedeemStatusContextProvider>
    </div>
  );
};

export default TestRedeem1;
