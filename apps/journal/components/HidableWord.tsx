import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useToggle } from "react-use";

type Props = {
  text: string;
};

/**
 * 隠ぺい可能なテキストを生成するコンポーネント
 * 隠ぺい時はテキストは「*」になる。
 * 右側には隠ぺいを切り替えるアイコンが表示される。
 * @param param0
 * @returns
 */
const HidableText: React.FC<Props> = ({ text }) => {
  const [isHidden, toggleHidden] = useToggle(true);

  return (
    <>
      {isHidden ? "*".repeat(text.length) : text}
      <button onClick={toggleHidden} className="ml-1">
        <FontAwesomeIcon
          icon={isHidden ? faEyeSlash : faEye}
          className="sm:w-8"
        />
      </button>
    </>
  );
};

export default HidableText;
