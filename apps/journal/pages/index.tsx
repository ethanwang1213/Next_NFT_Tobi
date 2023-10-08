import { auth } from "fetchers/firebase/journal-client";
import Mobile from "../components/Book/Mobile";
import Pc from "../components/Book/Pc";
import Image from "next/image";
import EditProfileModal from "@/components/pages/ProfilePage/sub/EditProfile/EditProfileModal";
import CropNewIconModal from "@/components/pages/ProfilePage/sub/EditProfile/CropNewIconModal";
import DebugText from "@/components/DebugText";
import NftViewModal from "@/components/NftViewModal";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "contexts/journal-AuthProvider";
import { RedeemStatusProvider } from "@/contexts/RedeemStatusProvider";
import { BookProvider } from "@/contexts/BookProvider";
import { EditProfileProvider } from "@/contexts/EditProfileProvider";

const Index = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!auth) return;
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === "false" && !auth.currentUser) {
      router.push("/login");
    }
  }, [auth]);

  return (
    <RedeemStatusProvider>
      <EditProfileProvider>
        <BookProvider>
          <div
            className={
              process.env.NEXT_PUBLIC_DEBUG_MODE === "false" &&
              (!user || !user.email)
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
            <DebugText />
            <NftViewModal />
          </div>
        </BookProvider>
      </EditProfileProvider>
    </RedeemStatusProvider>
  );
};

export default Index;
