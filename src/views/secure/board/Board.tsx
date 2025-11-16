/* eslint-disable
jsx-a11y/anchor-is-valid, no-lone-blocks, no-unused-vars */

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import shortid from "shortid";

import { app } from "@/firebase/init";
import { useToasts } from "@/context/ToastsContext";
import { useAppUI } from "@/context/AppUIContext";
import { useConfirm } from "@/context/ConfirmContext";
import { useProject } from "@/context/ProjectContext";

import { LineLoader } from "@/common/loader/LineLoader";
import { Card } from "@/components/cards/Card";
import { AddCard } from "@/components/cards/AddCard";
import { AddColumn } from "@/components/cards/AddColumn";
import ColumnHead from "@/components/cards/ColumnHead";
import BoardMembers from "@/components/members/BoardMembers";
import Icon from "@/components/misc/IonIcon";
import { createDeepCopy } from "@/utils/utility";
import { Board, Column, TaskCard } from "@/types/model";
import {
  getBoard,
  getColumns,
  addColumn,
  updateColumn,
  renameColumn,
  deleteColumn,
  deleteBoard,
} from "@/utils/data";

import "./Board.css";

function afterUpdateColumn(
  columns: Column[],
  selectedColumn: Column,
  upColumn: Column,
  setColumns: (cols: Column[]) => void,
) {
  const filColumns = columns.filter((cl) => cl.id !== selectedColumn.id);
  const newColumns = [...filColumns, upColumn];
  newColumns.sort((a, b) => a.created - b.created);
  setColumns(newColumns);
}

