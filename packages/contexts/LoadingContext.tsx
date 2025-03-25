import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type LoadingContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading && progress == 0) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);
    } else if (!loading && progress > 0) {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }

    return () => clearInterval(interval);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <div
        className={`fixed top-0 left-0 h-1 bg-blue-500 transition-all ${
          progress === 0 ? "invisible" : "visible"
        }`}
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: "width 0.3s ease-out, opacity 0.5s ease-out",
        }}
      />
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
