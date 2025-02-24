import { getMessages } from "admin/messages/messages";
import { checkBusinessAccount } from "fetchers/businessAccount";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const ContentRejected = () => {
  const t = useTranslations("ContentReview");
  const [rejectedContent, setRejectedContent] = useState("");

  useEffect(() => {
    const checkAccount = async () => {
      const rejectedContent = await checkBusinessAccount("rejectedContent");
      setRejectedContent(rejectedContent);
    };

    checkAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-10 px-8 md:px-20 ">
      <div className="py-9 px-8 bg-warning-300 mx-auto rounded-2xl font-sans">
        <div className="text-white border-l-4 border-white pl-4">
          <p className="text-[24px] font-semibold">
            {t("ApplicationReturned")}
          </p>
          <p className="text-sm my-6">
            {t("ReviewProcessIdentified")}
            <br />
            {t("ReviseAndResubmit")}
          </p>
          <p className="text-sm my-6 font-bold">
            {t("Comment")}
            <br />
            {rejectedContent}
          </p>
          <Link href="mailto:TCP-support@tobiratory.com" className="pt-6">
            <span className="underline font-semibold">{t("ForInquiries")}</span>
          </Link>
          <div className="my-6 text-sm text-warning-300 font-semibold">
            <Link
              href="/apply/register"
              className="bg-white rounded-[50px] py-2 px-4"
            >
              {t("EditAndResubmit")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentRejected;
