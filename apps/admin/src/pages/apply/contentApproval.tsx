import { auth, db } from "fetchers/firebase/client";
import { doc, getDoc } from "firebase/firestore/lite";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`admin/messages/${locale}.json`)).default,
    },
  };
}

const ContentApproval = () => {
  const t = useTranslations("ContentReview");
  const router = useRouter();
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    let interval;

    const fetchAccountData = async () => {
      if (auth.currentUser && auth.currentUser.uid) {
        const { uid } = auth.currentUser;
        const accountRef = doc(db, `businessAccount/${uid}`);

        try {
          const snapshot = await getDoc(accountRef);
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.cmsApprove) {
              router.push("/items");
            }
          } else {
            console.log("No account data found for this user.");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      }
    };

    fetchAccountData();

    interval = setInterval(fetchAccountData, 5000);

    return () => clearInterval(interval);
  }, [auth.currentUser]);

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
