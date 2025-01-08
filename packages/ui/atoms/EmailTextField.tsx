import { getMessages } from "admin/messages/messages";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import { UseFormRegister } from "react-hook-form/dist/types/form";
import { EMAIL_REGEX } from "types/adminTypes";
import { LoginFormType } from "ui/templates/AuthTemplate";

type Props = {
  placeholder: string;
  className?: string;
  register: UseFormRegister<LoginFormType>;
};

const EmailTextField = ({ placeholder, className, register }: Props) => {
  const t = useTranslations("LogInSignUp");
  return (
    <input
      type="text"
      placeholder={placeholder}
      {...register("email", {
        required: {
          value: true,
          message: t("EnterEmailAddress"),
        },
        pattern: {
          value: EMAIL_REGEX,
          message: t("EnterValidEmail"),
        },
      })}
      className={`input ${className ?? ""}`}
    />
  );
};

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

export default EmailTextField;
