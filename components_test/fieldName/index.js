import React from "react";
import _ from "lodash";
import { fieldNameEdit, fieldNameFilter, fieldNameTable } from "./components";

const fieldName = ({
  id,
  value,
  type = "edit",
  schema,
  required,
  onChange,
  onClick = () => {},
  ...props
}) => {
  return (
    <>
      {type === "edit" ? (
        <fieldNameEdit
          id={id}
          schema={schema}
          required={required}
          onChange={onChange}
          props={props}
          value={value}
        />
      ) : null}

      {type === "filter" ? (
        <fieldNameFilter value={value} onChange={onChange} />
      ) : null}

      {type === "table" && value ? (
        <fieldNameTable onClick={onClick} value={value} {...props} />
      ) : null}
    </>
  );
};
export default fieldName;
