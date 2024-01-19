import React from 'react';

const Checkbox = ({ id, checked, onChange }) => {
  return (
    <input type="checkbox" id={id} checked={checked} onChange={onChange} />
  );
};

export default Checkbox;