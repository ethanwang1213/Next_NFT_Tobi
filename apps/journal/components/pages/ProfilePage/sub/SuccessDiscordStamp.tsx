import { useBookContext } from "@/contexts/journal-BookProvider";
import { useDebug } from "@/contexts/journal-DebugProvider";
import { useDiscordOAuth } from "@/contexts/journal-DiscordOAuthProvider";
import StampIcon2 from "@/public/images/icon/stamp_TOBIRAPOLIS-cp.svg";
import StampIcon from "@/public/images/icon/stamp_TOBIRAPOLIS.svg";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowSize } from "react-use";

type Props = {
  isPc: boolean;
};

/**
 * Discord参加完了時に表示するスタンプ
 *
 * スタンプsvgを二か所（or 二つ同時？）にレンダリングすると
 * 片方の表示がおかしくなるっぽいのでpcとspで別なアイコンを表示している
 * @returns
 */
const SuccessDiscordStamp: React.FC<Props> = ({ isPc }) => {
  const { displayMode } = useDiscordOAuth();
  const { debugDiscordButtonMode } = useDebug();
  const { width, height } = useWindowSize();
  const stampRef = useRef(null);
  const [stampW, setStampW] = useState(0);

  const bookContext = useBookContext();
  const pageNo = bookContext.pageNo.current;
  const { profilePage } = bookContext.bookIndex;

  // stampの横幅を取得
  useEffect(() => {
    if (!stampRef.current) return;
    setStampW(stampRef.current.clientWidth);
  }, [debugDiscordButtonMode, displayMode, stampRef.current, width, height]); // eslint-disable-line react-hooks/exhaustive-deps

  const stamp = useMemo(
    () => (
      <div
        className="w-full flex justify-center relative absolute origin-bottom pointer-events-none select-none"
        style={{
          bottom: isPc ? stampW * 0.45 : stampW * 0.55,
        }}
      >
        <div
          className="opacity-[80%] [&>svg_*]:!fill-[#9F5C00]  
              w-[30%] sm:w-1/3 aspect-[2/1.1] overflow-hidden"
          ref={stampRef}
        >
          {isPc ? (
            <StampIcon className="z-100" />
          ) : (
            <StampIcon2 className="z-100" />
          )}
        </div>
      </div>
    ),
    [isPc, stampW],
  );

  if (pageNo !== profilePage.start) return <></>;

  return (
    <>
      {process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true" ? (
        <>{debugDiscordButtonMode.current === "STAMP" && <>{stamp}</>}</>
      ) : (
        <>{displayMode.current === "STAMP" && <>{stamp}</>}</>
      )}
    </>
  );
};

export default SuccessDiscordStamp;
