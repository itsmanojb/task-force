import { useState } from "react";
import { addProject } from "@/utils/data";
import { useAuth } from "@/context/AuthContext";
import { useToasts } from "@/context/ToastsContext";
import Icon from "@/components/misc/IonIcon";

import "./AddNew.css";

type AddProjectProps = {
  onAdd: (ts: number) => void;
  onClose: () => void;
};

export const AddProject = ({ onAdd, onClose }: AddProjectProps) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [description, setDescription] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [toasts, setToasts] = useToasts();

  const saveProject = () => {
    if (!name) {
      showError("Project name is required");
      return;
    }

    const members = teamMembers
      .trim()
      .split(",")
      .map((el) => el.trim())
      .filter((i) => i !== "");

    const newProject = {
      manager: currentUser!.email,
      name,
      members,
      description,
      boards: [],
      pinned: false,
      archived: false,
      created: new Date().getTime(),
    };
    setFormSubmitted(true);
    addProject(newProject)
      .then((created) => {
        if (created) {
          onAdd(new Date().getTime());
        } else {
          showError("Failed to create this project");
          return;
        }
      })
      .catch(() => {
        showError("Could not add project. Some error occured.");
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
          <h2>New project</h2>
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
          <div className="floating">
            <input
              type="text"
              name="members"
              value={teamMembers}
              onChange={(e) => setTeamMembers(e.target.value)}
              id="members"
              placeholder="Add members"
              className="floating__input"
              autoComplete="off"
            />
            <label
              htmlFor="members"
              className="floating__label"
              data-content="Add members"
            >
              <span className="hidden--visually">Add members</span>
            </label>
          </div>
          <div className="help-block">Use comma (,) as separator</div>
          <div className="form-buttons">
            <button
              type="submit"
              onClick={saveProject}
              disabled={formSubmitted}
              id="CreateProject"
              className="button"
            >
              {formSubmitted ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
