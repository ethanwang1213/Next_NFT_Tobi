import { useShowcaseEditUnityContext as useCustomUnityContext } from "hooks/useCustomUnityContext";
import React, { createContext, ReactNode, useContext } from "react";
import { ItemTransformUpdatePhase } from "types/unityTypes";

interface ShowcaseEditUnityProviderProps {
  children: ReactNode;
  itemMenuX: number;
  onSaveDataGenerated: (...args: any[]) => void;
  onRemoveItemEnabled: () => void;
  onRemoveItemDisabled: () => void;
  onRemoveItemRequested: (...args: any[]) => void;
  onActionRedone: (...args: any[]) => void;
  onActionUndone: (...args: any[]) => void;
}
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

const ShowcaseEditUnityContext =
  createContext<ShowcaseEditUnityContextType>({} as ShowcaseEditUnityContextType);

export const ShowcaseEditUnityProvider: React.FC<
  ShowcaseEditUnityProviderProps
> = ({
  children,
  itemMenuX,
  onSaveDataGenerated,
  onRemoveItemEnabled,
  onRemoveItemDisabled,
  onRemoveItemRequested,
  onActionRedone,
  onActionUndone,
}) => {
  const unityContext = useCustomUnityContext({
    itemMenuX,
    onSaveDataGenerated,
    onRemoveItemEnabled,
    onRemoveItemDisabled,
    onRemoveItemRequested,
    onActionRedone,
    onActionUndone,
  });

  const {
    isLoaded,
    unityProvider,
    isUndoable,
    isRedoable,
    selectedItem,
    resumeUnityInputs,
    pauseUnityInputs,
    setLoadData,
    requestSaveData,
    placeNewSample,
    placeNewNft,
    placeNewSampleWithDrag,
    placeNewNftWithDrag,
    updateSettings,
    inputWasd,
    undoAction,
    redoAction,
    updateItemTransform,
  } = unityContext;

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
