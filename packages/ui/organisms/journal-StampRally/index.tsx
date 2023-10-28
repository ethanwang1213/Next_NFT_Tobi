import { useAuth } from "contexts/journal-AuthProvider";
import { RoundedImage } from "../../atoms/journal-RoundedImage";
import { StampRallyTitle } from "../../atoms/journal-StampRallyTitle";
import { StampRallyRewardForm } from "../../molecules/journal-StampRallyRewardForm";
import { MintStatusType, Tpf2023StampType } from "types/journal-types";
import { useStampRallyFetcher } from "fetchers";
import { db } from "fetchers/firebase/journal-client";
import { doc, setDoc } from "firebase/firestore/lite";
import { useEffect, useMemo, useRef } from "react";

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
export const StampRally: React.FC = () => {
  const { requestReward } = useStampRallyFetcher();

  // preparing stamps data
  const keys: Tpf2023StampType[] = [
    "G0",
    "G1alpha",
    "G1beta",
    "G1gamma",
    "G1delta",
  ];
  const STAMP_DIR = "/journal/images/tobirapolisfestival/2023/";
  const stampRally = useAuth().user?.mintStatus?.TOBIRAPOLISFESTIVAL2023;
  const stamps: StampDataType[] = keys.map((key) => ({
    key: key,
    src: `${STAMP_DIR}${key.toLowerCase()}.png`,
    blankSrc: `${STAMP_DIR}${key.toLowerCase()}_blank.png`,
    status: !stampRally || !stampRally[key] ? "NOTHING" : stampRally[key],
  }));

  // setting height of stamps. This means size of them.
  const STAMP_H = 120;
  const STAMP_H_SP = 72;

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

  const mintCheckboxRef0 = useRef<HTMLInputElement>(null);
  const mintCheckboxRef1 = useRef<HTMLInputElement>(null);
  const mintCheckboxRef2 = useRef<HTMLInputElement>(null);
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
        <div
          className={`mt-3 sm:mt-6 flex justify-center sm:gap-2 h-[${STAMP_H_SP}px] sm:h-[${STAMP_H}px]`}
        >
          {stamps.map((v) => (
            <RoundedImage
              key={v.key}
              src={v.status === "DONE" ? v.src : v.blankSrc}
              alt={v.key}
              width={STAMP_H}
              height={STAMP_H}
              // debug stamprally
              loading={useMemo(
                () =>
                  loadCheckboxRef.current &&
                  loadCheckboxRef.current.checked &&
                  v.status === "IN_PROGRESS",
                [loadCheckboxRef.current]
              )}
              // end debug stamprally
            />
          ))}
        </div>
      </div>
      <div className="w-full mt-4 sm:mt-10">
        <StampRallyRewardForm
          onSubmit={requestReward}
          // debug stamprally
          mintChecked0={mintCheckboxRef0}
          mintChecked1={mintCheckboxRef1}
          mintChecked2={mintCheckboxRef2}
          // end debug stamprally
        />
      </div>
      <p className="mt-1 text-[10px] sm:text-xs font-bold">
        {"スタンプ押印(NFT mint)には時間がかかります。予めご了承ください。"}
      </p>
      <div className="mt-6 sm:mt-10 text-xs sm:text-base font-bold">
        <p>
          TOBIRAPOLIS祭詳細は
          <a
            href="https://tobirapolis.notion.site/TOBIRAPOLIS-4295b312a97d43d8832c6668eb62c2ae"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-info"
          >
            こちら
          </a>
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
              <label>mint</label>
              <input
                type="checkbox"
                ref={mintCheckboxRef0}
                defaultChecked={false}
              />
              <input
                type="checkbox"
                ref={mintCheckboxRef1}
                defaultChecked={false}
              />
              <input
                type="checkbox"
                ref={mintCheckboxRef2}
                defaultChecked={false}
              />
            </>
          )}
          {/* end debug stamprally */}
        </p>
      </div>
    </div>
  );
};
