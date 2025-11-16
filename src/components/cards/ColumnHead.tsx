import React from 'react';
import { useState } from 'react';

const ColumnHead = ({ name, renameColumn }) => {
  const [title, setTitle] = useState(name);
  const [placeHolder, setPlaceholder] = useState(name);
  const [editMode, setEditMode] = useState(false);

  function doColumnRename() {
    if (!title) {
      setTitle(placeHolder);
    } else {
      renameColumn(title);
      setPlaceholder(title);
    }
    setEditMode(false);
  }

  function keyPressed(event) {
    if (event.key === 'Enter') {
      doColumnRename();
    }
  }

  return !editMode
    ? <h2 onDoubleClick={() => setEditMode(true)}>{title}</h2>
    : <input
      autoFocus
      className="column-name-input"
      type="text"
      value={title}
      autoComplete="off"
      onChange={(e) => setTitle(e.target.value)}
      onBlur={doColumnRename}
      onKeyPress={keyPressed}
      placeholder={placeHolder}
    />;
}

export default ColumnHead;