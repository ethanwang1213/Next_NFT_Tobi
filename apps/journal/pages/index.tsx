import Mobile from "../components/Book/Mobile";
import Pc from "../components/Book/Pc";
import Image from "next/image";
import EditProfileModal from "@/components/pages/ProfilePage/sub/EditProfile/EditProfileModal";
import CropNewIconModal from "@/components/pages/ProfilePage/sub/EditProfile/CropNewIconModal";
import SoundToggle from "@/components/SoundToggle";
import DebugText from "@/components/DebugText";

const Index = () => {
  return (
    <>
      <Image
        src="/journal/images/book/bg_journal.png"
        fill
        alt="bg_journal"
        className="pointer-events-none select-none"
      />
      <div className="hidden sm:block">
        <Pc />
      </div>
      <div className="block sm:hidden">
        <Mobile />
      </div>
      <EditProfileModal />
      <CropNewIconModal />
      <SoundToggle />
      <DebugText />
    </>
  );
};

export default Index;
