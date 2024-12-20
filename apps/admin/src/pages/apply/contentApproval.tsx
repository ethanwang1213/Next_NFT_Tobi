import { auth, db } from "fetchers/firebase/client";
import useAccountRedirect from "hooks/useAccountRedirect";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`admin/messages/${locale}.json`)).default,
    },
  };
}

const ContentApproval = () => {
  const t = useTranslations("ContentReview");
  useAccountRedirect(auth, db);

  return (
    <div className="mt-10 px-20">
      <div className="py-9 px-8 bg-primary mx-auto rounded-2xl font-sans">
        <div className="text-white border-l-4 border-white pl-4">
          <p className="text-2xl font-semibold">{t("UnderReview")}</p>
          <p className="text-sm my-6 font-medium">
            {t("ReviewMessage")}
            <br />
            {t("AdditionalDocuments")}
          </p>
          <Link href="mailto:TCP-support@tobiratory.com" className="pt-6">
            <span className="underline font-semibold">{t("ForInquiries")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContentApproval;
