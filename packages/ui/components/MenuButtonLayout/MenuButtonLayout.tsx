type Props = {
  children: React.ReactNode;
};

/**
 * メニュー系のボタンを配置するコンポーネント
 * @param param0
 * @returns
 */
export const MenuButtonLayout: React.FC<Props> = ({ children }) => {
  return <div className="absolute top-3 right-1 sm:right-3">{children}</div>;
};
