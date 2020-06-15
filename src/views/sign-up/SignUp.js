import React, { useEffect, useState, useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { firebaseApp } from '../../firebase/init';
import { ToastsContext } from '../../context/Toasts';

const SignUp = ({ history }) => {

  useEffect(() => {
    document.title = 'TaskForce - Sign Up'
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [toasts, setToasts] = useContext(ToastsContext);

  const handleSignUp = (e) => {

    e.preventDefault();
    if (!email || !password || !name) {
      setToasts([
        ...toasts,
        {
          id: toasts.length,
          title: 'Hey Man',
          message: 'All fields are required',
          backgroundColor: '#d9534f',
          icon: 'warning'
        }
      ]);
      return;
    }

    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const user = firebaseApp.auth().currentUser;
        user
          .updateProfile({ displayName: name })
          .then(() => {
            setToasts([
              ...toasts,
              {
                id: toasts.length,
                title: 'Oh Yes',
                message: 'Signed up successfully.',
                backgroundColor: '#5cb85c',
                icon: 'checkmark-circle'
              }
            ]);
            history.push('/');
          })
          .catch((err) => {
            throw Error(err);
          });
      })
      .catch((err) => {
        // console.log(err);
        handleError(err);
      });
  }

  const handleError = error => {
    setToasts([
      ...toasts,
      {
        id: toasts.length,
        title: 'Oh No',
        message: error.message,
        backgroundColor: '#d9534f',
        icon: 'warning'
      }
    ]
    );
  }

  return (
    <form>
      <div>Getting started</div>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mail@example.com"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="******"
        />
      </div>
      <div>
        <button type="submit" onClick={(e) => handleSignUp(e)}>
          Sign Up
        </button>
      </div>
      <div>
        Have an account? <Link to="/login">login now</Link>.
      </div>
    </form>
  );
};

export default withRouter(SignUp);
