import firebase from "firebase/app";
import "firebase/firestore";
import { db } from "@/firebase/init";
import { Board, Column, Project } from "@/types/model";

export const getProjects = async (email: string) => {
  try {
    const snapshot = await db
      .collection("projects")
      .where("manager", "==", email)
      // .orderBy('name')
      .get();
    const projects = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
    return projects as Project[];
  } catch (error) {
    console.log("Failed to get projects.", error);
    return [];
  }
};

/**
 * Method which adds a project
 * @param {object} project the project which has to be created
 */
export const addProject = async (project: Omit<Project, "id">) => {
  try {
    await db.collection("projects").add(project);
    return true;
  } catch (error) {
    console.log("Failed to add project.", error);
    return false;
  }
};

/**
 * Method which retriwves a project
 * @param {string} id id of the project
 */
export const getProject = async (id: string) => {
  try {
    return (
      ((await db.collection("projects").doc(id).get()).data() as Project) ||
      null
    );
  } catch (error) {
    console.log("Failed to get project details.", error);
    return null;
  }
};

/**
 * Method which updates a project (star, unstar or archive)
 * @param {string} id id of the project which has to be edited
 * @param {object} project the updated data
 */
export const updateProject = async (id: string, project: Partial<Project>) => {
  try {
    await db.collection("projects").doc(id).update(project);
    return true;
  } catch (error) {
    console.log("Failed to update project.", error);
    return false;
  }
};

/**
 * Method which updates a project (star, unstar or archive)
 * @param {string} id id of the project which has to be edited
 */
export const archiveProject = async (id: string) => {
  try {
    await db.collection("projects").doc(id).update({ archived: true });
    return true;
  } catch (error) {
    console.log("Failed to archive project.", error);
    return false;
  }
};

export const getBoards = async (email: string, id: string) => {
  try {
    const snapshot = await db
      .collection("boards")
      .where("user", "==", email)
      .where("projectId", "==", id)
      // .orderBy('name')
      .get();
    const boards: any[] = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
    return boards as Board[];
  } catch (error) {
    console.log("Failed to get boards.", error);
    return [];
  }
};

/**
 * Method which adds a board
 * @param {object} board the board which has to be created
 */
export const addBoard = async (board: Omit<Board, "id" | "created">) => {
  try {
    const docRef = await db.collection("boards").add(board);
    const docId = docRef.id;
    const projectRef = db.collection("projects").doc(board.projectId);
    await projectRef.update({
      boards: firebase.firestore.FieldValue.arrayUnion(docId),
    });
    return true;
  } catch (error) {
    console.log("Failed to add board.", error);
    return false;
  }
};

/**
 * Method which updates a board
 * @param {string} id for the doc
 * @param {object} board the board which has to be edited
 */
export const editBoard = async (id: string, board: Partial<Board>) => {
  try {
    await db.collection("boards").doc(id).update(board);
    return true;
  } catch (error) {
    console.log("Failed to edit board.", error);
    return false;
  }
};

/**
 * Gets a single board with a given ID
 * @param {string} id single board ID
 */
export const getBoard = async (id: string) => {
  try {
    const board: any = await db.collection("boards").doc(id).get();
    return { ...board.data(), id: board.id } as Board;
  } catch (error) {
    console.log("Failed to get board details.", error);
    return null;
  }
};

export const deleteBoard = async (id: string) => {
  try {
    await db.collection("boards").doc(id).delete();
    return true;
  } catch (error) {
    console.log("Failed to delete board.", error);
    return false;
  }
};

export const renameBoard = async (id: string, newName: string) => {
  try {
    await db.collection("boards").doc(id).update({ name: newName });
    return true;
  } catch (error) {
    console.log("Failed to rename board.", error);
    return false;
  }
};

export const getColumns = async (boardId: string) => {
  try {
    const snapshot = await db
      .collection("columns")
      .where("boardId", "==", boardId)
      .orderBy("created")
      .get();
    const columns: any[] = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));
    return columns as Column[];
  } catch (error) {
    return [];
  }
};

export const addColumn = async (column: Column) => {
  try {
    const d = await db.collection("columns").add(column);
    return d.id;
  } catch (error) {
    console.log("Failed to add column.", error);
    return null;
  }
};

/**
 * to update column
 * @param {string} id the id of the column
 * @param {any} column updated schema of column
 */
export const updateColumn = async (id: string, column: Partial<Column>) => {
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
export const deleteColumn = async (id: string) => {
  try {
    await db.collection("columns").doc(id).delete();
    return true;
  } catch (error) {
    console.log("Failed to delete column.", error);
    return false;
  }
};

/**
 * to rename column
 * @param {string} id the id of the column
 * @param {string} name new name of the column
 */
export const renameColumn = async (id: string, name: string) => {
  try {
    await db.collection("columns").doc(id).update({ name });
    return true;
  } catch (error) {
    console.log("Failed to rename column.", error);
    return false;
  }
};
