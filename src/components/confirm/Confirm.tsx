import { ConfirmState } from "@/context/ConfirmContext";
import "./Confirm.css";

type Props = {
  state: ConfirmState;
  confirmBtnText?: string;
  cancelBtnText?: string;
  onDialogClose: (e: boolean) => void;
};

export function ConfirmDialog({
  state,
  confirmBtnText = "OK",
  cancelBtnText = "Cancel",
  onDialogClose = () => {},
}: Props) {
  return (
    <div className="prompt prompt-overlay">
      <div
        className={`prompt-wrapper ${
          state.closing ? "fade-out-up" : "fade-in-down"
        }`}
      >
        <div className="prompt-content">
          <h5>{state.title}</h5>
          <p>{state.message}</p>
        </div>

        <div className="prompt-footer">
          <button className="button aux" onClick={() => onDialogClose(false)}>
            {cancelBtnText || "Cancel"}
          </button>
          <button className="button" onClick={() => onDialogClose(true)}>
            {confirmBtnText || "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
