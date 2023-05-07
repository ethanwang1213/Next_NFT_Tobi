import Pc from "../components/book/pc";
import Image from "next/image";

const Index = () => {
  return (
    <>
      <Image src="/images/book/bg_journal.png" fill alt="bg_journal"></Image>
      <div className="hidden md:block">
        <Pc />
      </div>
    </>
  );
};

export default Index;
