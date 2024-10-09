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

  const updateSelectedItemPosition = () => {
    if (!!switchItemRef?.current[value]) {
      const currentElement = switchItemRef.current[value];
      setSelectedItemStyle({
        left: currentElement.offsetLeft + "px",
        top: currentElement.offsetTop + "px",
        width: currentElement.clientWidth + "px",
        height: currentElement.clientHeight + "px",
      });
    }
  };

  useEffect(() => {
    updateSelectedItemPosition();
    const handleResize = () => {
      updateSelectedItemPosition();
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
        className="selected-item absolute bg-blue-500 transition-all duration-200 ease-in-out"
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
