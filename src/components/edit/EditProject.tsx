/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { getProject, updateProject } from "@/utils/data";
import { useToasts } from "@/context/ToastsContext";
import { useProject } from "@/context/ProjectContext";
import Icon from "@/components/misc/IonIcon";
import { Project } from "@/types/model";

import "../create-new/AddNew.css";

type EditProjectProps = {
  project: Project;
  onModify: (ts: number) => void;
  onClose: () => void;
};

export const EditProject = ({
  project,
  onModify,
  onClose,
}: EditProjectProps) => {
  const [name, setName] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMembers, setNewMembers] = useState("");
  const [description, setDescription] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [toasts, setToasts] = useToasts();
  const [, setCurrentProject] = useProject();

  useEffect(() => {
    setName(project.name);
    setDescription(project.description);
    setTeamMembers(project.members);
  }, [project]);

  const saveProject = () => {
    if (!name) {
      showError("Project name cannot be left blank");
      return;
    }

    const members = newMembers.split(",").map((el) => el.trim());
    const editedProject = {
      name,
      members: [...members, ...teamMembers],
      description,
    };
    setFormSubmitted(true);
    updateProject(project.id, editedProject)
      .then(async (updated) => {
        if (updated) {
          if (updated) {
            const updatedDoc = await getProject(project.id);
            updatedDoc!["id"] = project.id;
            setCurrentProject(updatedDoc);
          }
          onModify(new Date().getTime());
          setToasts([
            ...toasts,
            {
              message: "Project has been updated",
              id: toasts.length,
              title: "Success",
              backgroundColor: "#47bf50",
              icon: "checkmark-circle",
            },
          ]);
        } else {
          showError("Failed to update project details");
          return;
        }
      })
      .catch(() => {
        showError("Could not update project. Some error occured.");
        return;
      });
  };

  const goBack = () => {
    onClose();
  };

  const showError = (message: string) => {
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
          <h2>Edit project details</h2>
          <div className="floating">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              placeholder="Project name"
              className="floating__input"
              autoComplete="off"
            />
            <label
              htmlFor="name"
              className="floating__label"
              data-content="Project name *"
            >
              <span className="hidden--visually">Project name</span>
            </label>
          </div>
          <div className="floating textarea">
            <textarea
              name="type"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="type"
              placeholder="Project description"
              className="floating__input"
              autoComplete="off"
            />
            <label
              htmlFor="type"
              className="floating__label"
              data-content="Project description"
            >
              <span className="hidden--visually">Project description</span>
            </label>
          </div>
          <div className="member-list">
            <span>Project Members</span>
            <div className="list">
              {teamMembers.map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </div>
          </div>
          <div className="floating">
            <input
              type="text"
              name="members"
              value={newMembers}
              onChange={(e) => setNewMembers(e.target.value)}
              id="members"
              placeholder="More members"
              className="floating__input"
              autoComplete="off"
            />
            <label
              htmlFor="members"
              className="floating__label"
              data-content="Add more members"
            >
              <span className="hidden--visually">Add more members</span>
            </label>
          </div>
          <div className="help-block">Use comma (,) as separator</div>
          <div className="form-buttons">
            <button
              type="submit"
              onClick={saveProject}
              disabled={formSubmitted}
              id="EditProject"
              className="button"
            >
              {formSubmitted ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
