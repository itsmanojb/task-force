import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

// Adjust fields to match your toast structure
export interface Toast {
  id: number;
  message: string;
  title?: string;
  icon?: string;
  backgroundColor?: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
}

export type ToastsContextValue = [Toast[], Dispatch<SetStateAction<Toast[]>>];

interface ToastsProviderProps {
  children: ReactNode;
}

export const ToastsContext = createContext<ToastsContextValue | undefined>(
  undefined,
);

export const ToastsContextProvider: React.FC<ToastsProviderProps> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  return (
    <ToastsContext.Provider value={[toasts, setToasts]}>
      {children}
    </ToastsContext.Provider>
  );
};

export function useToasts() {
  const ctx = useContext(ToastsContext);
  if (!ctx) {
    throw new Error("useToasts must be used inside <ToastsContextProvider />");
  }
  return ctx; // [toasts, setToasts]
}
