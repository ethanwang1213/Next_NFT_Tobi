import { useContext, useEffect, useMemo } from "react";
import Mobile from "../components/Book/Mobile";
import Pc from "../components/Book/Pc";
import Image from "next/image";
import { BookContext } from "@/contexts/BookContextProvider";
import ProfilePage0 from "@/components/pages/ProfilePage/ProfilePage0";
import EditProfileModal from "@/components/pages/ProfilePage/sub/EditProfile/EditProfileModal";
import CropNewIconModal from "@/components/pages/ProfilePage/sub/EditProfile/CropNewIconModal";
import { useAuth } from "@/contexts/AuthProvider";
import { collection, getDocs, query } from "@firebase/firestore";
import { db } from "@/firebase/client";
import SoundToggle from "@/components/SoundToggle";

const Index = () => {
  const { pages, pageNo } = useContext(BookContext);
  const isProfilePage0 = useMemo(
    () =>
      pages.current.length > 0 &&
      pages.current[pageNo.current].type === ProfilePage0,
    [pages.current, pageNo.current]
  );

  return (
    <>
      <Image src="/journal/images/book/bg_journal.png" fill alt="bg_journal" />
      <div className="hidden sm:block">
        <Pc />
      </div>
      <div className="block sm:hidden">
        <Mobile />
      </div>
      {isProfilePage0 && (
        <>
          <EditProfileModal />
          <CropNewIconModal />
        </>
      )}
      <SoundToggle />
    </>
  );
};

export default Index;
