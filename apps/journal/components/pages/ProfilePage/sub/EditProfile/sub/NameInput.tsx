import { useAuth } from "@/contexts/AuthProvider";
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
  const { user } = useAuth();
  const MAX_NAME_LENGTH = 12;

  useEffect(() => {
    if (!user) return;
    if (!isModalOpen) return;
    setValue("newName", user.name);
  }, [user, isModalOpen]);

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
