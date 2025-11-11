import React, { useState } from 'react';
export const DropdownContext = React.createContext();

export const DropdownContextProvider = ({ children }) => {

  const [open, setOpen] = useState(false);

  return (
    <DropdownContext.Provider value={[open, setOpen]}>
      {children}
    </DropdownContext.Provider>
  );
};