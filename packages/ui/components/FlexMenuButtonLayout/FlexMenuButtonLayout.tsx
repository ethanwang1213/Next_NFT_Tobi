import { MenuButtonLayout } from "../MenuButtonLayout/MenuButtonLayout";

type Props = {
  children: React.ReactNode;
};

/**
 * メニュー系のボタンを横方向に配置するコンポーネント
 * @param param0
 * @returns
 */
export const FlexMenuButtonLayout: React.FC<Props> = ({ children }) => {
  return (
    <MenuButtonLayout>
      <div className="flex flex-row-reverse">{children}</div>
    </MenuButtonLayout>
  );
};
