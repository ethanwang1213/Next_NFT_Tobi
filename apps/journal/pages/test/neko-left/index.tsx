import { NextPage } from "next";
import NekoPage from "../../../components/pages/NekoPage/NekoPage";

const NekoLeftPage: NextPage = () => {
  return (
    <div className="h-[90vh]">
      <NekoPage pageNum={0} />
    </div>
  );
};

export default NekoLeftPage;
