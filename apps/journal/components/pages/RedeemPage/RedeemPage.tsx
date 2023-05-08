import RedeemStatusContextProvider from "../../../contexts/RedeemStatusContextProvider";
import RedeemPage0 from "./sub/RedeemPage0";
import RedeemPage1 from "./sub/RedeemPage1";

type Props = {
  pageNum: number;
};

const RedeemPage: React.FC<Props> = ({ pageNum }) => {
  return (
    <RedeemStatusContextProvider>
      {pageNum % 2 === 0 ? <RedeemPage0 /> : <RedeemPage1 />}
    </RedeemStatusContextProvider>
  );
};

export default RedeemPage;
