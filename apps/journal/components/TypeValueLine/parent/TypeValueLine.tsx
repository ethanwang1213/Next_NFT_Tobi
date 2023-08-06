import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

type Props = {
  lineType: string;
  lineValue: string;
  hidable?: boolean;
  classNames: {
    container: string;
    type: string;
    value: string;
  };
};

/**
 * タイプと値を一行で表示するコンポーネント
 * hidableがtrueの場合、値を隠すことができる
 * @param param0
 * @returns
 */
const TypeValueLine: React.FC<Props> = ({
  lineType,
  lineValue,
  hidable = false,
  classNames,
}) => {
  const [hidableValue, setHideableValue] = useState<string>(lineValue);
  const [isHidden, setIsHidden] = useState<boolean>(true);

  // 表示データの更新処理
  useEffect(() => {
    if (isHidden) {
      // 隠すボタンが押されている場合、値を隠した状態で更新
      hideValue();
    } else {
      setHideableValue(lineValue);
    }
  }, [lineValue]);

  // hidableValueに、lineValueを*で隠した文字列をセットする
  const hideValue = () => {
    let hiddenValue = "";
    for (let i = 0; i < lineValue.length; i++) {
      hiddenValue += "*";
    }
    setHideableValue(hiddenValue);
    setIsHidden(true);
  };

  // hidableValueに、lineValueをセットする
  const showValue = () => {
    setHideableValue(lineValue);
    setIsHidden(false);
  };

  return (
    <div className={`w-full flex ${classNames.container}`}>
      <p className={`grow min-w-3/5 ${classNames.type}`}>{lineType}</p>
      <div className={`grow max-w-2/5 text-end ${classNames.value}`}>
        {hidable ? (
          <div className="flex justify-end gap-1">
            <p>{hidableValue}</p>
            <button onClick={isHidden ? showValue : hideValue}>
              <FontAwesomeIcon
                icon={isHidden ? faEyeSlash : faEye}
                className="sm:w-8"
              />
            </button>
          </div>
        ) : (
          <p>{lineValue}</p>
        )}
      </div>
    </div>
  );
};

export default TypeValueLine;
