import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { useEffect } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { EditProfileValues } from "../EditProfileModal";

type Props = {
  register: UseFormRegister<EditProfileValues>;
  setValue: UseFormSetValue<EditProfileValues>;
  errors: FieldErrors<EditProfileValues>;
  isModalOpen: boolean;
};

const NameInput: React.FC<Props> = ({
  register,
  setValue,
  errors,
  isModalOpen,
}) => {
  const { user, MAX_NAME_LENGTH } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (!isModalOpen) return;
    setValue("newName", user.name);
  }, [user, isModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <input
        type="text"
        className="input input-accent"
        {...register("newName", {
          maxLength: {
            value: MAX_NAME_LENGTH,
            message: `${MAX_NAME_LENGTH}文字以内で入力してください。`,
          },
          pattern: {
            value: /^(?!.*(\\|\/|:|\*|\?|"|<|>|\|)).*$/,
            message: '\\ / : * ? " < > | は使用できません。',
          },
        })}
      />
      {errors.newName && (
        <label className="label">
          <span className="label-text-alt font-bold text-error">
            {errors.newName.message}
          </span>
        </label>
      )}
    </>
  );
};

export default NameInput;
