import React from 'react';

function Field(props) {
  const {
    name,
    dispatchFocus,
    dispatchBlur,
    dispatchChange,
    value,
    label,
    type,
    error,
    helperText,
  } = props;

  return (
    <div>
      <label>
        {label}
        <input
          type={type}
          name={name}
          onChange={dispatchChange}
          onFocus={dispatchFocus}
          onBlur={dispatchBlur}
          value={value}
        />
      </label>
      {error ? <span>{helperText}</span> : null}
    </div>
  );
}

export default Field;
