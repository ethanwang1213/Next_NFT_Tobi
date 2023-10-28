import { useAuth } from "contexts/journal-AuthProvider";
import { RoundedImage } from "../../atoms/journal-RoundedImage";
import { StampRallyTitle } from "../../atoms/journal-StampRallyTitle";
import { StampRallyRewardForm } from "../../molecules/journal-StampRallyRewardForm";
import { MintStatusType, Tpf2023StampType } from "types/journal-types";
import { useStampRallyFetcher } from "fetchers";
import { db } from "fetchers/firebase/journal-client";
import { doc, setDoc } from "firebase/firestore/lite";
import { useEffect, useRef } from "react";

type StampDataType = {
  key: Tpf2023StampType;
  blankSrc: string;
  src: string;
  status: MintStatusType;
};

/**
 * スタンプラリー特設表示のコンポーネント
 * @returns {ReactElement} The `StampRally` component
 */
export const StampRally = () => {
  const { requestReward } = useStampRallyFetcher();

  const stampRally = useAuth().user?.mintStatus?.TOBIRAPOLISFESTIVAL2023;
  const keys: Tpf2023StampType[] = [
    "G0",
    "G1alpha",
    "G1beta",
    "G1gamma",
    "G1delta",
  ];
  const STAMP_DIR = "/journal/images/tobirapolisfestival/2023/";
  const stamps: StampDataType[] = keys.map((key) => ({
    key: key,
    src: `${STAMP_DIR}${key.toLowerCase()}.png`,
    blankSrc: `${STAMP_DIR}${key.toLowerCase()}_blank.png`,
    status: !stampRally || !stampRally[key] ? "NOTHING" : stampRally[key],
  }));

  // debug stamprally
  const loadCheckboxRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();

  const handleInitClick = async () => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE !== "false" || !auth.user) return;
    const userSrcRef = doc(db, `users/${auth.user.id}`);
    await setDoc(userSrcRef, { mintStatus: {} }, { merge: true });
    auth.initMintStatusForDebug();
  };

  useEffect(() => {}, []);
  // end debug stamprally

  return (
    <div className="text-center text-primary">
      <div>
        <StampRallyTitle />
      </div>
      <div className="mt-6 sm:mt-12">
        <p className="text-xs sm:text-lg font-bold">
          すべて集めるとスペシャルスタンプNFTをプレゼント！
        </p>
        <div className="mt-3 sm:mt-6 flex justify-center gap-3 sm:gap-6 h-[56px] sm:h-[104px]">
          {stamps.map((v) => (
            <RoundedImage
              key={v.key}
              src={v.status === "DONE" ? v.src : v.blankSrc}
              alt={v.key}
              width={105}
              height={105}
              // debug stamprally
              loading={
                loadCheckboxRef.current &&
                loadCheckboxRef.current.checked &&
                v.status === "IN_PROGRESS"
              }
              // end debug stamprally
            />
          ))}
        </div>
      </div>
      <div className="w-full mt-6 sm:mt-12">
        <StampRallyRewardForm onSubmit={requestReward} />
      </div>
      <p className="mt-2 text-[10px] sm:text-xs font-bold">
        {"スタンプ押印(NFT mint)には時間がかかります。予めご了承ください。"}
      </p>
      <div className="mt-4 sm:mt-20 text-xs sm:text-base font-bold">
        <a>TOBIRAPOLIS祭詳細はこちら</a>
        {/* debug stamprally */}
        {process.env.NEXT_PUBLIC_STAMPRALLY_DEBUG === "true" && (
          <>
            <button
              onClick={handleInitClick}
              className="btn btn-xs btn-outline"
            >
              初期化
            </button>
            <label>load</label>
            <input
              type="checkbox"
              ref={loadCheckboxRef}
              defaultChecked={true}
            />
          </>
        )}
        {/* end debug stamprally */}
      </div>
    </div>
  );
};
