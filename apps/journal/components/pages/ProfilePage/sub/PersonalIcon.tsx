import Image from "next/image";
import DefaultIcon from "../../../../public/images/icon/Profiledefault_journal.svg";
import { useHoldNFTs } from "@/contexts/HoldNFTsProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useState } from "react";
import { HouseBadgeNFTData } from "@/types/type";
import { HOUSE_BADGE_NFT_ID } from "@/libs/constants";

/**
 * プロフィールのアイコンのコンポーネント
 * 所属のハウスバッジのNFTを持っていれば右下に表示する
 * @param param0
 * @returns
 */
const PersonalIcon: React.FC = () => {
  const { user } = useAuth();
  const { otherNFTs } = useHoldNFTs();
  const [badgeSrc, setBadgeSrc] = useState<string>("");

  useEffect(() => {
    if (!user || !otherNFTs) return;
    if (otherNFTs.current.length === 0) return;

    // 所属のハウスバッジのNFTのidを探索
    const id = otherNFTs.current.findIndex(
      (nft) =>
        nft.collectionId === HOUSE_BADGE_NFT_ID &&
        "house_type" in nft &&
        user.community &&
        user.community.house &&
        nft.house_type === user.community.house.type
    );

    // 所属のハウスバッジが存在すればurlをセット
    if (id > -1) {
      const houseBadge = otherNFTs.current[id] as HouseBadgeNFTData;
      setBadgeSrc(houseBadge.thumbnail);
    }
  }, [user, otherNFTs]);

  return (
    <div className="w-full aspect-square mr-4 sm:mr-0">
      <div className="relative h-full">
        <div className="relative h-full rounded-full bg-white border-white border-[10px] overflow-hidden">
          <label htmlFor="edit-profile-modal" className="cursor-pointer">
            {!user || user.icon === "" ? (
              <DefaultIcon />
            ) : (
              <Image src={user.icon} alt="profile image" fill />
            )}
          </label>
        </div>
        {badgeSrc !== "" && (
          <div className="absolute -bottom-1 right-0 w-[30%] aspect-square rounded-full bg-white border-white">
            <Image src={badgeSrc} alt="badge" fill />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalIcon;
