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
      percent: "0",
      request: null
    };
    this.modalStateHandler = this.modalStateHandler.bind(this);
    this.setRequest = this.setRequest.bind(this);
    this.cancelRequest = this.cancelRequest.bind(this);
  }

  setRequest(req) {
    this.setState({ request: req });
  }

  cancelRequest() {
    var request = this.state.request;
    request.abort();
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
          cancelRequest={this.cancelRequest}
        />
      : null;
    return (
      <div>
        <CardContainer
          disabled={this.state.modal ? "hidden" : "visible"}
          cards={cardData}
          modalStateHandler={this.modalStateHandler}
          setRequest={this.setRequest}
        />
        {modal}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
