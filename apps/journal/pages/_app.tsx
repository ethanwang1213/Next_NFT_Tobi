import type { AppProps } from "next/app";
import "../styles/global.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ReactNode, createContext, useMemo, useState } from "react";
import { bookContext, tagType } from "../types/type";
import TestPage from "../components/TestComponent";
config.autoAddCss = false;

export const BookContext = createContext<bookContext>(null);

const App = ({ Component, pageProps }: AppProps) => {
  const [pageNo, setPageNo] = useState<number>(0);
  const [pages, setPages] = useState<ReactNode[]>([
    <TestPage key={0} color="red" />,
    <TestPage key={1} color="blue" />,
    <TestPage key={2} color="pink" />,
    <TestPage key={3} color="green" />,
    <TestPage key={4} color="purple" />,
    <TestPage key={5} color="black" />,
    <TestPage key={6} color="gray" />,
  ]);
  const [tags, setTags] = useState<tagType[]>([
    { image: "/images/icon/Profile_journal.svg", page: 0 },
    { image: "/images/icon/Serial_journal.svg", page: 2 },
  ]);

  const pageContextValue = useMemo(
    () => ({
      pageNo: {
        current: pageNo,
        set: setPageNo,
      },
      pages: {
        current: pages,
        set: setPages,
      },
      tags: {
        current: tags,
        set: setTags,
      },
    }),
    [pageNo, pages, tags, setPageNo, setPages, setTags]
  );

  return (
    <BookContext.Provider value={pageContextValue}>
      <Component {...pageProps} />
    </BookContext.Provider>
  );
};

export default App;
