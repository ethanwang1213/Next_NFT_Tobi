import { useCallback } from "react";

import { useRouter } from "next/router";

export const useHandleIntMaxActionHistory = () => {
  const router = useRouter();

  const handleIntMaxActionHistory = useCallback(() => {
    router.reload();
  }, [router]);

  return { handleIntMaxActionHistory };
};
