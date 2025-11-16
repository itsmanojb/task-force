import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import { getBoards } from "@/utils/data";
import { timeAgo } from "@/utils/utility";

import { LineLoader } from "@/common/loader/LineLoader";
import SideNav from "@/components/sidenav/Sidenav";
import ProjectPanel from "@/components/right-panel/ProjectPanel";
import BoardMembers from "@/components/members/BoardMembers";
import { Team } from "@/components/misc/Team";
import { Board } from "@/types/model";
import Icon from "@/components/misc/IonIcon";

export const ProjectDashboard = () => {
  // const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentProject] = useProject();
  const [boardsLayout, setBoardsLayout] = useState(
    localStorage.getItem("layout_boards") || "grid",
  );
  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState<Board[]>([]);
  const [projectExtended, setProjectExtended] = useState(false);
  const [sortOrder, setSortOrder] = useState("auto");

  useEffect(() => {
    if (currentProject) {
      setLoading(true);
      getBoards(currentUser!.email!, currentProject.id)
        .then((boards) => {
          setBoards(boards);
          setLoading(false);
        })
        .catch((error) => {
          setBoards([]);
        });
    } else {
      setLoading(false);
    }
  }, [currentUser, currentProject]);

  // const navigateTo = (path: string) => {
  //   if (path === "dash") {
  //     setCurrentProject(null);
  //     localStorage.removeItem("currentProject");
  //     navigate(`/s/dashboard`);
  //   }
  // };

  function onSortOrderChange(e: any) {
    const value = e.target.value;
    setSortOrder(value);
    const tempBoards = [...boards];

    if (value !== "auto") {
      if (value.substr(1) === "name") {
        if (value.charAt(0) === "-") {
          tempBoards.sort((a, b) =>
            a.name > b.name ? -1 : a.name < b.name ? 1 : 0,
          );
        } else {
          tempBoards.sort((a, b) =>
            a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
          );
        }
      }
      if (value.substr(1) === "created") {
        if (value.charAt(0) === "-") {
          tempBoards.sort((a, b) =>
            a.createdOn < b.createdOn ? -1 : a.createdOn > b.createdOn ? 1 : 0,
          );
        } else {
          tempBoards.sort((a, b) =>
            a.createdOn > b.createdOn ? -1 : a.createdOn < b.createdOn ? 1 : 0,
          );
        }
      }
      if (value.substr(1) === "members") {
        if (value.charAt(0) === "-") {
          tempBoards.sort((a, b) =>
            a.teamMembers.length < b.teamMembers.length
              ? -1
              : a.teamMembers.length > b.teamMembers.length
                ? 1
                : 0,
          );
        } else {
          tempBoards.sort((a, b) =>
            a.teamMembers.length > b.teamMembers.length
              ? -1
              : a.teamMembers.length < b.teamMembers.length
                ? 1
                : 0,
          );
        }
      }
    } else {
      setBoards(boards);
    }
    setBoards(tempBoards);
  }

  const setLayout = (layout: "list" | "grid") => {
    localStorage.setItem("layout_boards", layout);
    setBoardsLayout(layout);
  };

  if (!currentProject) {
    return <Navigate to="/s" replace />;
  } else {
    return (
      <>
        {loading && <LineLoader />}
        <main className="content">
          <div className={projectExtended ? "dashboard extended" : "dashboard"}>
            <div>
              <SideNav target="project" />
            </div>
            {projectExtended && (
              <BoardMembers
                klass="project-members"
                members={currentProject.members}
              />
            )}
            <div className="all-boards">
              {!loading ? (
                <>
                  {boards.length === 0 ? (
                    <div className="no-boards">
                      {currentProject.archived
                        ? "Project has been archived."
                        : "You haven't created any boards. To get started kindly click on the 'Create New Board'."}
                    </div>
                  ) : (
                    <>
                      {currentProject.archived && (
                        <div className="archive-alert">
                          Project has been archived. You can only view this
                          project.
                        </div>
                      )}
                      <div className="board-header">
                        <div className="menubar">
                          <div className="view-buttons">
                            <button
                              onClick={(e) => setLayout("grid")}
                              className={
                                boardsLayout === "grid" ? "active" : ""
                              }
                            >
                              <Icon name="grid-outline" />
                            </button>
                            <button
                              onClick={(e) => setLayout("list")}
                              className={
                                boardsLayout === "list" ? "active" : ""
                              }
                            >
                              <Icon name="list-outline" />
                            </button>
                          </div>
                          <div className="control-buttons">
                            <div className="control">
                              <label htmlFor="sortMenu">
                                Arrange Boards as
                              </label>
                              <select
                                id="sortMenu"
                                value={sortOrder}
                                onChange={onSortOrderChange}
                              >
                                <option value="auto">Automatic</option>
                                <option value="+created">Latest first</option>
                                <option value="-created">Oldest first</option>
                                <option value="+name">Name (a-z)</option>
                                <option value="-name">Name (z-a)</option>
                                <option value="+members">
                                  Team size (large)
                                </option>
                                <option value="-members">
                                  Team size (small)
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          boardsLayout === "grid"
                            ? "boards-listing grid"
                            : "boards-listing"
                        }
                      >
                        <div className="boards">
                          {boards.map((board) => {
                            return (
                              <Link
                                to={`/s/board/${board.id}`}
                                state={{ boardName: board.name }}
                                key={board.id}
                                className="board"
                              >
                                <div className="board-name">{board.name}</div>
                                <div className="board-type">
                                  <span>{board.type}</span>
                                </div>
                                <div className="board-desc">
                                  {/* <p>6 cards</p>
                              <p>16 tasks</p>
                              <p>70% completion</p> */}
                                </div>
                                <div className="board-footer">
                                  <ul className="board-members">
                                    {board.teamMembers.map((name, i) => (
                                      <Team
                                        count={i}
                                        total={board.teamMembers.length}
                                        name={name}
                                        key={name}
                                      />
                                    ))}
                                  </ul>
                                  <span className="meta">
                                    {timeAgo(board.createdOn)}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="inner-loading-text">Loading boards ...</div>
              )}
            </div>
            <div>
              {currentProject && (
                <ProjectPanel project={currentProject} boards={boards.length} />
              )}
            </div>
          </div>
        </main>
      </>
    );
  }
};
