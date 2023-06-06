import React, { useEffect, useCallback } from "react";

const AllScrollLock = () => {
  /**
   * モバイルスクロール禁止処理
   */
  const scrollNo = useCallback((e: TouchEvent) => {
    e.preventDefault();
  }, []);
  /**
   * イベントリスナーの設定
   */
  useEffect(() => {
    // モバイルスクロール禁止処理
    document.addEventListener("touchmove", scrollNo, { passive: false });

    return () => {
      // イベントの設定解除
      document.removeEventListener("touchmove", scrollNo);
    };
  }, []);

  return <div />;
};

export default React.memo(AllScrollLock);
