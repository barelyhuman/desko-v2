import React from "react";

export default function ProgressModal(props) {
  var progress;
  return (
    <div className="modal">
      <div className="modal-title">
        {props.state + "-" + props.percent + "%"}
      </div>
      <div className="progress-bar" style={{ width: props.percent + "%" }} />
      <div
        onClick={() => {
          cancel(props.action);
        }}
        className="button"
        style={{ alignSelf: "center", margin: 1 + "em" }}
      >
        Cancel
      </div>
    </div>
  );
}

function cancel(stateChanger) {
  console.log("cancelling");
  window.location.reload();
  stateChanger(false);
}
