import React, { useState } from "react";
import { createRoot } from "react-dom/client";

export function createConfirm() {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);

  let resolve;

  const Confirm = () => {
    const [state, setState] = useState({
      isOpen: false,
      title: "Confirm!",
      question: "Are you sure?",
    });

    const close = (value) => {
      setState((prev) => ({ ...prev, isOpen: false }));
      resolve(value);
    };

    return (
      state.isOpen && (
        <div className="prompt overlay">
          <div className="prompt-wrapper">
            <div className="prompt-content">
              <h5>{state.title}</h5>
              <p>{state.question}</p>
            </div>
            <div className="prompt-footer">
              <button className="button aux" onClick={() => close(false)}>
                Cancel
              </button>
              <button className="button" onClick={() => close(true)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )
    );
  };

  root.render(<Confirm />);

  return function show(question, title = "Confirm!") {
    return new Promise((res) => {
      resolve = res;

      root.render(<Confirm initial={{ isOpen: true, question, title }} />);
    });
  };
}
