import { useEffect, useState } from "react";
import CloseModalButton from "./sub/CloseModalButton/CloseModalButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import IconSelect from "./sub/IconSelect";
import BirthdaySelect from "./sub/BirthdaySelect";
import NameInput from "./sub/NameInput";
import SubmitButton from "./sub/CloseModalButton/SubmitButton";
import { useAuth } from "@/contexts/AuthProvider";
import { useEditProfile } from "@/contexts/EditProfileProvider";

const EditProfileModal: React.FC = () => {
  const auth = useAuth();
  const { isEditModalOpen } = useEditProfile();

  const [iconFile, setIconFile] = useState<File>(null);
  const [iconUrl, setIconUrl] = useState<string>(null);

  const [newName, setNewName] = useState<string>("");

  const [isBirthdayHidden, setIsBirthdayHidden] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    if (!auth.user) return;
    if (!isEditModalOpen.current) return;

    setIconUrl(
      auth.user.icon !== "" ? auth.user.icon : "/mocks/images/profile.png"
    );
    setNewName(auth.user.name);
    setIsBirthdayHidden(auth.user.isBirthdayHidden);
    if (auth.user.birthday) {
      setSelectedYear(auth.user.birthday.year);
      setSelectedMonth(auth.user.birthday.month);
      setSelectedDay(auth.user.birthday.day);
    } else {
      setSelectedYear(1);
      setSelectedMonth(1);
      setSelectedDay(1);
    }
  }, [auth.user, isEditModalOpen.current]);

  return (
    <>
      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id="edit-profile-modal"
        className="modal-toggle"
        checked={isEditModalOpen.current}
        onChange={(ev) => {
          isEditModalOpen.set(ev.currentTarget.checked);
        }}
      />
      <div className="modal">
        <div className="modal-box text-accent">
          <CloseModalButton
            className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2 text-accent"
            modalId="edit-profile-modal"
          >
            <FontAwesomeIcon icon={faXmark} fontSize={24} />
          </CloseModalButton>
          <h3 className="font-bold text-lg">プロフィールの編集</h3>
          <p className="py-4">Icon</p>
          <IconSelect
            iconFile={iconFile}
            setIconFile={setIconFile}
            iconUrl={iconUrl}
            setIconUrl={setIconUrl}
          />
          <p className="py-4">Name</p>
          <NameInput newName={newName} setNewName={setNewName} />
          <p className="pt-4 pb-2">Birthday</p>
          <div>
            <BirthdaySelect
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
              iconFile={iconFile}
              iconUrl={iconUrl}
              newName={newName}
              isBirthdayHidden={isBirthdayHidden}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDay={selectedDay}
            >
              完了
            </SubmitButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
