import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = {
  hideText?: boolean;
  onClickBack: () => void;
};

const BackLink = ({ hideText, onClickBack }: Props) => {
  const t = useTranslations("LogInSignUp");
  return (
    <button
      className="btn-link no-underline text-base-content"
      onClick={onClickBack}
    >
      <div className={"flex flex-row mb-[60px]"}>
        <Image
          src={"/admin/images/left-arrow.svg"}
          alt={"back"}
          width={15}
          height={26}
        />
        {!hideText && (
          <div className={"font-medium text-[20px] ml-[10px] text-nowrap"}>
            {t('Back')}
          </div>
        )}
      </div>
    </button>
  );
};

export default BackLink;
