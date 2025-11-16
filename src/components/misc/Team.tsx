import React from 'react';

export const Team = ({ name, count, total, max = 3 }) => {
  const arr = name.split(' ');
  let abbr = '';
  arr.forEach(element => {
    abbr += element.charAt(0);
  });
  if (total > max) {
    if (count === max) {
      return <li className="card__avatars--item">+{total - count}</li>
    } if (count > max) {
      return null;
    }
  }
  return <li title={name} className="card__avatars--item">{abbr}</li>
};
