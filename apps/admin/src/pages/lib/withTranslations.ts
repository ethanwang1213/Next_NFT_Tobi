import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export function withTranslations(namespaces: string[] = ["common"]) {
  return async function getStaticProps({ locale }: { locale: string }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, namespaces)),
      },
    };
  };
}
