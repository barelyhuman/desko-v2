import React from "react";
import ReactDOM from "react-dom";
import CardContainer from "./modules/card-container.js";
import ProgressModal from "./modules/progress-modal.js";

var cardData = require(".././cards.json");

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      progress: "searching",
      percent: "0"
    };
    this.modalStateHandler = this.modalStateHandler.bind(this);
  }

  modalStateHandler(state, pro, per) {
    this.setState({
      modal: state,
      progress: pro,
      percent: per
    });
    console.log(this.state);
  }

  render() {
    let modal = this.state.modal
      ? <ProgressModal
          action={this.modalStateHandler}
          state={this.state.progress}
          percent={this.state.percent}
        />
      : null;
    return (
      <div>
        <CardContainer
          cards={cardData}
          modalStateHandler={this.modalStateHandler}
        />
        {modal}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
