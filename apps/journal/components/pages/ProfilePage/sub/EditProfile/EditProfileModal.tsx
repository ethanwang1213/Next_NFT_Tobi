import { useState } from "react";
import CloseModalButton from "./sub/CloseModalButton/CloseModalButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import IconSelect from "./sub/IconSelect";
import BirthdaySelect from "./sub/BirthdaySelect";
import NameInput from "./sub/NameInput";
import SubmitButton from "./sub/CloseModalButton/SubmitButton";
import { useEditProfile } from "@/contexts/EditProfileProvider";

/**
 * プロフィール編集モーダル
 *
 * @returns
 */
const EditProfileModal: React.FC = () => {
  const { cropData } = useEditProfile();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // TODO: Contextに全部移動したほうがレンダリングの効率が良さそう
  const [iconUrl, setIconUrl] = useState<string>(null);
  const [newName, setNewName] = useState<string>("");
  const [isBirthdayHidden, setIsBirthdayHidden] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // モーダルが開かれたときにユーザー情報を取得する
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setIsModalOpen(ev.currentTarget.checked);
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
            {/* ユーザーアイコン */}
            <p className="py-4 font-bold">Icon</p>
            <IconSelect
              isModalOpen={isModalOpen}
              iconUrl={iconUrl}
              setIconUrl={setIconUrl}
            />
            {/* ユーザー名 */}
            <p className="py-4 font-bold">Name</p>
            <NameInput
              isModalOpen={isModalOpen}
              newName={newName}
              setNewName={setNewName}
            />
            {/* 誕生日 */}
            <p className="pt-4 pb-2 font-bold">Birthday</p>
            <div>
              <BirthdaySelect
                isModalOpen={isModalOpen}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                isBirthdayHidden={isBirthdayHidden}
                setIsBirthdayHidden={setIsBirthdayHidden}
              />
            </div>
            <div className="modal-action">
              <CloseModalButton
                className="btn btn-ghost"
                modalId="edit-profile-modal"
              >
                キャンセル
              </CloseModalButton>
              <SubmitButton
                className="btn btn-accent"
                modalId="edit-profile-modal"
                iconUrl={iconUrl}
                cropData={cropData.current}
                newName={newName}
                isBirthdayHidden={isBirthdayHidden}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedDay={selectedDay}
              >
                完了
              </SubmitButton>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
