import React, { useState, useEffect } from 'react';

export const AddColumn = ({ handleAdd, handleClose }) => {
  const [columnName, setColumnName] = useState('');

  useEffect(() => {
    function escFunction(event) {
      if (event.keyCode === 27) {
        handleClose();
      }
    }
    window.addEventListener('keydown', escFunction);
    return () => window.removeEventListener('keydown', escFunction);
  }, [handleClose]);

  function handleAddColumn() {
    if (!columnName) {
      handleClose();
    } else {
      handleAdd(columnName);
    }
  }

  function keyPressed(event) {
    if (event.key === 'Enter') {
      handleAddColumn();
    }
  }

  return (
    <div className="column__item--input">
      <input type="text"
        autoFocus
        autoComplete="off"
        placeholder="Column name"
        value={columnName}
        name="column_name"
        id="column_name"
        onChange={e => setColumnName(e.target.value)}
        onBlur={handleAddColumn}
        onKeyPress={keyPressed}
      />
    </div>
  );
};
