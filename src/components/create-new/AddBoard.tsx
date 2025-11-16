import { useState, useEffect } from "react";
import { addBoard } from "@/utils/data";
import { useAuth } from "@/context/AuthContext";
import { useToasts } from "@/context/ToastsContext";
import { Project } from "@/types/model";
import Icon from "@/components/misc/IonIcon";
import "./AddNew.css";

type AddBoardProps = {
  onAdd: (ts: number) => void;
  onClose: () => void;
};

export const AddBoard = ({ onAdd, onClose }: AddBoardProps) => {
  const { currentUser } = useAuth();

  const [project, setProject] = useState<Project>();
  const [name, setName] = useState("");
  const [teamMember, setTeamMember] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [type, setType] = useState("");

  const [toasts, setToasts] = useToasts();

  useEffect(() => {
    const project = JSON.parse(localStorage.getItem("currentProject")!);
    if (project) {
      setProject(project);
    }
  }, []);

  const saveBoard = () => {
    if (!name && teamMember.length === 0) {
      showError("Please fill mandatory (*) fields");
      return;
    }

    const newBoard = {
      name,
      type,
      user: currentUser!.email!,
      teamMembers: teamMember,
      projectId: project!.id,
      createdOn: new Date().getTime(),
    };

    setFormSubmitted(true);
    addBoard(newBoard)
      .then((created) => {
        if (created) {
          onAdd(new Date().getTime());
          setToasts([
            ...toasts,
            {
              message: "Board has been created",
              id: toasts.length,
              title: "Success",
              backgroundColor: "#47bf50",
              icon: "checkmark-circle",
            },
          ]);
        } else {
          showError("Failed to add this board");
          return;
        }
      })
      .catch(() => {
        showError("Could not add board. Some error occured.");
        return;
      });
  };

  function onSelectChange(e: any) {
    const values = [...e.target.selectedOptions].map((opt) => opt.value);
    setTeamMember(values);
  }

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
          <h2>Create a board</h2>
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
              data-content="Board's name *"
            >
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
              onChange={onSelectChange}
            >
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
              data-content="Board type (eg. Design UX)"
            >
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
              id="CreateBoard"
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
