import React from 'react';
const Priority = ({ value, showText = true }) => {

  function getPriorityColor() {
    let klass = 'card__tag ';
    switch (value) {
      case 'Immediate':
        klass += 'card__tag--red';
        break;
      case 'Urgent':
        klass += 'card__tag--orange';
        break;
      case 'High':
        klass += 'card__tag--yellow';
        break;
      case 'Low':
        klass += 'card__tag--green';
        break;
      case 'Hold':
        klass += 'card__tag--pink';
        break;
      default:
        klass += 'card__tag--blue';
        break;
    }
    return klass;
  }

  return <span className={getPriorityColor()}>{showText ? value : ''}</span>;
}

export default Priority;