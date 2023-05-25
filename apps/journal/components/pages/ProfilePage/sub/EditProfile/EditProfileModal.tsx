import { useState } from "react";
import CloseModalButton from "./sub/CloseModalButton/CloseModalButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import IconSelect from "./sub/IconSelect";
import BirthdaySelect from "./sub/BirthdaySelect";
import NameInput from "./sub/NameInput";
import { useEditProfile } from "@/contexts/EditProfileProvider";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthProvider";
import { uploadNewIcon, postProfile } from "@/libs/postProfile";
import processNewIcon from "@/libs/processNewIcon";
import Jimp from "jimp";

export type EditProfileValues = {
  iconUrl: string;
  newName: string;
  isBirthdayHidden: boolean;
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
  const { user, updateProfile } = useAuth();

  const {
    register,
    getValues,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileValues>({ mode: "onChange" });
  const { cropData } = useEditProfile();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // モーダルが開かれたときにユーザー情報を取得する
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setIsModalOpen(ev.currentTarget.checked);
  };

  // 保存処理
  const onSubmit = async () => {
    const iconUrl = getValues("iconUrl");
    const newName = getValues("newName");
    const isBirthdayHidden = getValues("isBirthdayHidden");
    const selectedYear = getValues("year");
    const selectedMonth = getValues("month");
    const selectedDay = getValues("day");

    if (!!cropData.current) {
      // アイコン画像に変更があればアップロード
      const scaled = await processNewIcon(iconUrl, cropData.current);
      scaled.getBuffer(Jimp.MIME_PNG, async (err, buf) => {
        await uploadNewIcon(
          user.id,
          new File([buf], "img.png", { type: "image/png" })
        );
      });
      // ローカルのプロフィール情報を更新
      scaled.getBase64(Jimp.MIME_PNG, async (err, src) => {
        updateProfile(src, newName, isBirthdayHidden, {
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay,
        });
      });
    } else {
      // ローカルのプロフィール情報を更新
      updateProfile(iconUrl, newName, isBirthdayHidden, {
        year: selectedYear,
        month: selectedMonth,
        day: selectedDay,
      });
    }

    // データベース上のプロフィール情報を更新
    await postProfile(
      user,
      !!cropData,
      newName,
      isBirthdayHidden,
      selectedYear,
      selectedMonth,
      selectedDay
    );
  };

  return (
    <>
      {/* DaisyUIのmodalを使用 */}
      <input
        type="checkbox"
        id="edit-profile-modal"
        className="modal-toggle"
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
