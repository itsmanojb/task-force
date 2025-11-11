import React from "react";
import "./Members.css";

function initials(name) {
  const arr = name.split(" ");
  let abbr = "";
  arr.forEach((element) => {
    abbr += element.charAt(0);
  });
  return abbr;
}

const BoardMembers = ({ members, klass }) => {
  return (
    <div className={"members-panel " + klass}>
      <div className="count">{members.length} Members</div>
      <div className="all-members">
        {members.length &&
          members.map((member, i) => (
            <div className="member" key={i}>
              <span className="icon">{initials(member)}</span>
              <span className="name">{member}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BoardMembers;
