import React from "react";
import Button from "./button.js";
import axios from "axios";
import ProgressModal from "./progress-modal.js";
import { checker } from "./installer.js";

export default function Card(props) {
  return (
    <div className="card">
      <div className="card-image">
        <img src={props.cardInfo.icon} />
      </div>
      <div className="card-info">
        <div className="card-title">{props.cardInfo.label}</div>
        <div className="card-desc" />
      </div>
      <Button
        label="Install"
        // action={() => props.modalStateHandler(true, "installing")}
        action={() => checker(props.cardInfo, props.modalStateHandler)}
      />
    </div>
  );
}
