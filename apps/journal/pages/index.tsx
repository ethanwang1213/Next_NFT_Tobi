import Mobile from "../components/Book/Mobile";
import Pc from "../components/Book/Pc";
import Image from "next/image";
import EditProfileModal from "@/components/pages/ProfilePage/sub/EditProfile/EditProfileModal";
import CropNewIconModal from "@/components/pages/ProfilePage/sub/EditProfile/CropNewIconModal";
import SoundToggle from "@/components/SoundToggle";
import DebugText from "@/components/DebugText";
// import FooterLoginGuide from "@/components/FooterLoginGuide";
// import LoginGuideModal from "@/components/LoginGuideModal";
import NftViewModal from "@/components/NftViewModal";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { getAuth } from "@firebase/auth";

const Index = () => {
  const router = useRouter();
  const auth = getAuth();
  const { user } = useAuth();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === "false" && !auth.currentUser) {
      router.push("/login");
    }
  }, [auth.currentUser]);

  return (
    <div
      className={
        process.env.NEXT_PUBLIC_DEBUG_MODE === "false" && (!user || !user.email)
          ? "invisible"
          : ""
      }
    >
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
      {/* <LoginGuideModal />
      <FooterLoginGuide /> */}
      <NftViewModal />
    </div>
  );
};

export default Index;
