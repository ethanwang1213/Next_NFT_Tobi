import DebugText from "@/components/DebugText";
import NftViewModal from "@/components/NftViewModal";
import CropNewIconModal from "@/components/pages/ProfilePage/sub/EditProfile/CropNewIconModal";
import EditProfileModal from "@/components/pages/ProfilePage/sub/EditProfile/EditProfileModal";
import { BookProvider } from "@/contexts/journal-BookProvider";
import { EditProfileProvider } from "@/contexts/journal-EditProfileProvider";
import { RedeemStatusProvider } from "@/contexts/journal-RedeemStatusProvider";
import {
  emailLinkOnly,
  useAuth,
} from "journal-pkg/contexts/journal-AuthProvider";
import { auth } from "journal-pkg/fetchers/firebase/journal-client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Mobile from "../components/Book/Mobile";
import Pc from "../components/Book/Pc";

const Index = () => {
  const [authCheck, setAuthCheck] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // When the user is no longer empty, it means that the onAuthStateChanged process has completed.
    if (!auth || !user) return;
    if (process.env.NEXT_PUBLIC_DEBUG_MODE !== "true") {
      if (
        !auth.currentUser?.email || // anonymous
        !auth.currentUser?.emailVerified
      ) {
        router.push("/login");
      } else {
        emailLinkOnly(auth.currentUser.email).then((result) => {
          if (result) {
            auth.signOut();
            router.push("/login");
            return;
          }
          setAuthCheck(true);
        });
      }
    }
  }, [auth, user]);

  return (
    <RedeemStatusProvider>
      <EditProfileProvider>
        <BookProvider>
          <div
            className={
              process.env.NEXT_PUBLIC_DEBUG_MODE !== "true" &&
              (!user || !user.email || !authCheck)
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
