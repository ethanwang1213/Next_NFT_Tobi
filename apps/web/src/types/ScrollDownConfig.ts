/**
 * homeのscroll downアイコン表示のアニメーション設定の型
 */
export type ScrollDownConfig = {
  enter: {
    delay: number;
    config: {
      duration: number;
      easing: (t: number) => number;
    };
    immediate: boolean;
  };
  leave: {
    config: {
      duration: number;
    };
    immediate: boolean;
  };
};