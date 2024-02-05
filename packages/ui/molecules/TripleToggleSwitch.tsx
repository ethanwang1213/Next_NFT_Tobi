import { useEffect, useRef, useState } from "react";

const TripleToggleSwitch = ({ labels, value, onChange }) => {
  const switchItemRef = useRef([]);
  const selectedItemRef = useRef(null);

  const onClickSwitchItem = (newValue) => {
    if (newValue === value) {
      return;
    }
    onChange(newValue);
  };

  const [selectedItemStyle, setSelectedItemStyle] = useState({});

  useEffect(() => {
    const fnCalcSelectedItemPos = () => {
      if (!!switchItemRef?.current[value]) {
        const currentElement = switchItemRef.current[value];
        setSelectedItemStyle({
          left: currentElement.offsetLeft,
          top: currentElement.offsetTop,
          width: currentElement.clientWidth,
          height: currentElement.clientHeight,
        });
      }
    };
    window.addEventListener("resize", fnCalcSelectedItemPos);
    fnCalcSelectedItemPos();
    return () => window.removeEventListener("resize", fnCalcSelectedItemPos);
  }, [switchItemRef, value]);

  console.log("switch is rendered");

  return (
    <div className="flex flex-row switch-pane">
      <div
        className="selected-item"
        ref={selectedItemRef}
        style={selectedItemStyle ?? {}}
      ></div>
      {labels.map((label, idx) => (
        <div
          key={`toggle-switch-${idx}`}
          className="switch-item w-36 text-center"
          ref={(el) => (switchItemRef.current[idx] = el)}
          onClick={() => onClickSwitchItem(idx)}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default TripleToggleSwitch;
