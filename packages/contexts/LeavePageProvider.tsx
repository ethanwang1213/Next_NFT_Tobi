import { useRouter } from "next/router";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

type ContextType = {
  leavingPage: boolean;
  setLeavingPage: Dispatch<SetStateAction<boolean>>;
};

const LeavePageContext = createContext<ContextType>({} as ContextType);

export const LeavePageProvider: React.FC<Props> = ({ children }) => {
  const [leavingPage, setLeavingPage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (router.asPath !== url) {
        setLeavingPage(true);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  const contextValue = useMemo<ContextType>(
    () => ({
      leavingPage: leavingPage,
      setLeavingPage: setLeavingPage,
    }),
    [leavingPage, setLeavingPage],
  );

  return (
    <LeavePageContext.Provider value={contextValue}>
      {children}
    </LeavePageContext.Provider>
  );
};

export const useLeavePage = () => useContext(LeavePageContext);
