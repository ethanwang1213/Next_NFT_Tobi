import { UseFormRegister } from "react-hook-form/dist/types/form";
import { EMAIL_REGEX } from "types/adminTypes";
import { LoginFormType } from "ui/templates/AuthTemplate";

type Props = {
  placeholder: string;
  className?: string;
  register: UseFormRegister<LoginFormType>;
};

const EmailTextField = ({ placeholder, className, register }: Props) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      {...register("email", {
        required: {
          value: true,
          message: "*メールアドレスを入力してください。",
        },
        pattern: {
          value: EMAIL_REGEX,
          message: "*メールアドレスの形式で入力してください",
        },
      })}
      className={`input ${className ?? ""}`}
    />
  );
};

export default EmailTextField;
