import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

type Props = {
  text: string;
};

/**
 * 隠ぺい可能な文字列を表示するコンポーネント
 * @param param0
 * @returns
 */
const HidableText: React.FC<Props> = ({ text }) => {
  const [hidableText, setHideableText] = useState<string>();
  const [isHidden, setIsHidden] = useState<boolean>(true);

  // 表示データの更新処理
  useEffect(() => {
    if (isHidden) {
      // 隠すボタンが押されている場合、値を隠した状態で更新
      hideText();
    }
  }, []);

  // hidableTextに、Textを*で隠した文字列をセットする
  const hideText = () => {
    let hiddenText = "*".repeat(text.length);
    setHideableText(hiddenText);
    setIsHidden(true);
  };

  // hidableTextに、textをセットする
  const showText = () => {
    setHideableText(text);
    setIsHidden(false);
  };

  return (
    <>
      {hidableText}
      <button onClick={isHidden ? showText : hideText} className="ml-1">
        <FontAwesomeIcon
          icon={isHidden ? faEyeSlash : faEye}
          className="sm:w-8"
        />
      </button>
    </>
  );
};

export default HidableText;
