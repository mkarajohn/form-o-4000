import { STATUSES, useForm } from 'FormO4000';
import React from 'react';
import Field from './Field';

const MemoizedField = React.memo(Field);

function FieldContainer(props) {
  const { name } = props;
  const { getFieldConfiguration, getFieldState, getFieldDispatches } = useForm();
  const { dispatchFocus, dispatchBlur, dispatchChange } = getFieldDispatches(name);
  const { value, status, valid } = getFieldState(name);
  const { label, type, options } = getFieldConfiguration(name);

  const error = status === STATUSES.TOUCHED && valid === false;
  const helperText = error ? (value ? 'Invalid field' : 'The field cannot be empty') : undefined;

  return (
    <MemoizedField
      name={name}
      dispatchFocus={dispatchFocus}
      dispatchBlur={dispatchBlur}
      dispatchChange={dispatchChange}
      value={value}
      label={label}
      type={type}
      options={options}
      error={error}
      helperText={helperText}
    />
  );
}

export default FieldContainer;
