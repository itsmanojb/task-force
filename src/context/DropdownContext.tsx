import React, {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// What the context will store
type DropdownContextValue = [boolean, Dispatch<SetStateAction<boolean>>];

interface DropdownProviderProps {
  children: ReactNode;
}

// Create context with proper type
export const DropdownContext = createContext<DropdownContextValue | undefined>(
  undefined,
);

export const DropdownContextProvider: React.FC<DropdownProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DropdownContext.Provider value={[open, setOpen]}>
      {children}
    </DropdownContext.Provider>
  );
};
