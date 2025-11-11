import React, { useState } from 'react';
export const ProjectContext = React.createContext();

export const ProjectContextProvider = ({ children }) => {

  const [currentProject, setCurrentProject] = useState(
    JSON.parse(localStorage.getItem('currentProject'))
  );

  return (
    <ProjectContext.Provider value={[currentProject, setCurrentProject]}>
      {children}
    </ProjectContext.Provider>
  );

};