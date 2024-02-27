import DebugText from "@/components/DebugText";
import NftViewModal from "@/components/NftViewModal";
import CropNewIconModal from "@/components/pages/ProfilePage/sub/EditProfile/CropNewIconModal";
import EditProfileModal from "@/components/pages/ProfilePage/sub/EditProfile/EditProfileModal";
import { BookProvider } from "@/contexts/journal-BookProvider";
import { EditProfileProvider } from "@/contexts/journal-EditProfileProvider";
import { RedeemStatusProvider } from "@/contexts/journal-RedeemStatusProvider";
import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { auth } from "journal-pkg/fetchers/firebase/journal-client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Mobile from "../components/Book/Mobile";
import Pc from "../components/Book/Pc";

const Index = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!auth) return;
    if (process.env.NEXT_PUBLIC_DEBUG_MODE !== "true" && !auth.currentUser) {
      router.push("/login");
    }
  }, [auth]);

  return (
    <RedeemStatusProvider>
      <EditProfileProvider>
        <BookProvider>
          <div
            className={
              process.env.NEXT_PUBLIC_DEBUG_MODE !== "true" &&
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
