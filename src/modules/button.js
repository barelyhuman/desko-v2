import React from "react";

export default function Button(props) {
  return (
    <div
      style={{ visibility: props.disabled }}
      className="button"
      onClick={props.action}
    >
      {props.label}
    </div>
  );
}
