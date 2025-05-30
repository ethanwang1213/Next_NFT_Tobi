type Props = {
  label: string;
};

/**
 * プロフィールページのボタン
 * 今後の実装に使用する予定あり
 * 2023/05/04現在は未使用
 * @param param0
 * @returns
 */
const NavButton: React.FC<Props> = ({ label }) => {
  return (
    <div className="text-center">
      <button className="w-12 aspect-square rounded-xl bg-brown">ボタン</button>
      <p className="flex justify-center text-xs font-bold text-brown">
        {label}
      </p>
    </div>
  );
};

export default NavButton;
