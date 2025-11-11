import React, { useState } from 'react';
export const ToastsContext = React.createContext();

// const testList = [
//   {
//     title: 'Success',
//     backgroundColor: '#47bf50',
//     icon: 'checkmark-circle'
//   },
//   {
//     title: 'Danger',
//     backgroundColor: '#d9534f',
//     icon: 'warning'
//   },
//   {
//     title: 'Info',
//     backgroundColor: '#5bc0de',
//     icon: 'information-circle'
//   },
//   {
//     title: 'Warning',
//     backgroundColor: '#f0ad4e',
//     icon: 'alert-circle'
//   }
// ];

export const ToastsContextProvider = ({ children }) => {

  const [toasts, setToasts] = useState([]);

  return (
    <ToastsContext.Provider value={[toasts, setToasts]}>
      {children}
    </ToastsContext.Provider>
  );

}