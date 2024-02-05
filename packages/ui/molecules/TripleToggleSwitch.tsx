import { memo, useEffect, useState } from "react";

const TripleToggleSwitch = ({ labels, initPosition, toggleSwitchHandler }) => {
  const [switchPosition, setSwitchPosition] = useState(initPosition);
  const [animation, setAnimation] = useState("");
  const [positions, setPositions] = useState(["left"]);

  const getSwitchAnimation = (value) => {
    let animation = null;
    if (!positions.includes(value)) return;

    if (value === "center" && switchPosition === "left") {
      animation = "left-to-center";
    } else if (value === "right" && switchPosition === "center") {
      animation = "center-to-right";
    } else if (value === "center" && switchPosition === "right") {
      animation = "right-to-center";
    } else if (value === "left" && switchPosition === "center") {
      animation = "center-to-left";
    } else if (value === "right" && switchPosition === "left") {
      animation = "left-to-right";
    } else if (value === "left" && switchPosition === "right") {
      animation = "right-to-left";
    }
    setSwitchPosition(value);
    setAnimation(animation);
  };

  useEffect(() => {
    if (initPosition == "center" && positions.length === 1) {
      let oldPositions = positions;
      oldPositions.push("center");
      setPositions(oldPositions);
    }
    if (initPosition == "right" && positions.length === 2) {
      let oldPositions = positions;
      oldPositions.push("right");
      setPositions(oldPositions);
    }
    getSwitchAnimation(initPosition);
  }, [initPosition]);

  const toggleSwitchChanged = (value) => {
    if (!positions.includes(value)) return;
    toggleSwitchHandler(value);
  };

  // console.log(
  //   "switch is rendered, animation:",
  //   animation,
  //   ", switchPosition:",
  //   switchPosition,
  // );

  return (
    <div className="main-container">
      <div className={`switch ${animation} ${switchPosition}-position`}></div>
      <input
        // defaultChecked
        onChange={(e) => toggleSwitchChanged("left")}
        name="map-switch"
        id="left"
        type="radio"
        value="left"
      />
      <label
        className={`left-label ${
          switchPosition === "left" /*&& "black-font"*/
        }`}
        htmlFor="left"
      >
        <h4>{labels.left.title}</h4>
      </label>

      <input
        onChange={(e) => toggleSwitchChanged("center")}
        name="map-switch"
        id="center"
        type="radio"
        value="center"
      />
      <label
        className={`center-label ${
          switchPosition === "center" /* && "black-font"*/
        }`}
        htmlFor="center"
      >
        <h4>{labels.center.title}</h4>
      </label>

      <input
        onChange={(e) => toggleSwitchChanged("right")}
        name="map-switch"
        id="right"
        type="radio"
        value="right"
      />
      <label
        className={`right-label ${
          switchPosition === "right" /*&& "black-font"*/
        }`}
        htmlFor="right"
      >
        <h4>{labels.right.title}</h4>
      </label>
    </div>
  );
};

export default memo(TripleToggleSwitch);
