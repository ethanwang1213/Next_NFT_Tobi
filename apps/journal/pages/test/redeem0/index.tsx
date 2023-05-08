import { NextPage } from "next";
import RedeemPage from "../../../components/pages/RedeemPage/RedeemPage";
import RedeemStatusContextProvider from "../../../contexts/RedeemStatusContextProvider";

const TestRedeem0: NextPage = () => {
  return (
    <div className="h-[90vh]">
      <RedeemStatusContextProvider>
        <RedeemPage pageNum={0} />
      </RedeemStatusContextProvider>
    </div>
  );
};

export default TestRedeem0;
