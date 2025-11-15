import firebase from "firebase/app";
import "firebase/firestore";
import { db } from "@/firebase/init";

export const getProjects = async (email) => {
  try {
    const snapshot = await db
      .collection("projects")
      .where("manager", "==", email)
      // .orderBy('name')
      .get();
    const projects = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
    return projects;
  } catch (error) {
    return [];
  }
};

/**
 * Method which adds a project
 * @param {object} project the project which has to be created
 */
export const addProject = async (project) => {
  try {
    await db.collection("projects").add(project);
    return true;
  } catch (error) {
    return error;
  }
};

/**
 * Method which retriwves a project
 * @param {string} id id of the project
 */
export const getProject = async (id) => {
  try {
    return (await db.collection("projects").doc(id).get()).data() || null;
  } catch (error) {
    return error;
  }
};

/**
 * Method which updates a project (star, unstar or archive)
 * @param {string} id id of the project which has to be edited
 * @param {object} project the updated data
 */
export const updateProject = async (id, project) => {
  try {
    await db.collection("projects").doc(id).update(project);
    return true;
  } catch (error) {
    return error;
  }
};

/**
 * Method which updates a project (star, unstar or archive)
 * @param {string} id id of the project which has to be edited
 * @param {object} project the updated data
 */
export const archiveProject = async (id) => {
  try {
    await db.collection("projects").doc(id).update({ archived: true });
    return true;
  } catch (error) {
    return error;
  }
};

export const getBoards = async (email, id) => {
  try {
    const snapshot = await db
      .collection("boards")
      .where("user", "==", email)
      .where("projectId", "==", id)
      // .orderBy('name')
      .get();
    const boards = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
    return boards;
  } catch (error) {
    return [];
  }
};

/**
 * Method which adds a board
 * @param {string} id for the doc
 * @param {object} board the board which has to be created
 */
export const addBoard = async (board) => {
  try {
    const docRef = await db.collection("boards").add(board);
    const docId = docRef.id;
    const projectRef = db.collection("projects").doc(board.projectId);
    await projectRef.update({
      boards: firebase.firestore.FieldValue.arrayUnion(docId),
    });
    return true;
  } catch (error) {
    // console.log(error);
    return error;
  }
};

/**
 * Method which updates a board
 * @param {string} id for the doc
 * @param {object} board the board which has to be edited
 */
export const editBoard = async (id, board) => {
  try {
    await db.collection("boards").doc(id).update(board);
    return true;
  } catch (error) {
    // console.log(error);
    return error;
  }
};

/**
 * Gets a single board with a given ID
 * @param {string} id single board ID
 */
export const getBoard = async (id) => {
  try {
    const board = await db.collection("boards").doc(id).get();
    return { ...board.data(), id: board.id };
  } catch (error) {
    // console.log(error);
    return error;
  }
};

export const deleteBoard = async (id) => {
  try {
    await db.collection("boards").doc(id).delete();
    return true;
  } catch (error) {
    // console.log(error);
    return error;
  }
};

export const renameBoard = async (id, newName) => {
  try {
    await db.collection("boards").doc(id).update({ name: newName });
    return true;
  } catch (error) {
    // console.log(error);
    return error;
  }
};

export const getColumns = async (boardId) => {
  try {
    const snapshot = await db
      .collection("columns")
      .where("boardId", "==", boardId)
      .orderBy("created")
      .get();
    const boards = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
    return boards;
  } catch (error) {
    return [];
  }
};

export const addColumn = async (column) => {
  try {
    const d = await db.collection("columns").add(column);
    return d.id;
  } catch (error) {
    return error;
  }
};

/**
 * to update column
 * @param {string} id the id of the column
 * @param {any} column updated schema of column
 */
export const updateColumn = async (id, column) => {
  try {
    await db.collection("columns").doc(id).update(column);
    return true;
  } catch (error) {
    return error;
  }
};

/**
 * to delete column
 * @param {string} id the id of the column
 */
export const deleteColumn = async (id) => {
  try {
    await db.collection("columns").doc(id).delete();
    return true;
  } catch (error) {
    return error;
  }
};

/**
 * to rename column
 * @param {string} id the id of the column
 * @param {string} name new name of the column
 */
export const renameColumn = async (id, name) => {
  try {
    await db.collection("columns").doc(id).update({ name });
    return true;
  } catch (error) {
    return error;
  }
};
