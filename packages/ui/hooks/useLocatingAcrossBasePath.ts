import { useRouter } from "next/router";

/**
 * basePathを考慮したリンク先への遷移
 * @returns
 */
export const useLocatingAcrossBasePath = () => {
  const router = useRouter();

  const pushLocation = async (link: string) => {
    if (!router.basePath) {
      await router.push(link);
    } else {
      console.log(`${window.location.host}${link}`);
      window.location.href = `https://${window.location.host}${link}`;
    }
  };

  return { pushLocation };
};
