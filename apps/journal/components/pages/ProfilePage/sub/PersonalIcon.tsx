import Image from "next/image";
import DefaultIcon from "../../../../public/images/icon/Profiledefault_journal.svg";

type Props = {
  profileSrc: string;
  badgeSrc: string;
};

/**
 * プロフィールのアイコンのコンポーネント
 * @param param0
 * @returns
 */
const PersonalIcon: React.FC<Props> = ({ profileSrc, badgeSrc }) => {
  return (
    <div className="w-full aspect-square mr-4 sm:mr-0">
      <div className="relative h-full">
        <div className="relative h-full rounded-full bg-white border-white border-[10px] overflow-hidden">
          <label htmlFor="edit-profile-modal" className="">
            {profileSrc === "" ? (
              <DefaultIcon />
            ) : (
              <Image src={profileSrc} alt="profile image" fill />
            )}
          </label>
        </div>
        <div className="absolute -bottom-1 right-0 w-[30%] aspect-square rounded-full bg-white border-white">
          <Image src={badgeSrc} alt="badge" fill />
        </div>
      </div>
    </div>
  );
};

export default PersonalIcon;
