import React, { useState } from "react";
import type { SwitchChangeEventHandler } from "rc-switch";
import Switch from "rc-switch";
import "./PublicSwitch.css";

const onChange: SwitchChangeEventHandler = (value, event) => {
  // eslint-disable-next-line no-console
  console.log(`switch checked: ${value}`, event);
};

const PublicSwitch = () => {
  return (
    <div className="text-center">
      <Switch
        onChange={onChange}
        checkedChildren="公開"
        unCheckedChildren="非公開"
      />
    </div>
  );
};

export default PublicSwitch;
