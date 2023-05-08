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
  const [isHidden, setIsHidden] = useState<boolean>(false);

  useEffect(() => {
    if (isHidden) {
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
      <p
        className={`min-w-[60%] text-sm sm:text-base font-bold ${classNames.type}`}
      >
        {lineType}
      </p>
      {hidable ? (
        <div
          className={`grow max-w-[40%] text-end text-sm sm:text-base font-bold ${classNames.value}`}
        >
          <div className="flex justify-end gap-1">
            <p>{hidableValue}</p>
            <button onClick={isHidden ? showValue : hideValue}>
              <FontAwesomeIcon
                icon={isHidden ? faEyeSlash : faEye}
                className="w-6"
              />
            </button>
          </div>
        </div>
      ) : (
        <p
          className={`grow max-w-[40%] text-end text-sm sm:text-base font-bold ${classNames.value}`}
        >
          {lineValue}
        </p>
      )}
    </div>
  );
};

export default TypeValueLine;
