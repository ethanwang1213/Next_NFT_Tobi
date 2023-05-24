import { useEditProfile } from "@/contexts/EditProfileProvider";
import IconCrop from "./sub/IconCrop";
import { useAuth } from "@/contexts/AuthProvider";
import Jimp from "jimp";
import { error } from "console";
import { Area } from "react-easy-crop";

type Props = {};

/**
 * 選択されたアイコン画像のクロップを行うモーダル。
 * このモーダルは、プロフィール編集モーダル表示中に、
 * さらに上に重なるように表示されることを想定している。
 *
 * @param param0
 * @returns
 */
const CropNewIconModal: React.FC<Props> = ({}) => {
  const auth = useAuth();
  const { isCropModalOpen, iconForCrop, cropData } = useEditProfile();

  // クロップ完了時のコールバック関数
  const cropCallback = (crop: Area) => {
    cropData.set(crop);
    isCropModalOpen.set(false);
  };

  return (
    <>
      {/* DaisyUIのmodalを使用。 */}
      {/* 表示前に選択画像のURL生成などを行うため、変数で表示を管理している */}
      <input
        type="checkbox"
        id="sample-modal"
        className="modal-toggle"
        checked={isCropModalOpen.current}
        onChange={() => {}}
      />
      <div className="modal">
        {isCropModalOpen.current && (
          <div className="modal-box max-w-full h-[60dvh]">
            {auth.user && (
              <div className="w-full h-full">
                <IconCrop url={iconForCrop.current} func={cropCallback} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CropNewIconModal;
