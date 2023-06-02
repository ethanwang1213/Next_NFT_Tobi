import { useDebug } from "@/contexts/DebugProvider";
import { useDiscordOAuth } from "@/contexts/DiscordOAuthProvider";
import StampIcon from "@/public/images/icon/stamp_TOBIRAPOLIS.svg";
import StampIcon2 from "@/public/images/icon/stamp_TOBIRAPOLIS-cp.svg";
import { useMemo } from "react";

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

  const stamp = useMemo(
    () => (
      <div className="w-full flex justify-center">
        <div
          className="overflow-hidden opacity-[80%] [&>svg_*]:!fill-[#9F5C00]  
              absolute bottom-0 w-2/5 sm:bottom-[-24px] sm:w-1/3 aspect-[2/1.1]"
        >
          {isPc ? (
            <StampIcon className="z-100" />
          ) : (
            <StampIcon2 className="z-100" />
          )}
        </div>
      </div>
    ),
    [isPc]
  );

  return (
    <>
      {process.env.NEXT_PUBLIC_DEBUG_MODE === "true" ? (
        <>{debugDiscordButtonMode.current === "STAMP" && <>{stamp}</>}</>
      ) : (
        <>{displayMode.current === "STAMP" && { stamp }}</>
      )}
    </>
  );
};

export default SuccessDiscordStamp;
