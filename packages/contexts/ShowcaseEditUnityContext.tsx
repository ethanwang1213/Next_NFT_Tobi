import { ItemTransformUpdatePhase } from "types/unityTypes";
import { createContext, useContext } from "react";

interface ShowcaseEditUnityContextType {
  isLoaded: boolean;
  unityProvider: any;
  isUndoable: boolean;
  isRedoable: boolean;
  selectedItem: any;
  pauseUnityInputs: () => void;
  resumeUnityInputs: () => void;
  setLoadData: (data: any) => void;
  requestSaveData: () => void;
  placeNewSample: (sampleData: any) => void;
  placeNewNft: (nftData: any) => void;
  placeNewSampleWithDrag: (sampleData: any) => void;
  placeNewNftWithDrag: (nftData: any) => void;
  updateSettings: (settings: any) => void;
  inputWasd: (wasdKeys: any) => void;
  undoAction: () => void;
  redoAction: () => void;
  updateItemTransform: (transformData: {
    positionOnPlane: { x: number; y: number };
    rotationAngle: number;
    scale: number;
    phase: ItemTransformUpdatePhase;
  }) => void;
}

const ShowcaseEditUnityContext = createContext<ShowcaseEditUnityContextType | null>(null);

export const useShowcaseEditUnityContext = () => {
  const context = useContext(ShowcaseEditUnityContext);
  if (!context) {
    throw new Error("useShowcaseEditUnityContext must be used within a ShowcaseEditUnityProvider");
  }
  return context;
};

export default ShowcaseEditUnityContext;
