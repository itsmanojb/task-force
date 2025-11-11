import React, { useContext } from "react";
import { withRouter, Redirect, NavLink } from "react-router-dom";

import { ReactComponent as Logo } from "@/assets/icons/logo.svg";
import { AuthContext } from "@/context/Auth";
import "./Home.css";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/s" />;
  }

  return (
    <section>
      <nav>
        <div className="brand">
          <Logo /> Task Force
        </div>
        <div className="links">
          <NavLink to="/login" className="button inline trans">
            Login
          </NavLink>
          <NavLink to="/signup" className="button inline">
            Sign Up
          </NavLink>
        </div>
      </nav>
      <main>
        <div className="text">
          <h1>Taskforce lets you do more work in more organized way</h1>
          <p>
            Taskforce's boards, lists and cards enable you to organize and
            prioritize your projects in a fun, flexible and rewarding way.
          </p>
          <NavLink to="/signup" className="button inline">
            Sign up for free
          </NavLink>
        </div>
      </main>
    </section>
  );
};

export default withRouter(Home);
