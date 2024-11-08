import React, { createContext, ReactNode, useContext } from "react";

interface WorkspaceEditUnityProviderProps {
  children: ReactNode;
  unityContext: any;
}
interface WorkspaceEditUnityContextType {
  isLoaded: boolean;
  unityProvider: any;
  isUndoable: boolean;
  isRedoable: boolean;
  selectedSample: any;
  pauseUnityInputs: () => void;
  resumeUnityInputs: () => void;
  setLoadData: (data: any) => void;
  requestSaveData: () => void;
  requestItemThumbnail: (data: any) => void;
  placeNewSample: (sampleData: any) => void;
  removeSamplesByItemId: (itemList: number[]) => void;
  placeNewNft: (nftData: any) => void;
  placeNewSampleWithDrag: (sampleData: any) => void;
  placeNewNftWithDrag: (nftData: any) => void;
  updateSettings: (settings: any) => void;
  inputWasd: (wasdKeys: any) => void;
  undoAction: () => void;
  redoAction: () => void;
  applyAcrylicBaseScaleRatio: (data: any) => void;
  requestNftModelGeneration: (data: any) => Promise<void>;
  deleteAllActionHistory: () => void;
}

const WorkspaceEditUnityContext = createContext<WorkspaceEditUnityContextType>(
  {} as WorkspaceEditUnityContextType,
);

export const WorkspaceEditUnityProvider: React.FC<
  WorkspaceEditUnityProviderProps
> = ({ children, unityContext }) => {
  if (!unityContext) {
    console.error("Unity context is not initialized.");
    return null;
  }

  return (
    <WorkspaceEditUnityContext.Provider value={unityContext}>
      {children}
    </WorkspaceEditUnityContext.Provider>
  );
};

export const useWorkspaceEditUnity = () =>
  useContext(WorkspaceEditUnityContext);
