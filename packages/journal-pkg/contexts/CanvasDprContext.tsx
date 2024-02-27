import React, {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useState,
  useMemo,
  useContext,
} from "react";

type CanvasDprContextType = {
  dpr: number;
  setDpr: Dispatch<SetStateAction<number>>;
  isAutoAdjustMode: boolean;
  setIsAutoAdjustMode: Dispatch<SetStateAction<boolean>>;
  monitorFactor: number;
  setMonitorFactor: Dispatch<SetStateAction<number>>;
};

// CanvasのDPRを管理するContext
const CanvasDprContext = createContext<CanvasDprContextType>(
  {} as CanvasDprContextType
);

type Props = {
  children: ReactNode;
};

/**
 * CanvasのDPRを管理するContext Provider
 * @param param0
 * @returns
 */
export const CanvasDprProvider: React.FC<Props> = ({ children }) => {
  const [dpr, setDpr] = useState<number>(1);
  const [isAutoAdjustMode, setIsAutoAdjustMode] = useState<boolean>(false);
  const [monitorFactor, setMonitorFactor] = useState<number>(1);

  const canvasDprContextValue = useMemo<CanvasDprContextType>(
    () => ({
      dpr,
      setDpr,
      isAutoAdjustMode,
      setIsAutoAdjustMode,
      monitorFactor,
      setMonitorFactor,
    }),
    [
      dpr,
      setDpr,
      isAutoAdjustMode,
      setIsAutoAdjustMode,
      monitorFactor,
      setMonitorFactor,
    ]
  );

  return (
    <CanvasDprContext.Provider value={canvasDprContextValue}>
      {children}
    </CanvasDprContext.Provider>
  );
};

export const useCanvasDprContext = () => useContext(CanvasDprContext);
