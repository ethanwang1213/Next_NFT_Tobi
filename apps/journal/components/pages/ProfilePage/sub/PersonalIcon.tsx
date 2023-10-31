import Image from "next/image";
import DefaultIcon from "../../../../public/images/icon/Profiledefault_journal.svg";
import { useHoldNfts } from "@/contexts/journal-HoldNftsProvider";
import { useAuth } from "contexts/journal-AuthProvider";
import { useEffect, useState } from "react";
import { HouseBadgeNftData } from "types/journal-types";
import { useDiscordOAuth } from "@/contexts/journal-DiscordOAuthProvider";

/**
 * プロフィールのアイコンのコンポーネント
 * 所属のハウスバッジのNFTを持っていれば右下に表示する
 * @param param0
 * @returns
 */
const PersonalIcon: React.FC = () => {
  const { user } = useAuth();
  const { houseData } = useDiscordOAuth();
  const { otherNfts } = useHoldNfts();

  const [badgeSrc, setBadgeSrc] = useState<string>("");

  useEffect(() => {
    if (!houseData || !otherNfts) return;
    if (otherNfts.current.length === 0) return;

    // 所属のハウスバッジのNFTのidを探索
    const id = otherNfts.current.findIndex(
      (nft) =>
        nft.collectionId ===
          process.env["NEXT_PUBLIC_HOUSE_BADGE_NFT_ADDRESS"] &&
        "house_type" in nft &&
        houseData &&
        (nft.house_type === houseData.type ||
          // NFTのスペルミスへの対応用
          // TODO:NFTのスペルが修正されたら削除する
          (nft.house_type === "arismos" && houseData.type === "arithmos"))
    );

    // 所属のハウスバッジが存在すればurlをセット
    if (id > -1) {
      const houseBadge = otherNfts.current[id] as HouseBadgeNftData;
      setBadgeSrc(houseBadge.thumbnail);
    }
  }, [houseData, otherNfts]);

  return (
    <div className="w-full aspect-square mr-4 sm:mr-0">
      <div className="relative h-full">
        <div className="relative h-full rounded-full bg-white border-white border-[10px] overflow-hidden">
          <label
            htmlFor={`${
              !user || !user.email ? "login-guide-modal" : "edit-profile-modal"
            }`}
            className="cursor-pointer"
          >
            {!user || user.icon === "" ? (
              <DefaultIcon />
            ) : (
              <Image src={user.icon} alt="profile image" fill />
            )}
          </label>
        </div>
        {badgeSrc !== "" && (
          <div className="absolute -bottom-2 -right-2 w-1/3 aspect-square">
            <Image src={badgeSrc} alt="badge" fill />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalIcon;
