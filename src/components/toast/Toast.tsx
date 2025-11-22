import { useToasts } from "@/context/ToastsContext";
import "./Toast.css";

export const Toast = (props) => {
  const { position } = props;
  const [toasts, setToasts] = useToasts();

  const removeToast = (index) => {
    const remaining = toasts.filter((t) => t.id !== index);
    setToasts(remaining);
  };

  return (
    <>
      <div className={`notification-container ${position}`}>
        {toasts.map((toast, i) => (
          <div
            key={i}
            className={`notification toast ${position}`}
            style={{ backgroundColor: toast.backgroundColor }}
          >
            <button onClick={(e) => removeToast(toast.id)}>
              <ion-icon name="close"></ion-icon>
            </button>
            <div className="notification-icon">
              <ion-icon name={toast.icon}></ion-icon>
            </div>
            <div>
              <p className="notification-title">{toast.title}</p>
              <p className="notification-message">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
