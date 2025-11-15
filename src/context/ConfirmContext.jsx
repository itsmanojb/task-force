import { createPortal } from "react-dom";
import React, { createContext, useContext, useState, useCallback } from "react";
import { ConfirmDialog } from "@/components/confirm/Confirm";

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    closing: false,
    title: "",
    message: "",
    resolve: () => {},
  });

  const confirm = useCallback((message, title = "Confirm") => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        closing: false,
        title,
        message,
        resolve,
      });
    });
  }, []);

  const handleClose = (value) => {
    // trigger fade-out animation
    setState((prev) => ({ ...prev, closing: true }));

    // wait for animation to finish
    setTimeout(() => {
      state.resolve(value);
      setState((prev) => ({ ...prev, isOpen: false, closing: false }));
    }, 250); // match CSS animation duration
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {state.isOpen &&
        createPortal(
          <ConfirmDialog state={state} onDialogClose={(e) => handleClose(e)} />,
          document.body,
        )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
