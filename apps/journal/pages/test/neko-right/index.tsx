import { NextPage } from "next";
import NekoPage from "../../../components/pages/NekoPage/NekoPage";

const NekoRightPage: NextPage = () => {
  return (
    <div className="h-[90vh]">
      <NekoPage pageNum={1} />
    </div>
  );
};

export default NekoRightPage;
