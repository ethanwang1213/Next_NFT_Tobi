import React, { createContext, ReactNode, useContext } from "react";
import { ItemTransformUpdatePhase } from "types/unityTypes";

interface ShowcaseEditUnityProviderProps {
  children: ReactNode;
  unityContext: any;
}
interface ShowcaseEditUnityContextType {
  isSceneOpen: boolean;
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
  undoAction: () => void;
  redoAction: () => void;
  updateItemTransform: (transformData: {
    positionOnPlane: { x: number; y: number };
    rotationAngle: number;
    scale: number;
    phase: ItemTransformUpdatePhase;
  }) => void;
  requestNftModelGeneration: (data: any) => Promise<void>;
  handleMouseUp: () => void;
}

const ShowcaseEditUnityContext = createContext<ShowcaseEditUnityContextType>(
  {} as ShowcaseEditUnityContextType,
);

export const ShowcaseEditUnityProvider: React.FC<
  ShowcaseEditUnityProviderProps
> = ({ children, unityContext }) => {
  if (!unityContext) {
    console.error("Unity context is not initialized.");
    return null;
  }

  return (
    <ShowcaseEditUnityContext.Provider value={unityContext}>
      {children}
    </ShowcaseEditUnityContext.Provider>
  );
};

export const useShowcaseEditUnity = () => useContext(ShowcaseEditUnityContext);
