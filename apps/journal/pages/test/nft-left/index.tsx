import { NextPage } from "next";
import NFTPage from "@/components/pages/NFTPage/NFTPage/NFTPage";

const NFTLeftPage: NextPage = () => {
  return (
    <div className="h-[90vh]">
      <NFTPage pageNum={0} />
    </div>
  );
};

export default NFTLeftPage;
