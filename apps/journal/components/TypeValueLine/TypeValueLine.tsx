import { useMemo, useState } from "react";
import styles from "./TypeValueLine.module.scss";
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
  const lineClass: LineClass = useMemo(() => {
    switch (styleMode) {
      case "PROFILE_ATTRIBUTE":
        return {
          container: "attrContainer",
          type: "attrType",
          value: "attrValue",
        };
      case "ACTIVITY_RECORD":
        return {
          container: "recordContainer",
          type: "recordType",
          value: "recordValue",
        };
      case "REDEEM_DATA":
        return {
          container: "redeemContainer",
          type: "redeemType",
          value: "redeemValue",
        };
    }
  }, [styleMode]);

  const [hidableValue, setHideableValue] = useState<string>(lineValue);
  const [isHidden, setIsHidden] = useState<boolean>(false);

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
    <div className={styles[lineClass.container]}>
      <p className={styles[lineClass.type]}>{lineType}</p>
      {hidable ? (
        <div className={styles[lineClass.value]}>
          <div className={styles.hidable}>
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
        <p className={styles[lineClass.value]}>{lineValue}</p>
      )}
    </div>
  );
};

export default TypeValueLine;
