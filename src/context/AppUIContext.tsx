import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export interface AppUIState {
  modal: string;
  modalData: any;
  sidePanelShown: boolean;
  membersListShown: boolean;
}

export interface AppUIActions {
  setModal: (modal: string, modalData?: any) => void;
  closeModal: () => void;
  setSidePanelShown: (shown: boolean) => void;
  setMembersListShown: (shown: boolean) => void;
}

// Tuple value type
export type AppUIContextValue = [
  AppUIState,
  Dispatch<SetStateAction<AppUIState>>,
  AppUIActions,
];

interface AppUIContextProviderProps {
  children: ReactNode;
}

export const AppUIContext = createContext<AppUIContextValue | undefined>(
  undefined,
);

export const AppUIContextProvider: React.FC<AppUIContextProviderProps> = ({
  children,
}) => {
  const [appUI, setAppUI] = useState<AppUIState>({
    modal: "",
    modalData: null,
    sidePanelShown: false,
    membersListShown: false,
  });

  const actions: AppUIActions = {
    setModal: (modal, modalData = null) =>
      setAppUI((prev) => ({ ...prev, modal, modalData })),

    closeModal: () =>
      setAppUI((prev) => ({ ...prev, modal: "", modalData: null })),

    setSidePanelShown: (sidePanelShown) =>
      setAppUI((prev) => ({ ...prev, sidePanelShown })),

    setMembersListShown: (membersListShown) =>
      setAppUI((prev) => ({ ...prev, membersListShown })),
  };

  return (
    <AppUIContext.Provider value={[appUI, setAppUI, actions]}>
      {children}
    </AppUIContext.Provider>
  );
};

export function useAppUI() {
  const ctx = useContext(AppUIContext);
  if (!ctx) {
    throw new Error("useAppUI must be used inside AppUIContextProvider");
  }
  return ctx;
}
