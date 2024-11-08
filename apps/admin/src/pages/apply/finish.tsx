import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import Button from "ui/atoms/Button";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`admin/messages/${locale}.json`)).default,
    },
  };
}

const Finish = () => {
  const router = useRouter();
  const t = useTranslations("WelcomeMessage");
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="w-full h-[202px] bg-warning flex flex-col justify-center text-[48px] text-primary-content text-center font-semibold">
        {t("WelcomeToProgram")}
      </div>
      <div className="w-full mt-[38px] flex flex-col justify-center text-[16px] text-base-200-content text-center font-normal">
        {t("ProgramDescription")}
        <br />
        {t("ContentNotice")}
      </div>
      <div className="flex justify-center">
        <div className="mt-[56px] w-[816px] inline-flex items-start gap-[12px]">
          <div className="w-[331px] h-[474px] flex-shrink-0 rounded-[16px] bg-primary">
            <div className="w-[248px] h-[176px] flex-shrink-0">
              <div className="inline-flex flex-col items-start gap-[24px]">
                <div className="mt-[187px] ml-[42px] text-[18px] text-base-white font-bold leading-[21.6px]">
                  {t("CreateOwnContent")}
                </div>
                <div className="ml-[42px] text-[14px] text-base-white font-light leading-[16.8px]">
                  SAMPLE TEXTSAMPLE TEXTSAMPLE TEXTSAMPLE TEXTSAMPLE TEXTSAMPLE
                  TEXT
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-[12px]">
            <div className="w-[473px] h-[474px] flex flex-col items-start gap-[12px]">
              <Navigation title={"BRANDING"} colorDepth={"thin"}>
                SAMPLE TEXTSAMPLE
                <br />
                TEXTSAMPLE TEXT
              </Navigation>
              <Navigation title={"SHOWCASE"} colorDepth={"middle"}>
                SAMPLE TEXTSAMPLE
                <br />
                TEXTSAMPLE TEXT
              </Navigation>
              <Navigation title={"WORKSPACE"} colorDepth={"thick"}>
                SAMPLE TEXTSAMPLE
                <br />
                TEXTSAMPLE TEXT
              </Navigation>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-[50px]">
        <Button
          className="w-[608px] h-[71px] rounded-[88px] mt-[80px] bg-primary text-[32px] text-center text-primary-content"
          onClick={() => {
            router.push("/items");
          }}
        >
          {t("CreateYourWorld")}
        </Button>
      </div>
    </div>
  );
};

const Navigation = ({
  title,
  colorDepth,
  children,
}: {
  title: string;
  colorDepth: "thin" | "middle" | "thick";
  children: React.ReactNode;
}) => {
  const bgColors = {
    thin: "bg-primary-100",
    middle: "bg-[#D9F1FD]",
    thick: "bg-primary-300",
  };
  return (
    <div
      className={`w-[473px] h-[149px] rounded-[16px] ${bgColors[colorDepth]} flex flex-col items-start gap-[8px] p-[12px]`}
    >
      <div className="flex flex-col items-start gap-[4px]">
        <div className="text-neutral-900">{title}</div>
        <div className="text-[14px] text-secondary font-light">{children}</div>
      </div>
    </div>
  );
};

export default Finish;
