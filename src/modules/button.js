import React from "react";

export default function Button(props) {
  return (
    <div className="button" onClick={props.action}>
      {props.label}
    </div>
  );
}
