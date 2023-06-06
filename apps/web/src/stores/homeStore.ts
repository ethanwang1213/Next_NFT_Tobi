import { RefObject, useCallback, useMemo } from "react";
import { create } from "zustand";

type HomePhase =
  | "TITLE"
  | "TITLE_TO_GOODS"
  | "DIGITAL_GOODS"
  | "GOODS_TO_FAMI"
  | "FAMI"
  | "FAMI_TO_ENJOY"
  | "ENJOYMENT"
  | "ENJOY_TO_FREE"
  | "FREEDOM"
  | "FREE_TO_ECO"
  | "ECO_FRIENDRY"
  | "ECO_TO_END"
  | "END";

const PHASE_ARR: HomePhase[] = [
  "TITLE",
  "TITLE_TO_GOODS",
  "DIGITAL_GOODS",
  "GOODS_TO_FAMI",
  "FAMI",
  "FAMI_TO_ENJOY",
  "ENJOYMENT",
  "ENJOY_TO_FREE",
  "FREEDOM",
  "FREE_TO_ECO",
  "ECO_FRIENDRY",
  "ECO_TO_END",
  "END",
];

export const isAnimationPhase = (phase: HomePhase) =>
  phase === "TITLE_TO_GOODS" ||
  phase === "GOODS_TO_FAMI" ||
  phase === "FAMI_TO_ENJOY" ||
  phase === "ENJOY_TO_FREE" ||
  phase === "FREE_TO_ECO" ||
  phase === "ECO_TO_END";

type HomeState = {
  // ホームアニメーションのフェーズ
  homePhase: HomePhase;
  // 進退を判定するための前のフェーズ
  pPhase: HomePhase;

  // フェーズを前後できるかどうかのフラグ
  canProgress: boolean;
  setCanProgress: (b: boolean) => void;

  canInteract: boolean;
  setCanInteract: (b: boolean) => void;

  // フェーズの初期化
  // initPhase: (hash: string) => void;
  isInit: boolean;
  setIsInit: (b: boolean) => void;
  initPhase: (p: HomePhase) => void;
  // フェーズの前進
  progressPhase: () => boolean;
  // フェーズの後退
  backPhase: () => boolean;

  getPhaseArr: () => HomePhase[];
  getPhaseIndex: (p: string) => number;

  // end video
  endVideoRef: RefObject<HTMLVideoElement> | null;
  setEndVideoRef: (ref: RefObject<HTMLVideoElement>) => void;
  initStates: () => void;

  debugMode: boolean;
};

const useHomeStore = create<HomeState>((set) => ({
  // ホームアニメーションのフェーズ
  homePhase: "TITLE",
  // 進退を判定するための前のフェーズ
  pPhase: "TITLE",
  // フェーズを前後できるかどうかのフラグ
  canProgress: false,
  setCanProgress: (b) => set((state) => ({ canProgress: b })),

  canInteract: false,
  setCanInteract: (b) => set((state) => ({ canInteract: b })),

  // フェーズの初期化
  isInit: false,
  setIsInit: (b) => set((state) => ({ isInit: b })),
  initPhase: (p) =>
    set((state) => {
      const currentIndex = PHASE_ARR.indexOf(state.homePhase);
      const pIndex = currentIndex === 0 ? 0 : currentIndex - 1;
      return state.isInit
        ? {}
        : { homePhase: p, pPhase: PHASE_ARR[pIndex], canInteract: false };
    }),

  // フェーズの前進
  progressPhase: () => {
    let progressResult = false;

    set((state) => {
      if (!state.canProgress) return {};
      // 一番最後のENDなら後退不可（元々ENDはスクロール不可ではある）
      const currentIndex = PHASE_ARR.indexOf(state.homePhase);
      const lastIndex = PHASE_ARR.length - 1;
      if (currentIndex === lastIndex) {
        return { phase: PHASE_ARR[lastIndex], pPhase: PHASE_ARR[lastIndex] };
      }
      // 前進する
      progressResult = true;

      return {
        homePhase: PHASE_ARR[currentIndex + 1],
        pPhase: state.homePhase,
        canProgress: false,
        canInteract: false,
      };
    });

    return progressResult;
  },

  // フェーズの後退
  backPhase: () => {
    let backResult = false;

    set((state) => {
      if (!state.canProgress) return {};
      // 一番最初のTITLEなら後退不可
      const currentIndex = PHASE_ARR.indexOf(state.homePhase);
      if (currentIndex === 0) {
        return { phase: PHASE_ARR[0], pPhase: PHASE_ARR[0] };
      }
      // 後退する
      backResult = true;
      return {
        homePhase: PHASE_ARR[currentIndex - 1],
        pPhase: state.homePhase,
        canProgress: false,
        canInteract: false,
      };
    });

    return backResult;
  },

  getPhaseArr: () => [...PHASE_ARR],
  getPhaseIndex: (p) => PHASE_ARR.indexOf(p as HomePhase),

  endVideoRef: null,
  setEndVideoRef: (ref) =>
    set((state) => ({
      endVideoRef: ref,
    })),
  initStates: () =>
    set((state) => ({
      homePhase: "TITLE",
      canProgress: state.pPhase === "TITLE" ? true : false,
      endVideoRef: null,
    })),

  debugMode: false,
}));

export default useHomeStore;
