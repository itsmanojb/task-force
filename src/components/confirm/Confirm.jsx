import React, { Component } from "react";
import { render } from "react-dom";
import "./Confirm.css";

let resolve;
class Confirm extends Component {
  constructor() {
    super();

    this.state = {
      isOpen: false,
      title: "Confirm!",
      question: "Are you sure?",
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  static create() {
    const containerElement = document.createElement("div");
    document.body.appendChild(containerElement);
    return render(<Confirm />, containerElement);
  }

  handleCancel() {
    this.setState({ isOpen: false });
    resolve(false);
  }

  handleConfirm() {
    this.setState({ isOpen: false });
    resolve(true);
  }

  show(question, title) {
    this.setState({ isOpen: true, question, title });
    return new Promise((res) => {
      resolve = res;
    });
  }

  render() {
    const { isOpen, question, title } = this.state;
    return !isOpen ? null : (
      <div className="prompt overlay">
        <div className="prompt-wrapper">
          <div className="prompt-content">
            <h5>{title}</h5>
            <p>{question}</p>
          </div>
          <div className="prompt-footer">
            <button className="button aux" onClick={this.handleCancel}>
              Cancel
            </button>
            <button className="button" onClick={this.handleConfirm}>
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Confirm;
