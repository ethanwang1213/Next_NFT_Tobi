import { useEditProfile } from "@/contexts/journal-EditProfileProvider";
import IconCrop from "./sub/IconCrop";
import { Area } from "react-easy-crop";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useMemo } from "react";
import { useBookContext } from "@/contexts/journal-BookProvider";

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
  const { pages, pageNo, bookIndex } = useBookContext();
  const { isCropModalOpen, iconForCrop, cropData } = useEditProfile();

  // クロップ完了時のコールバック関数
  const cropCallback = (crop: Area) => {
    cropData.set(crop);
    isCropModalOpen.set(false);
  };

  const isProfilePage0 = useMemo(
    () =>
      pages.current.length > 0 &&
      pageNo.current === bookIndex.profilePage.start,
    [pages.current, pageNo.current]
  );

  if (!isProfilePage0) {
    return <></>;
  }

  return (
    <>
      {/* DaisyUIのmodalを使用。 */}
      {/* 表示前に選択画像のURL生成などを行うため、変数で表示を管理している */}
      <input
        type="checkbox"
        id="crop-modal"
        className="modal-toggle"
        checked={isCropModalOpen.current}
        onChange={() => {}}
      />
      <div className="modal">
        <div className="modal-box max-w-full max-h-full w-full h-full pt-10 pb-8">
          <button
            className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2 text-accent z-10"
            onClick={() => isCropModalOpen.set(false)}
          >
            <FontAwesomeIcon icon={faXmark} fontSize={24} />
          </button>
          {isCropModalOpen.current && (
            <div className="w-full h-full">
              <IconCrop
                url={iconForCrop.current ? iconForCrop.current : ""}
                func={cropCallback}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CropNewIconModal;
