import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

export interface AppUIState {
  modal: string;
  modalData: any;
  sidePanelShown: boolean;
  membersListShown: boolean;
  projectsLayout: "list" | "grid";
  boardsLayout: "list" | "grid";
  boardsSortOrder: string;
  showArchived: boolean;
  refresh: boolean;
}

export interface AppUIActions {
  setModal: (modal: string, modalData?: any) => void;
  closeModal: () => void;
  setSidePanelShown: (shown: boolean) => void;
  setMembersListShown: (shown: boolean) => void;
  setProjectsLayout: (layout: "list" | "grid") => void;
  setBoardsLayout: (layout: "list" | "grid") => void;
  setBoardsSortOrder: (order: string) => void;
  showArchivedProject: (shown: boolean) => void;
  triggerRefresh: () => void;
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
  const [appUI, setAppUI] = useState<AppUIState>(() => {
    const savedState = localStorage.getItem("appUIState");
    return savedState
      ? JSON.parse(savedState)
      : {
          modal: "",
          modalData: null,
          sidePanelShown: false,
          membersListShown: false,
          projectsLayout: "grid",
          boardsLayout: "grid",
          showArchived: false,
          boardsSortOrder: "auto",
          refresh: false,
        };
  });

  useEffect(() => {
    localStorage.setItem("appUIState", JSON.stringify(appUI));
  }, [appUI]);

  const actions: AppUIActions = {
    setModal: (modal, modalData = null) =>
      setAppUI((prev) => ({ ...prev, modal, modalData })),

    closeModal: () =>
      setAppUI((prev) => ({ ...prev, modal: "", modalData: null })),

    setSidePanelShown: (sidePanelShown) =>
      setAppUI((prev) => ({ ...prev, sidePanelShown })),

    setMembersListShown: (membersListShown) =>
      setAppUI((prev) => ({ ...prev, membersListShown })),

    showArchivedProject: (showArchived) =>
      setAppUI((prev) => ({ ...prev, showArchived })),

    setProjectsLayout: (layout) =>
      setAppUI((prev) => ({ ...prev, projectsLayout: layout })),

    setBoardsLayout: (layout) =>
      setAppUI((prev) => ({ ...prev, boardsLayout: layout })),

    setBoardsSortOrder: (order) =>
      setAppUI((prev) => ({ ...prev, boardsSortOrder: order })),

    triggerRefresh: () =>
      setAppUI((prev) => ({ ...prev, refresh: !prev.refresh })),
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
