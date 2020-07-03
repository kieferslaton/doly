import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BrowserRouter as Router } from "react-router-dom";
import { Modal } from 'semantic-ui-react'
import hero from './hero.png'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./App.css";

import TodoList from "./components/TodoList";
import TodoListMobile from "./components/TodoListMobile";
import NavBar from "./components/NavBar";
import { handleLogin, handleLogout } from "./auth";
import { FaCheck } from "react-icons/fa";

const url = "";

const useWindowSize = () => {
  const isClient = typeof window === "object";

  const getSize = () => {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  };

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    const handleResize = () => {
      setWindowSize(getSize());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const Login = ({passUser, handleLoginClose}) => {
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginUserError, setLoginUserError] = useState("");
  const [loginPassError, setLoginPassError] = useState("");

  const handleLoginUserChange = (e) => {
    setLoginUser(e.target.value.toLowerCase());
  };

  const handleLoginPassChange = (e) => {
    setLoginPass(e.target.value);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${url}/users/login`, {
        username: loginUser,
        password: loginPass,
      })
      .then((res) => {
        handleLogin(res.data);
        return axios.get(`${url}/users/`).then((res) => {
          passUser(res.data.find((user) => user.username === loginUser));
          handleLoginClose();
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setLoginUserError("");
          setLoginPassError("Incorrect Password.");
        } else if (err.response.status === 404) {
          setLoginUserError("Username not found.");
          setLoginPassError("");
        }
      });
  };

  return(
    <form
                onSubmit={handleLoginSubmit}
                className="login-form" 
              >
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="loginUsername"
                    onChange={handleLoginUserChange}
                  />
                  <small
                    className={`${loginUserError ? "" : "d-none"} form-text`}
                  >
                    Please enter a valid username.
                  </small>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="loginPassword"
                    onChange={handleLoginPassChange}
                  />
                  <small
                    className={`${loginPassError ? "" : "d-none"} form-text`}
                  >
                    Password is incorrect.
                  </small>
                </div>
                <button type="submit" className="btn btn-dark font-weight-bold">
                  Log In
                </button>
              </form>
  )
}

const Signup = ({passUser, handleSignupClose}) => {

  const [signupUser, setSignupUser] = useState("");
  const [signupPass1, setSignupPass1] = useState("");
  const [signupPass2, setSignupPass2] = useState("");
  const [signupUserError, setSignupUserError] = useState("");
  const [signupPass1Val, setSignupPass1Val] = useState({
    length: false,
    nums: false,
  });
  const [signupPass2Error, setSignupPass2Error] = useState("");

  const handleSignupPassChange = (e) => {
    if(e.target.value.length > 10){
      setSignupPass1Val({...signupPass1Val, length: true})
    }
    if(/\d/.test(e.target.value)){
      setSignupPass1Val({...signupPass1Val, nums: true})
    }
    setSignupPass1(e.target.value);
  }

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${url}/users/signup`, {
        username: signupUser.toLowerCase(),
        password: signupPass1,
        password2: signupPass2,
      })
      .then((res) => {
        console.log(res.data);
        handleLogin(res.data);
        return axios.get(`${url}/users/`).then((res) => {
          console.log(res.data);
          passUser(res.data.find((user) => user.username === signupUser.toLowerCase()));
          handleSignupClose();
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setSignupUserError("");
          setSignupPass2Error("Passwords don't match.");
        } else if (err.response.status === 400) {
          setSignupPass2Error("");
          setSignupUserError("User already exists.");
        }
      });
  };

  return (
    <form
                className="login-form" 
                onSubmit={handleSignupSubmit}
              >
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="signupUsername"
                    onChange={(e) => setSignupUser(e.target.value)}
                  />
                  <small
                    className={`${signupUserError ? "" : "d-none"} form-text`}
                  >
                    Username already taken.
                  </small>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="signupPassword1"
                    onChange={handleSignupPassChange}
                  />
                  <small>
                    Password must be at least 10 characters.  <FaCheck style={{color: 'green'}}className={signupPass1Val.length ? '' : 'd-none'}/>
                  </small><br />
                  <small>
                    Password must contain at least one number.  <FaCheck style={{color: 'green'}}className={signupPass1Val.nums ? '' : 'd-none'}/>
                  </small>
                </div>
                <div className="form-group">
                  <label>Re-enter Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="signupPassword2"
                    onChange={(e) => setSignupPass2(e.target.value)}
                  />
                  <small
                    className={`${signupPass2Error ? "" : "d-none"} form-text`}
                  >
                    Passwords don't match.
                  </small>
                </div>
                <button type="submit" className="btn btn-dark font-weight-bold">
                  Sign Up
                </button>
              </form>
  )


}

const App = () => {
  const [token, setToken] = useState(Cookies.get("token"));
  const [user, setUser] = useState("");
  const [isInbox, setIsInbox] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const size = useWindowSize();

  const setUserColor = (color) => {
    if (user) {
      axios
        .post(`${url}/users/update/${user._id}`, {
          username: user.username,
          password: user.password,
          color: color,
        })
        .then((res) => {
          return axios.get(`${url}/users/${user._id}`).then((res) => {
            setUser(res.data);
          });
        });
    }
  };

  const handleTagsToggle = () => {
    setIsInbox(!isInbox);
  };

  useEffect(() => {
      if (user) setUser(user);
  }, [user]);

  useEffect(() => {
    if (token) {
      console.log(token);
      const payload = { headers: { authorization: token } };
      axios
        .post(`${url}/users/accounts`, {}, payload)
        .then((res) => setUser(res.data))
        .catch((err) => console.log(err.status));
    }
  }, []);

  const logOut = () => {
    setUser("");
    handleLogout(token);
  };

  const passUser = (user) => {
    setUser(user)
  }

  const showLoginModal = () => setShowLogin(true);
  const showSignupModal = () => setShowSignup(true);
  const handleLoginClose = () => setShowLogin(false);
  const handleSignupClose = () => setShowSignup(false);

  if (!user) {
    return (
      <>
      <Router>
        <NavBar user={user} logOut={logOut} size={size} showLoginModal={showLoginModal} showSignupModal={showSignupModal} />
        <div className="container-fluid">
          <div className="row justify-content-center mx-3 py-3" id="hero">
            <div className="col-12 col-md-5 d-flex align-items-center">
              <div className="my-auto mx-auto text-center">
              <h1>Do <span style={{color: '#7da0f2'}}>More.</span></h1>
              <h1>Stress <span style={{color: '#4260e4'}}>Less.</span></h1>
              </div>
            </div>
            <div className="col-12 col-md-7 d-flex align-items-center p-0">
              <img className="img-fluid m-0" src={hero} />
            </div>
          </div>
          <div className="row justify-content-center text-center my-5">
            <div className="col-10 col-md-4 responsive-border mb-4 py-md-2 px-lg-2 px-xl-5">
              <h2 style={{color: "#f25252"}}>Get Stuff Done.</h2>
              <p style={{color: "#bebebe", fontSize: "1.3em"}}>Do.ly operates using the principles of GTD, a proven system to help you get more done in less time.</p>
            </div>
            <div className="col-10 col-md-4 responsive-border mb-4 py-md-2 px-lg-5">
              <h2 style={{color: "#f25252"}}>Be On Time.</h2>
              <p style={{color: "#bebebe", fontSize: "1.3em"}}>Coming soon, Do.ly's calendar feature will make sure you're on time to every appointment.</p>
            </div>
            <div className="col-10 col-md-4 responsive-border mb-4 py-md-2 px-lg-5">
              <h2 style={{color: "#f25252"}}>Work With Others.</h2>
              <p style={{color: "#bebebe", fontSize: "1.3em"}}>Coming soon, Do.ly will support shared tasks and projects so your team can be as successful as possible.</p>
            </div>
          </div>
        </div>
        <Modal size='small' open={showLogin} onClose={handleLoginClose}>
          <Modal.Header>Login</Modal.Header>
          <Modal.Content><Login passUser={passUser} handleLoginClose={handleLoginClose} /></Modal.Content>
        </Modal>
        <Modal size='small' open={showSignup} onClose={handleSignupClose}>
          <Modal.Header>Sign Up</Modal.Header>
          <Modal.Content><Signup passUser={passUser} handleSignupClose={handleSignupClose} /></Modal.Content>
        </Modal>
      </Router>
      </>
    );
  } else {
    if (size.width > 768) {
      return (
        <Router>
          <NavBar
            user={user}
            setUserColor={setUserColor}
            handleTagsToggle={handleTagsToggle}
            isInbox={isInbox}
            logOut={logOut}
            size={size}
          />
          <TodoList user={user} isInbox={isInbox} />
        </Router>
      );
    } else {
      return (
        <Router>
          <NavBar
            user={user}
            setUserColor={setUserColor}
            handleTagsToggle={handleTagsToggle}
            isInbox={isInbox}
            logOut={logOut}
            size={size}
          />
          <TodoListMobile user={user} isInbox={isInbox} />
        </Router>
      );
    }
  }
}

export default App;
