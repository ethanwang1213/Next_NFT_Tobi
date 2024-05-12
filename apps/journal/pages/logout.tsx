import { useActivityRecord } from "@/contexts/journal-ActivityRecordProvider";
import { useDiscordOAuth } from "@/contexts/journal-DiscordOAuthProvider";
import { useHoldNfts } from "@/contexts/journal-HoldNftsProvider";
import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { auth } from "journal-pkg/fetchers/firebase/journal-client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Logout = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { initContext: initActivityContext } = useActivityRecord();
  const { initContext: initNftsContext } = useHoldNfts();
  const { initContext: initDiscordContext } = useDiscordOAuth();

  useEffect(() => {
    if (!user) return;

    const handleLogout = async () => {
      try {
        if (user.email) {
          initActivityContext();
          initNftsContext();
          initDiscordContext();
          await auth.signOut();
        }
        router.push("/login");
      } catch (error) {
        console.error("ログアウトに失敗しました。", error);
      }
    };

    handleLogout();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [router, user]);

  return (
    <>
      <div className="fixed -top-6 -left-6 -bottom-6 -right-6">
        <Image
          src="/journal/images/login/Journal_topbg.png"
          alt="background image"
          fill
        />
      </div>
      <div className="fixed top-[-3vh] left-[-5vw] md:left-[20vw] w-[300px] h-[300px] scale-75">
        <Image
          src="/journal/images/login/arc/arc1_journal.svg"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="fixed top-[30vh] right-[-5vw] md:right-[3vw] w-[300px] h-[300px] scale-125">
        <Image
          src="/journal/images/login/arc/arc2_journal.svg"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="fixed bottom-[-3vh] left-[-10vw] md:left-[20vw] w-[300px] h-[300px] scale-150 rotate-90">
        <Image
          src="/journal/images/login/arc/arc3_journal.svg"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="flex items-center justify-center p-5 w-screen h-screen">
        <div className="relative aspect-square w-full max-w-[500px] flex items-center justify-center">
          <Image src="/journal/images/login/box_journal.svg" alt="logo" fill />
          <div className="absolute flex items-center justify-center h-[75%] w-[75%]">
            <div className="absolute h-[80%] w-[80%] block">
              <Image
                src="/journal/images/login/liner_journal.svg"
                alt="logo"
                fill
              />
            </div>
            <Image src="/journal/images/login/Journal.svg" alt="logo" fill />
          </div>
          <h1 className="text-4xl absolute text-accent top-[75%]">Logout...</h1>
        </div>
      </div>
      <div className="flex justify-center fixed -bottom-32 right-0 left-0 h-72">
        <Image
          src="/journal/images/login/Journalbookangle_journal.svg"
          alt="logo"
          fill
        />
      </div>
    </>
  );
};

export default Logout;
