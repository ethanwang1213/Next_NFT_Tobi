import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export function withTranslations(namespaces: string[] = ["common"]) {
  return async function getStaticProps({ locale }: { locale: string }) {
    try {
      const translations = await serverSideTranslations(locale, namespaces);
      return {
        props: {
          ...translations,
        },
      };
    } catch (error) {
      console.error("Error loading translations:", error);
      return {
        props: {
          translations: {},
        },
      };
    }
  };
}
