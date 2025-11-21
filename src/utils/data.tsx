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

export const addProject = async (project: Omit<Project, "id">) => {
  try {
    await db.collection("projects").add(project);
    return true;
  } catch (error) {
    console.log("Failed to add project.", error);
    return false;
  }
};

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

export const updateProject = async (id: string, project: Partial<Project>) => {
  try {
    await db.collection("projects").doc(id).update(project);
    return true;
  } catch (error) {
    console.log("Failed to update project.", error);
    return false;
  }
};

export const archiveProject = async (id: string) => {
  try {
    await db.collection("projects").doc(id).update({ archived: true });
    return true;
  } catch (error) {
    console.log("Failed to archive project.", error);
    return false;
  }
};

export const deleteProjects = async (ids: string[]) => {
  try {
    const batch = db.batch();
    ids.forEach((id) => {
      const docRef = db.collection("projects").doc(id);
      batch.delete(docRef);
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.log("Failed to delete projects.", error);
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

export const editBoard = async (id: string, board: Partial<Board>) => {
  try {
    await db.collection("boards").doc(id).update(board);
    return true;
  } catch (error) {
    console.log("Failed to edit board.", error);
    return false;
  }
};

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
    const projectId = (await getBoard(id))?.projectId;
    await db.collection("boards").doc(id).delete();
    await db
      .collection("projects")
      .doc(projectId)
      .update({
        boards: firebase.firestore.FieldValue.arrayRemove(id),
      });
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

export const updateColumn = async (id: string, column: Partial<Column>) => {
  try {
    await db.collection("columns").doc(id).update(column);
    return true;
  } catch (error) {
    return error;
  }
};

export const deleteColumn = async (id: string) => {
  try {
    await db.collection("columns").doc(id).delete();
    return true;
  } catch (error) {
    console.log("Failed to delete column.", error);
    return false;
  }
};

export const renameColumn = async (id: string, name: string) => {
  try {
    await db.collection("columns").doc(id).update({ name });
    return true;
  } catch (error) {
    console.log("Failed to rename column.", error);
    return false;
  }
};
