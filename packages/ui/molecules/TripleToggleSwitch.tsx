import { useEffect, useRef, useState } from "react";

const TripleToggleSwitch = ({ labels, value, onChange }) => {
  const switchItemRef = useRef([]);
  const selectedItemRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedItemStyle, setSelectedItemStyle] = useState({});

  const onClickSwitchItem = (newValue) => {
    if (newValue === value) {
      return;
    }
    onChange(newValue);
  };

  const updateSelectedItemPosition = (animation: boolean) => {
    if (!!switchItemRef?.current[value] || value == 3) {
      const currentElement =
        value === 3
          ? switchItemRef.current[value - 1]
          : switchItemRef.current[value];
      const newStyle = {
        left: currentElement.offsetLeft + "px",
        top: currentElement.offsetTop + "px",
        width: currentElement.clientWidth + "px",
        height: currentElement.clientHeight + "px",
      };
      if (animation) {
        newStyle["transition"] = "all linear .5s";
      }
      setSelectedItemStyle(newStyle);
    }
  };

  useEffect(() => {
    updateSelectedItemPosition(true);
    const handleResize = () => {
      updateSelectedItemPosition(false);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex flex-row switch-pane relative" ref={containerRef}>
      <div
        className="selected-item absolute bg-blue-500"
        ref={selectedItemRef}
        style={selectedItemStyle}
      ></div>
      {labels.map((label, idx) => (
        <div
          key={`toggle-switch-${idx}`}
          className={`switch-item sm:w-36 w-24 text-center sm:text-[16px] text-[12px] cursor-pointer ${
            value === idx ? "font-bold" : ""
          }`}
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
