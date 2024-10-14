import React from "react";
import _ from "lodash";
import { TextEdit, TextFilter, TextTable } from "./components";

const Text = ({
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
        <TextEdit
          id={id}
          schema={schema}
          required={required}
          onChange={onChange}
          props={props}
          value={value}
        />
      ) : null}

      {type === "filter" ? (
        <TextFilter value={value} onChange={onChange} />
      ) : null}

      {type === "table" && value ? (
        <TextTable onClick={onClick} value={value} {...props} />
      ) : null}
    </>
  );
};

export default Text;
