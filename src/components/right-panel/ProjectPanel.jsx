import React, { useState, useEffect } from "react";
import { getFullDateTime } from "@/utils/utility";
// import { AuthContext } from 'context/Auth';
import "./Rightpanel.css";

const ProjectPanel = ({ project, boards, update }) => {
  const [projectCreationDate, setProjectCreationDate] = useState("");

  useEffect(() => {
    const fullDate = getFullDateTime(project.created);
    setProjectCreationDate(fullDate);
  }, [project, update]);

  return (
    <div className="sidebar project right">
      <div className="user-info">
        <div className="greet">
          <strong>{project.name}</strong>
        </div>
        <div className="desc">
          {project.description}
          <small>Created {projectCreationDate}</small>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="label">Members</span>
          <strong>{project.members.length}</strong>
        </div>
        <div className="stat">
          <span className="label">Boards</span>
          <strong>{boards}</strong>
        </div>
      </div>
      <div className="activity-feed">
        <div className="header">
          Project Activity <span>Feed</span>
        </div>
        {/* <div className="feed-list">
          <ul>
            <li><small>No recent activities</small></li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default ProjectPanel;
