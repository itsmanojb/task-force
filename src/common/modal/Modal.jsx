import React from "react";
import "./Modal.css";

export const Modal = ({ children }) => {
  return (
    <div className="overlay">
      <div className="modal">{children}</div>
    </div>
  );
};
