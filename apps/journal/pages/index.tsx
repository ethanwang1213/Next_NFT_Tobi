import Mobile from "../components/book/Mobile";
import Pc from "../components/book/Pc";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthProvider";

const Index = () => {
  const currentUser = useAuth();
  console.log(currentUser);

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