async function getAllColumns(id: string, setColumns: (cols: Column[]) => void) {
  const resCols = await getColumns(id);
  setColumns(resCols);
}

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState<Board>();
  const [isColumnAdd, setIsColumnAdd] = useState(false);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isCardAdd, setIsCardAdd] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [isAdd, setIsAdd] = useState(true);
  const [inEditCard, setInEditCard] = useState<any>(null);
  const [boardExtended, setBoardExtended] = useState(false);

  const [_, __, actions] = useAppUI();
  const [project, setProject] = useProject();
  const [toasts, setToasts] = useToasts();

  // Required for Board name quick edit
  // const [boardName, setBoardName] = useState({});
  // const [boardNamePlaceholder, setBoardNamePlaceholder] = useState('');
  // const [boardNameEdit, setBoardNameEdit] = useState(false);

  useEffect(() => {
    (async function () {
      const data = await getBoard(id!);
      if (data) {
        setBoard(data);
        // setBoardName(data.name);
        // setBoardNamePlaceholder(data.name);
        await getAllColumns(data.id, setColumns);
      }
      setLoading(false);
    })();
  }, [id]);

  const showError = (message: string) => {
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

  function handleAddCloumn(columnName: string) {
    if (project!.archived) {
      showError("Modification on archived project is not allowed");
      return;
    }

    const newColumn: any = {
      boardId: board!.id,
      name: columnName,
      cards: [],
      created: Date.now(),
    };

    addColumn(newColumn)
      .then((value) => {
        if (value) {
          newColumn["id"] = value;
          setColumns([...columns, newColumn]);
          setIsColumnAdd(false);
        }
      })
      .catch((error) => {
        showError(error.message);
      });
  }

  async function addCard(card: TaskCard) {
    if (project!.archived) {
      showError("Modification on archived project is not allowed");
      return;
    }
    try {
      card["id"] = shortid();
      const cards = [...(selectedColumn?.cards || []), card];
      const uColumn = createDeepCopy(selectedColumn);
      uColumn.cards = cards;
      const val = await updateColumn(uColumn.id, uColumn);
      if (val && selectedColumn) {
        afterUpdateColumn(columns, selectedColumn, uColumn, setColumns);
        setIsCardAdd(false);
      }
    } catch (error: any) {
      showError(error.message);
    }
  }

  async function handleCardEdit(upCard: any) {
    if (project?.archived) {
      showError("Modification on archived project is not allowed");
      return;
    }
    try {
      const card = { id: inEditCard.id, ...upCard };
      const uColumn = createDeepCopy(selectedColumn);
      const cards = selectedColumn?.cards.filter(
        (c) => c.id !== inEditCard!.id,
      );
      const newCards = [...(cards || []), card];
      uColumn.cards = newCards;
      const val = await updateColumn(selectedColumn!.id, uColumn);
      if (val) {
        afterUpdateColumn(columns, selectedColumn!, uColumn, setColumns);
        setIsAdd(true);
        setIsCardAdd(false);
        setSelectedColumn(null);
        setInEditCard(null);
      }
    } catch (error: any) {
      showError(error?.message);
    }
  }

  async function handleCardArchive(card: TaskCard, column: Column) {
    if (project?.archived) {
      showError("Modification on archived project is not allowed");
      return;
    }
    try {
      card.isArchive = true;
      const newCards = column.cards.filter((c) => c.id !== card.id);
      const upColumn = createDeepCopy(column);
      upColumn.cards = [...newCards, card];
      const val = await updateColumn(column.id, upColumn);
      if (val) {
        afterUpdateColumn(columns, column, upColumn, setColumns);
      }
    } catch (error: any) {
      showError(error?.message);
    }
  }

  async function handleCardCompletion(card: TaskCard, column: Column) {
    if (project?.archived) {
      showError("Modification on archived project is not allowed");
      return;
    }
    try {
      card.isCompleted = true;
      const newCards = column.cards.filter((c) => c.id !== card.id);
      const upColumn = createDeepCopy(column);
      upColumn.cards = [...newCards, card];
      const val = await updateColumn(column.id, upColumn);
      if (val) {
        afterUpdateColumn(columns, column, upColumn, setColumns);
      }
    } catch (error: any) {
      showError(error?.message);
    }
  }

  async function onDragDrop(ev: any, newColumn: Column) {
    if (project?.archived) {
      showError("Modification on archived project is not allowed");
      return;
    }
    try {
      const card = JSON.parse(ev.dataTransfer.getData("card"));
      const oldColumn = JSON.parse(ev.dataTransfer.getData("columnFrom"));
      if (oldColumn.id === newColumn.id) {
        return;
      }
      oldColumn.cards = oldColumn.cards.filter((c: any) => c.id !== card.id);
      const val = await updateColumn(oldColumn.id, oldColumn);
      newColumn.cards = [...newColumn.cards, card];
      const val1 = await updateColumn(newColumn.id, newColumn);
      if (val && val1) {
        const newCols = columns.filter(
          (col) => col.id !== oldColumn.id && col.id !== newColumn.id,
        );
        const sortedCols = [...newCols, oldColumn, newColumn].sort(
          (a, b) => a.created - b.created,
        );
        setColumns(sortedCols);
      }
    } catch (error: any) {
      showError(error?.message);
    }
  }

  // async function handleBoardRename(newName) {
  //   const renamed = await renameBoard(board.id, newName);
  //   if (renamed) {
  //     setBoardNameEdit(false);
  //     setBoardName(newName);
  //     setBoardNamePlaceholder(newName);
  //   }
  // }

  function cancelNewColumn() {
    setIsColumnAdd(false);
  }

  function openAddCard(column: Column) {
    setIsAdd(true);
    setIsCardAdd(true);
    setSelectedColumn(column);
    setInEditCard(null);
  }

  function openCardEdit(card: TaskCard, column: Column) {
    setIsAdd(false);
    setIsCardAdd(true);
    setSelectedColumn(column);
    setInEditCard(card);
  }

  function handleDeleteColumn(column: Column) {
    if (project?.archived) {
      showError("Modification on archived project is not allowed");
      return;
    }

    const newCols = columns
      .filter((c) => c.id !== column.id)
      .sort((a, b) => a.created - b.created);
    deleteColumn(column.id)
      .then(() => {
        setColumns(newCols);
      })
      .catch((err) => {
        showError(err.message);
      });
  }

  function handleRenameColumn(column: Column, newName: string) {
    if (project?.archived) {
      showError("Modification on archived project is not allowed");
      return;
    }
    renameColumn(column.id, newName);
  }

  function handleBoardEdit() {
    if (project?.archived) {
      showError("Modification on archived project is not allowed");
      return;
    }
    actions.setModal("editboard", board);
  }

  async function handleBoardDelete() {
    if (project?.archived) {
      showError("Modification on archived project is not allowed");
      return;
    }
    const ok = await confirm(
      "Are you sure you want to delete the board?",
      "Confirm!",
    );
    if (ok) {
      setLoading(true);
      await Promise.all(
        columns.map(async (c) => {
          await deleteColumn(c.id);
        }),
      );
      const val = await deleteBoard(board!.id!);
      if (val) {
        navigate("/s/dashboard");
      }
    }
  }

  async function handleLogout() {
    const ok = await confirm("Are you sure you want to log out?", "Confirm!");
    if (ok) {
      await app.auth().signOut();
    }
  }

  function goToDashboard() {
    localStorage.removeItem("currentProject");
    navigate(`/s/dashboard`);
    setProject(null);
  }

  // board name edit
  // function doBoardRename() {
  //   if (!boardName) {
  //     setBoardNameEdit(false);
  //     setBoardName(boardNamePlaceholder);
  //   } else {
  //     handleBoardRename(boardName);
  //   }
  // }

  // function keyPressed(event) {
  //   if (event.key === 'Enter') {
  //     doBoardRename();
  //   }
  // }

  // sidenav
  const SideNav = () => {
    return (
      <div className="sidenav">
        <ul className="sidenav-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              title="Dashboard"
              onClick={(e) => goToDashboard()}
            >
              <Icon name="layers-outline" />
            </a>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              title="Project Boards"
              to={`/s/project/${board?.projectId}`}
            >
              <Icon name="folder-outline" />
            </Link>
          </li>
          <li className="nav-item">
            <a
              title="Members"
              className={boardExtended ? "nav-link active" : "nav-link"}
              onClick={(e) => setBoardExtended(!boardExtended)}
            >
              <Icon name="people-outline" />
            </a>
          </li>
          <li className={project?.archived ? "nav-item disabled" : "nav-item"}>
            <a
              className="nav-link"
              title="Edit Board"
              onClick={handleBoardEdit}
            >
              <Icon name="create-outline" />
            </a>
          </li>
          <li className={project?.archived ? "nav-item disabled" : "nav-item"}>
            <a
              className="nav-link"
              title="Delete Board"
              onClick={handleBoardDelete}
            >
              <Icon name="trash-outline" />
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" title="Log Out" onClick={handleLogout}>
              <Icon name="power" />
            </a>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      {loading && <LineLoader />}
      <main
        className={boardExtended ? "board-content extended" : "board-content"}
      >
        <div>
          <SideNav />
        </div>
        {boardExtended && <BoardMembers members={board?.teamMembers || []} />}
        <div className="scroll">
          {loading ? (
            <div className="inner-loading-text">Loading columns ...</div>
          ) : (
            <div
              className="trello-board"
              style={{ paddingTop: project?.archived ? "0" : "40px" }}
            >
              {project?.archived && (
                <div className="archive-alert">
                  Project has been archived. You can only view this project.
                </div>
              )}
              <ul className="column__list">
                {columns.map((column) => {
                  return (
                    <li
                      className={
                        project?.archived && column.cards.length === 0
                          ? "column__item empty"
                          : "column__item"
                      }
                      key={column.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        onDragDrop(e, column);
                      }}
                    >
                      <div className="column__title--wrapper">
                        <ColumnHead
                          name={column.name}
                          renameColumn={(newName: string) =>
                            handleRenameColumn(column, newName)
                          }
                        />
                        {!project?.archived && (
                          <span
                            className="btn"
                            onClick={(e) => handleDeleteColumn(column)}
                          >
                            <Icon name="trash-outline" />
                          </span>
                        )}
                      </div>
                      <ul className="card__list scroll-box">
                        {column.cards.map(
                          (card) =>
                            !card.isArchive && (
                              <Card
                                card={card}
                                board={board}
                                key={card.id}
                                handleEdit={() => openCardEdit(card, column)}
                                handleArchive={() =>
                                  handleCardArchive(card, column)
                                }
                                handleCompletion={() =>
                                  handleCardCompletion(card, column)
                                }
                                column={column}
                                archived={project?.archived}
                              />
                            ),
                        )}
                      </ul>
                      {!project?.archived && (
                        <div
                          className="column__item--cta"
                          onClick={() => openAddCard(column)}
                        >
                          <Icon name="add"></Icon>
                          <span>Add a card</span>
                        </div>
                      )}
                    </li>
                  );
                })}
                {!project?.archived && (
                  <li className="column__item trans">
                    {isColumnAdd ? (
                      <AddColumn
                        handleClose={cancelNewColumn}
                        handleAdd={handleAddCloumn}
                      />
                    ) : (
                      <div className="column__item--new">
                        <button onClick={() => setIsColumnAdd(true)}>
                          Add Column
                        </button>
                      </div>
                    )}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </main>
      {isCardAdd && (
        <AddCard
          board={board}
          handleCardAdd={addCard}
          handleClose={() => setIsCardAdd(false)}
          isAdd={isAdd}
          card={inEditCard}
          handleEdit={handleCardEdit}
        />
      )}
    </>
  );
};

export { ProjectBoard as Board };

{
  /* <div className="board-header">
  <div className="board-name-editable">
    {boardNameEdit
      ?
      <div className="edit-view">
        <input type="text"
          autoFocus
          value={boardName}
          placeholder={boardNamePlaceholder}
          onChange={e => setBoardName(e.target.value)}
          onBlur={doBoardRename}
          onKeyPress={keyPressed}
          autoComplete="off"
        />
        <span>save</span>
      </div>
      : <div className="no-edit">
        <h2 onDoubleClick={() => setBoardNameEdit(true)}>{boardName}</h2>
      </div>
    }
  </div>
</div> */
}
