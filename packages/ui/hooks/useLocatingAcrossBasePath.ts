import { useRouter } from "next/router";

/**
 * basePathを考慮したリンク先への遷移
 * @returns
 */
export const useLocatingAcrossBasePath = () => {
  const router = useRouter();

  const pushLocation = async (link: string) => {
    if (!router.basePath) {
      // basePathが""の場合
      await router.push(link);
    } else {
      // basePathが""以外の場合
      if (link.startsWith(router.basePath)) {
        // 遷移先がbasePath以下の階層の場合
        // basePathを除去して遷移
        await router.push(link.replace(router.basePath, ""));
      } else {
        // 遷移先がbasePathより上の階層の場合
        // basePathを超えてrouter.pushできなかったので、window.location.hrefによって遷移
        window.location.href = `https://${window.location.host}${link}`;
      }
    }
  };

  return { pushLocation };
};
