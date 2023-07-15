type Props = {
  children: React.ReactNode;
};

/**
 * メニュー系のボタンを配置するコンポーネント
 * @param param0
 * @returns
 */
export const MenuButtonLayout: React.FC<Props> = ({ children }) => {
  return <div className={`absolute top-4 right-4`}>{children}</div>;
};
