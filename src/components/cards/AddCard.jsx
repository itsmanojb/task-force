import React, { useState, useEffect, useContext } from "react";
import { Modal } from "@/common/modal/Modal";
import { ToastsContext } from "@/context/Toasts";
import Icon from "@/components/misc/IonIcon";

export const AddCard = ({
  board,
  handleCardAdd,
  handleClose,
  card,
  isAdd = true,
  handleEdit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [team, setTeam] = useState([]);

  const [toasts, setToasts] = useContext(ToastsContext);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
      setTeam(card.teamMembers);
      const date = new Date(card.date);
      setDueDate(date.toISOString().substr(0, 10));
      setPriority(card.priority);
    }
  }, [isAdd, card]);

  useEffect(() => {
    function escFunction(event) {
      if (event.keyCode === 27) {
        handleClose();
      }
    }
    window.addEventListener("keydown", escFunction);
    return () => window.removeEventListener("keydown", escFunction);
  }, [handleClose]);

  function onSelectChange(e) {
    const values = [...e.target.selectedOptions].map((opt) => opt.value);
    setTeam(values);
  }

  function onPriorityChange(e) {
    const value = e.target.value;
    setPriority(value);
  }

  function onAdd() {
    if (!title || !dueDate || team.length === 0) {
      showError("Fill up all the mandatory fields");
      return;
    }

    const checkDateBool = checkDate(dueDate);
    if (checkDateBool) {
      showError("Due date already passed.");
      return;
    }

    const card = createCard(dueDate, title, team, description, priority);
    handleCardAdd(card);
  }

  function onEdit() {
    if (!title || !description || !dueDate || team.length === 0) {
      showError("All the fields are required");
      return;
    }

    const checkDateBool = checkDate(dueDate);
    if (checkDateBool) {
      showError("Due date already passed.");
      return;
    }

    const card = createCard(dueDate, title, team, description, priority);
    handleEdit(card);
  }

  const showError = (message) => {
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
    <Modal>
      <div className="modal-header cleaner">
        <div className="modal-title">{isAdd ? "New Task" : "Edit Task"}</div>
      </div>
      <div className="modal-content">
        <div className="input-row">
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
          />
          <textarea
            name="description"
            id="description"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="input-row">
          <label htmlFor="members">
            Choose members for this task (select multiple, if needed)
          </label>
          <select
            name="members"
            id="members"
            multiple={true}
            value={team}
            onChange={onSelectChange}>
            {board.teamMembers.map((member) => (
              <option value={member} key={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
        <div className="input-row columns">
          <div>
            <label htmlFor="title">Due date:</label>
            <input
              type="date"
              name="title"
              id="due_date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="priority">Priority</label>
            <select
              name="priority"
              id="priority"
              value={priority}
              onChange={onPriorityChange}>
              <option value="Immediate">Immediate</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
              <option value="Hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <div className="footer-left-buttons">
          {/* {!isAdd && <button className="aux">
            <Icon name="checkmark" /> <span>Mark as complete</span>
          </button>} */}
        </div>
        <div className="footer-right-buttons">
          <button onClick={handleClose}>
            <span>Cancel</span>
          </button>
          {isAdd ? (
            <button className="prime" onClick={onAdd}>
              <Icon name="add" />
              <span>Add</span>
            </button>
          ) : (
            <button className="prime" onClick={onEdit}>
              <Icon name="save-outline" />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

function checkDate(dueDate) {
  const today = new Date().getTime();
  const dueDateMili = new Date(dueDate).getTime();
  if (dueDateMili < today) {
    return true;
  }
  return;
}

function createCard(dueDate, title, teamMembers, description, priority) {
  const date = new Date(dueDate).getTime();
  return {
    title,
    description,
    teamMembers,
    date,
    priority,
    isArchive: false,
    isCompleted: false,
  };
}
