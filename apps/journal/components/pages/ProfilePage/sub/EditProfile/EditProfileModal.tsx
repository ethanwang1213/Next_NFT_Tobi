import { useBookContext } from "@/contexts/journal-BookProvider";
import { useEditProfile } from "@/contexts/journal-EditProfileProvider";
import useUpdateProfile from "@/hooks/useUpdateProfile";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import BirthdaySelect from "./sub/BirthdaySelect";
import CloseModalButton from "./sub/CloseModalButton/CloseModalButton";
import IconSelect from "./sub/IconSelect";
import NameInput from "./sub/NameInput";

export type EditProfileValues = {
  iconUrl: string;
  newName: string;
  year: number;
  month: number;
  day: number;
};

/**
 * プロフィール編集モーダル
 *
 * @returns
 */
const EditProfileModal: React.FC = () => {
  const { pages, pageNo, bookIndex } = useBookContext();
  const { updateProfile } = useUpdateProfile();
  const {
    register,
    getValues,
    watch,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<EditProfileValues>({
    mode: "onChange",
    defaultValues: {
      iconUrl: "",
      year: 0,
      month: 0,
      day: 0,
    },
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { cropData } = useEditProfile();

  // 保存処理
  const onSubmit = async () => {
    updateProfile(getValues());
    cropData.set(null);
    setIsModalOpen(false);
  };

  // モーダルが開かれたときにユーザー情報を取得する
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setIsModalOpen(ev.currentTarget.checked);
    if (ev.currentTarget.checked) {
      trigger();
    }
  };

  const isProfilePage0 = useMemo(
    () =>
      pages.current.length > 0 &&
      pageNo.current === bookIndex.profilePage.start,
    [pages.current, pageNo.current, bookIndex.profilePage.start],
  );

  if (!isProfilePage0) {
    return <></>;
  }

  return (
    <>
      {/* DaisyUIのmodalを使用 */}
      <input
        type="checkbox"
        id="edit-profile-modal"
        className="modal-toggle"
        checked={isModalOpen}
        onChange={handleChange}
      />
      <div className="modal backdrop-blur-[16.35px]">
        <div className="modal-box text-accent">
          <>
            <CloseModalButton
              className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2 text-accent"
              modalId="edit-profile-modal"
            >
              <FontAwesomeIcon icon={faXmark} fontSize={24} />
            </CloseModalButton>
            <h3 className="font-bold text-lg text-text-1000">
              プロフィールの編集
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="form-control">
              {/* ユーザーアイコン */}
              <p className="py-4 font-bold">Icon</p>
              <IconSelect
                register={register}
                getValues={getValues}
                watch={watch}
                setValue={setValue}
                isModalOpen={isModalOpen}
              />
              {/* ユーザー名 */}
              <p className="py-4 font-bold">Name</p>
              <NameInput
                register={register}
                setValue={setValue}
                errors={errors}
                isModalOpen={isModalOpen}
              />
              {/* 誕生日 */}
              <p className="pt-4 pb-2 font-bold">Birthday</p>
              <div>
                <BirthdaySelect
                  register={register}
                  getValues={getValues}
                  watch={watch}
                  setValue={setValue}
                  isModalOpen={isModalOpen}
                />
              </div>
              <div className="modal-action">
                <CloseModalButton
                  className="btn btn-ghost"
                  modalId="edit-profile-modal"
                >
                  キャンセル
                </CloseModalButton>
                <button
                  type="submit"
                  className="btn btn-accent"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  完了
                </button>
              </div>
            </form>
          </>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
