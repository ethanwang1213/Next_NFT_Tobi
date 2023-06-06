import { NextPage } from "next";
import NFTPage from "../../../components/pages/NFTPage/NFTPage";

const NFTRightPage: NextPage = () => {
  return (
    <div className="h-[90vh]">
      <NFTPage pageNum={1} />
    </div>
  );
};

export default NFTRightPage;
