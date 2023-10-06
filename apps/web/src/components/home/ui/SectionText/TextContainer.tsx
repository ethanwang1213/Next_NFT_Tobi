import { useWindowSize } from "hooks";
import { ReactNode } from "react";

type Props = {
  titleChildren: ReactNode;
  textChildren: ReactNode;
};

/**
 * home セクションのテキストのコンテナ
 * @param param0
 * @returns
 */
const TextContainer: React.FC<Props> = ({ titleChildren, textChildren }) => {
  const { isWide } = useWindowSize();

  return (
    <>
      <div
        className={`${
          isWide
            ? `home-section-title-container`
            : `home-section-title-container-sp`
        }`}
      >
        {titleChildren}
      </div>
      <div
        className={`${
          isWide
            ? `home-section-text-container`
            : `home-section-text-container-sp`
        }`}
      >
        {textChildren}
      </div>
    </>
  );
};

export default TextContainer;
