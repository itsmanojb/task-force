import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { app as firebaseApp } from "@/firebase/init";
import { useAuth } from "@/context/AuthContext";
import { useToasts } from "@/context/ToastsContext";

import Image from "@/assets/login-bg.png";

const Login = () => {
  useEffect(() => {
    document.title = "Login - TaskForce";
  }, []);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [toasts, setToasts] = useToasts();

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      setToasts([
        ...toasts,
        {
          id: toasts.length,
          title: "Hey Man",
          message: "All fields are required",
          backgroundColor: "#d9534f",
          icon: "warning",
        },
      ]);
      return;
    }
    setFormSubmitted(true);

    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigate("/s");
      })
      .catch((err) => {
        setFormSubmitted(false);
        handleError(err);
      });
  };

  const handleError = (error: any) => {
    setToasts([
      ...toasts,
      {
        id: toasts.length,
        title: "Oh No",
        message: error.message,
        backgroundColor: "#d9534f",
        icon: "warning",
      },
    ]);
  };

  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/s" replace />;
  }

  return (
    <div className="login-ui">
      <div className="wrapper">
        <div className="graphics">
          <img src={Image} alt="" />
        </div>
        <div className="form-wrapper">
          <form className="form">
            <p>Continue working</p>
            <h2>Login your account</h2>

            <div className="floating">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="floating__input"
                autoComplete="off"
                spellCheck="false"
              />
              <label
                htmlFor="email"
                className="floating__label"
                data-content="Email address"
              >
                <span className="hidden--visually">Email address</span>
              </label>
            </div>

            <div className="floating">
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="floating__input"
                autoComplete="off"
              />
              <label
                htmlFor="password"
                className="floating__label"
                data-content="Password"
              >
                <span className="hidden--visually">Password</span>
              </label>
            </div>

            <div className="help-block">
              Forgot password ? <Link to="/reset-password">Reset</Link>
            </div>
            <div className="form-buttons">
              <button
                type="submit"
                className="button"
                disabled={formSubmitted}
                onClick={(e) => handleLogin(e)}
              >
                {" "}
                {formSubmitted ? "Logging In..." : "Login"}
              </button>
              <Link to="/" role="button" className="button aux">
                Cancel
              </Link>
            </div>
            <div className="help-block">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
