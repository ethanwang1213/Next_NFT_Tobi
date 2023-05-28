import { DirectControlType } from "@/types/gestureType";
import { createContext, useRef, useMemo, ReactNode } from "react";
import { Group } from "three";

export const DirectControlContext = createContext<DirectControlType>(
  {} as DirectControlType
)

type Props = {
  controls: DirectControlType;
  children: ReactNode;
};

export const DirectControlProvider: React.FC<Props> = ({ controls, children }) => {
  const directControlContextValue = useMemo(
    () => ({
      ...controls
    }), [controls.handleDirectMoveDown, controls.handleDirectScaleDown, controls.scalePointerTargetRef]);

  return (
    <DirectControlContext.Provider value={directControlContextValue}>
      {children}
    </DirectControlContext.Provider>
  )
}
