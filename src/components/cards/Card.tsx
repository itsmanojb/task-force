import React, { useState, useEffect } from "react";
import Icon from "@/components/misc/IonIcon";
import { Team } from "@/components/misc/Team";
import Priority from "@/components/misc/Priority";
import { Modal } from "@/common/modal/Modal";
import { convertDateToNice } from "@/utils/utility";

export const Card = ({
  card,
  board,
  column,
  archived,
  handleEdit,
  handleArchive,
  handleCompletion,
}) => {
  const [isDetails, setIsDetails] = useState(false);
  const members = card.teamMembers.map((name) => (
    <Team name={name} key={name} />
  ));
  const allMembers = card.teamMembers;
  const date = new Date(card.date);
  const dueDate = convertDateToNice(date);

  useEffect(() => {
    function escFunction(event) {
      if (event.keyCode === 27) {
        setIsDetails(false);
      }
    }
    window.addEventListener("keydown", escFunction);
    return () => window.removeEventListener("keydown", escFunction);
  }, [setIsDetails]);

  function doEdit() {
    setIsDetails(false);
    handleEdit();
  }

  function doArchive() {
    setIsDetails(false);
    handleArchive();
  }

  function markComplete() {
    setIsDetails(false);
    handleCompletion();
  }

  const detailsModal = (
    <Modal>
      <div className="modal-header">
        <div className="modal-title">
          {!archived && (
            <>
              {card.isCompleted ? (
                <button disabled>
                  <Icon name="checkmark-done-outline" />
                  <span> Completed </span>
                </button>
              ) : (
                <button onClick={markComplete}>
                  <Icon name="checkmark-outline" />
                  <span> Mark Complete </span>
                </button>
              )}
            </>
          )}
        </div>
        <div className="modal-actions no-text">
          {!archived && (
            <>
              <button onClick={doEdit} disabled={card.isCompleted}>
                <Icon name="options-outline" />
                <span>Edit</span>
              </button>
              <button onClick={doArchive}>
                <Icon name="archive-outline" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
        <div className="close" onClick={() => setIsDetails(false)}>
          <Icon name="close" />
        </div>
      </div>
      <div className="modal-content">
        <h3 className="task-title">{card.title}</h3>
        <dl>
          <dt>Assignee</dt>
          <dd>
            <div className="assignee">
              {allMembers.map((member, i) => (
                <div className="member-name" key={i}>
                  {" "}
                  <span className="card__avatars--item">
                    {member.charAt(0)}
                  </span>{" "}
                  {member}{" "}
                </div>
              ))}
            </div>
          </dd>
          <dt>Due Date</dt>
          <dd>
            <div className="date">
              <div className="icon">
                <Icon name="calendar-outline" />
              </div>
              <span>{dueDate}</span>
            </div>
          </dd>
          <dt>Board</dt>
          <dd>
            <span className="board-name">{board.name}</span>{" "}
          </dd>
          <dt>Priority</dt>
          <dd>
            <div className="tags">
              <Priority value={card.priority} />
            </div>
          </dd>
          <dt>Description</dt>
          <dd>
            <p>{card.description || "-"}</p>{" "}
          </dd>
        </dl>
      </div>
    </Modal>
  );

  function dragStart(ev, card) {
    ev.dataTransfer.setData("card", JSON.stringify(card));
    ev.dataTransfer.setData("columnFrom", JSON.stringify(column));
  }

  return (
    <>
      <li
        className="card__item"
        onDragStart={(e) => dragStart(e, card)}
        draggable
        onClick={() => setIsDetails(true)}>
        <Priority value={card.priority} showText={false} />
        <h6 className="card__title">{card.title}</h6>
        <ol className="card__actions">
          <li className="card__actions--wrapper">
            {/* <i className="far fa-check-square"></i><span className="card__actions--text">1/4</span> */}
          </li>
          <ol className="card__avatars">{members}</ol>
        </ol>
      </li>
      {isDetails && detailsModal}
    </>
  );
};
