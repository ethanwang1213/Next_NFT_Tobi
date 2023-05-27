import { useState } from "react";
import CloseModalButton from "./sub/CloseModalButton/CloseModalButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import IconSelect from "./sub/IconSelect";
import BirthdaySelect from "./sub/BirthdaySelect";
import NameInput from "./sub/NameInput";
import { useForm } from "react-hook-form";
import useUpdateProfile from "@/hooks/useUpdateProfile";

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
  const { updateProfile } = useUpdateProfile();

  const {
    register,
    getValues,
    watch,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<EditProfileValues>({ mode: "onChange" });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // モーダルが開かれたときにユーザー情報を取得する
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setIsModalOpen(ev.currentTarget.checked);
    if (ev.currentTarget.checked) {
      trigger();
    }
  };

  // 保存処理
  const onSubmit = async () => {
    updateProfile(getValues());
    setIsModalOpen(false);
  };

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
      <div className="modal">
        <div className="modal-box text-accent">
          <>
            <CloseModalButton
              className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2 text-accent"
              modalId="edit-profile-modal"
            >
              <FontAwesomeIcon icon={faXmark} fontSize={24} />
            </CloseModalButton>
            <h3 className="font-bold text-lg">プロフィールの編集</h3>
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
