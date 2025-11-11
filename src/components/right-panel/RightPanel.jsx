import React, { useContext, useState, useEffect } from "react";
import { useIsMountedRef } from "@/App";
import { AuthContext } from "@/context/Auth";
import { getProjects } from "@/utils/data";
import "./Rightpanel.css";

const RightPanel = ({ update }) => {
  const isMountedRef = useIsMountedRef();
  const { currentUser } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [activeProjects, setActiveProjects] = useState(0);
  const [totalBoards, setTotalBoards] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    (async function () {
      const projects = await getProjects(currentUser.email);
      if (isMountedRef.current) {
        setProjects(projects);
        setActiveProjects(
          projects.filter((project) => !project.archived).length
        );
        setTotalBoards(
          projects
            .map((project) => project.boards.length)
            .reduce((a, b) => a + b, 0)
        );
        const members = projects
          .map((project) => project.members)
          .reduce((acc, val) => acc.concat(val), []);
        const uniqMembers = members.filter(
          (item, i) => members.indexOf(item) === i && item !== "me"
        );
        // const uniqMembers = [...new Set(members)];
        setTotalMembers(uniqMembers.length);
      }
      // await getAllColumns(data.id, setColumns);
    })();
    return () => (isMountedRef.current = false);
  }, [currentUser, update, isMountedRef]);

  return (
    <div className="sidebar right">
      <div className="user-info">
        <div className="greet">
          Hello <strong>{currentUser.displayName}</strong>
        </div>
        <div className="avatar">
          <img src={currentUser.photoURL} alt="" />
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="label">Total projects</span>
          <strong>{projects.length}</strong>
        </div>
        <div className="stat">
          <span className="label">Active Projects</span>
          <strong>{activeProjects}</strong>
        </div>
        <div className="stat">
          <span className="label">Total Boards</span>
          <strong>{totalBoards}</strong>
        </div>
        <div className="stat">
          <span className="label">Total Members</span>
          <strong>{totalMembers}</strong>
        </div>
      </div>
      <div className="activity-feed">
        <div className="header">
          Activity <span>Feed</span>
        </div>
        <div className="feed-list">
          <ul>
            <li>
              <small>No activities</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
