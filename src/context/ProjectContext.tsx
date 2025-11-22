import { Project } from "@/types/model";
import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export type ProjectContextValue = [
  Project | null,
  Dispatch<SetStateAction<Project | null>>,
];

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined,
);

export const ProjectContextProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const stored = localStorage.getItem("currentProject");

  const [currentProject, setCurrentProject] = useState<Project | null>(
    stored ? JSON.parse(stored) : null,
  );

  return (
    <ProjectContext.Provider value={[currentProject, setCurrentProject]}>
      {children}
    </ProjectContext.Provider>
  );
};

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject must be used inside ProjectContextProvider");
  }
  return ctx; // [currentProject, setCurrentProject]
}
