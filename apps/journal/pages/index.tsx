import Mobile from "../components/book/Mobile";
import Pc from "../components/book/Pc";
import Image from "next/image";

const Index = () => {
  return (
    <>
      <Image src="/images/book/bg_journal.png" fill alt="bg_journal"></Image>
      <div className="hidden sm:block">
        <Pc />
      </div>
      <div className="block sm:hidden">
        <Mobile />
      </div>
    </>
  );
};

export default Index;
