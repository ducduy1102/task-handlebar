import React from 'react';
import _ from 'lodash';
import { ColorEdit, ColorFilter, ColorTable } from './components';

const Color = ({
  id,
  value,
  type = 'edit',
  schema,
  required,
  onChange,
  onClick = () => {},
  ...props
}) => {
  return (
    <>
      {type === 'edit' ? (
        <ColorEdit
          id={id}
          schema={schema}
          required={required}
          onChange={onChange}
          props={props}
          value={value}
        />
      ) : null}

      {type === 'filter' ? (
        <ColorFilter
          value={value}
          onChange={onChange}
        />
      ) : null}

      {type === 'table' && value ? (
        <ColorTable
          onClick={onClick}
          value={value}
          {...props}
        />
      ) : null}
    </>
  );
};
export default Color;
