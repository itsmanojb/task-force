import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ConfirmDialog } from "@/components/confirm/Confirm";

export type ConfirmFunction = (
  message: string,
  title?: string,
) => Promise<boolean>;

export interface ConfirmState {
  isOpen: boolean;
  closing: boolean;
  title: string;
  message: string;
  resolve: (value: boolean) => void;
}

interface ConfirmProviderProps {
  children: ReactNode;
}

// Create context with proper type
const ConfirmContext = createContext<ConfirmFunction | undefined>(undefined);

export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    closing: false,
    title: "",
    message: "",
    resolve: () => {},
  });

  const confirm = useCallback<ConfirmFunction>((message, title = "Confirm") => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        closing: false,
        title,
        message,
        resolve,
      });
    });
  }, []);

  const handleClose = (value: boolean) => {
    // trigger fade-out animation
    setState((prev) => ({ ...prev, closing: true }));

    // wait for animation to finish
    setTimeout(() => {
      state.resolve(value);
      setState((prev) => ({ ...prev, isOpen: false, closing: false }));
    }, 250);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {state.isOpen &&
        createPortal(
          <ConfirmDialog
            state={state}
            onDialogClose={(val: boolean) => handleClose(val)}
          />,
          document.body,
        )}
    </ConfirmContext.Provider>
  );
}

// Hook to use confirm()
export function useConfirm(): ConfirmFunction {
  const ctx = useContext(ConfirmContext);

  if (!ctx) {
    throw new Error("useConfirm must be used inside <ConfirmProvider />");
  }

  return ctx;
}
