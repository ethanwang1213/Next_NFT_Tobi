import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

type Props = {
  lineType: string;
  lineValue: string;
  styleMode: "PROFILE_ATTRIBUTE" | "ACTIVITY_RECORD" | "REDEEM_DATA";
  hidable?: boolean;
};

type LineClass = {
  container: string;
  type: string;
  value: string;
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
  styleMode,
  hidable = false,
}) => {
  // styleModeによって、スタイルを変更する
  const defaultClass: LineClass = {
    container: "w-full flex",
    type: "min-w-[60%] text-sm sm:text-base font-bold",
    value: "grow max-w-[40%] text-end text-sm sm:text-base font-bold",
  };
  const lineClass: LineClass = useMemo(() => {
    switch (styleMode) {
      // case "PROFILE_ATTRIBUTE":
      //   return {
      //     container: `${defaultClass.container}`,
      //     type: `${defaultClass.type}`,
      //     value: `${defaultClass.value}`,
      //   };
      // case "ACTIVITY_RECORD":
      //   return {
      //     container: `${defaultClass.container}`,
      //     type: `${defaultClass.type}`,
      //     value: `${defaultClass.value}`,
      //   };
      case "REDEEM_DATA":
        return {
          container: `${defaultClass.container}`,
          type: `${defaultClass.type} text-xl`,
          value: `${defaultClass.value} text-xl`,
        };
    }
  }, [styleMode]);

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
    <div className={lineClass.container}>
      <p className={lineClass.type}>{lineType}</p>
      {hidable ? (
        <div className={lineClass.value}>
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
        <p className={lineClass.value}>{lineValue}</p>
      )}
    </div>
  );
};

export default TypeValueLine;
