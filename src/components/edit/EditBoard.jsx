import React, { useState, useContext, useEffect } from "react";
import { editBoard } from "@/utils/data";
import { AuthContext } from "@/context/Auth";
import { ToastsContext } from "@/context/Toasts";
import Icon from "@/components/misc/IonIcon";

import "../create-new/AddNew.css";

export const EditBoard = ({ board, edited, closed }) => {
  const { currentUser } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [name, setName] = useState("");
  const [teamMember, setTeamMember] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [type, setType] = useState("");

  const [toasts, setToasts] = useContext(ToastsContext);

  useEffect(() => {
    const project = JSON.parse(localStorage.getItem("currentProject"));
    if (project) {
      setProject(project);
    }
    setName(board.name);
    setTeamMember(board.teamMembers);
    setType(board.type);
  }, [board]);

  const saveBoard = () => {
    if (!name && teamMember.length === 0) {
      showError("Mandatory (*) fields cannot be left blank");
      return;
    }

    const editedBoard = {
      name,
      type,
      projectId: project.id,
      user: currentUser.email,
      teamMembers: teamMember,
      modifiedOn: new Date().getTime(),
    };

    setFormSubmitted(true);
    editBoard(board.id, editedBoard)
      .then((success) => {
        if (success) {
          edited(new Date().getTime());
          setToasts([
            ...toasts,
            {
              message: "Board has been updated",
              id: toasts.length,
              title: "Success",
              backgroundColor: "#47bf50",
              icon: "checkmark-circle",
            },
          ]);
        } else {
          showError("Failed to update this board");
          return;
        }
      })
      .catch(() => {
        showError("Could not update board. Some error occured.");
        return;
      });
  };

  function onSelectChange(e) {
    const values = [...e.target.selectedOptions].map((opt) => opt.value);
    setTeamMember(values);
  }

  const goBack = () => {
    closed();
  };

  const showError = (message) => {
    setFormSubmitted(false);
    setToasts([
      ...toasts,
      {
        message,
        id: toasts.length,
        title: "Error",
        backgroundColor: "#d9534f",
        icon: "warning",
      },
    ]);
  };

  return (
    <main className="content">
      <div className="modal-page-ui new-board">
        <button className="close" onClick={() => goBack()}>
          <Icon name="close" />
        </button>
        <div className="modal-page-content">
          <h2>Edit board</h2>
          <div className="floating">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              placeholder="Board's name"
              className="floating__input"
              autoComplete="off"
            />
            <label
              htmlFor="name"
              className="floating__label"
              data-content="Board's name *">
              <span className="hidden--visually">Board's name</span>
            </label>
          </div>
          <div className="input-row">
            <label htmlFor="members">
              Choose members (select multiple, if needed)
            </label>
            <select
              name="members"
              id="members"
              multiple={true}
              value={teamMember}
              onChange={onSelectChange}>
              {project &&
                project.members.map((member, i) => (
                  <option value={member} key={i}>
                    {member}
                  </option>
                ))}
            </select>
          </div>
          <div className="floating">
            <input
              type="text"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              id="type"
              placeholder="Board type (eg. Design UX)"
              className="floating__input"
              autoComplete="off"
            />
            <label
              htmlFor="type"
              className="floating__label"
              data-content="Board type (eg. Design UX)">
              <span className="hidden--visually">
                Board type (eg. Design UX)
              </span>
            </label>
          </div>
          <div className="form-buttons">
            <button
              type="submit"
              onClick={saveBoard}
              disabled={formSubmitted}
              id="EditBoard"
              className="button">
              {formSubmitted ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
