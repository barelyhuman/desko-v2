import React from "react";
import Button from "./button.js";
import axios from "axios";
import ProgressModal from "./progress-modal.js";
import { checker } from "./installer.js";

export default function Card(props) {
  let cardimage = (
    <div className="card-image">
      <img src={props.cardInfo.icon} />
    </div>
  );
  return (
    <div className="card">
      <div className="card-info">
        <div className="card-title">{props.cardInfo.label}</div>
        <div className="card-desc" />
      </div>
      <Button
        disabled={props.disabled}
        label="Install"
        // action={() => props.modalStateHandler(true, "installing")}
        action={() =>
          checker(props.cardInfo, props.modalStateHandler, props.setRequest)}
      />
    </div>
  );
}
