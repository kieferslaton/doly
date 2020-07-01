import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import $ from "jquery";
import Popper from "popper.js";
import "bootstrap/dist/js/bootstrap.bundle";
import "./App.css";

import TodoList from "./components/TodoList";
import TodoListMobile from './components/TodoListMobile'
import NavBar from "./components/NavBar";
import { handleLogin, handleLogout } from './auth';

const url = ""

const useWindowSize = () => {
  const isClient = typeof window === 'object';

  const getSize = () => {
    return{
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    const handleResize = () => {
      setWindowSize(getSize());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize
}

function App() {
  const [token, setToken] = useState(Cookies.get('token'))
  const [user, setUser] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginUserError, setLoginUserError] = useState('');
  const [loginPassError, setLoginPassError] = useState('');
  const [signupUser, setSignupUser] = useState("");
  const [signupPass1, setSignupPass1] = useState("");
  const [signupPass2, setSignupPass2] = useState("");
  const [signupUserError, setSignupUserError] = useState("");
  const [signupPass1Error, setSignupPass1Error] = useState(false);
  const [signupPass2Error, setSignupPass2Error] = useState("");
  const [isInbox, setIsInbox] = useState(true);

  const size = useWindowSize();

  const setUserColor = (color) => {
    if(user){
    axios
      .post(`${url}/users/update/${user._id}`, {
        username: user.username,
        password: user.password,
        color: color
      })
      .then((res) => {
        return axios.get(`${url}/users/${user._id}`).then((res) => {
          setUser(res.data)
        })
      })
    }
    console.log(user);
  }

  const handleTagsToggle = () => {
    setIsInbox(!isInbox);
  }

  useEffect(() => {
    axios.get(`${url}/users/`).then((res) => {
      if(user) setUser(user);
    });
  }, [user]);

  useEffect(() => {
    if(token){
        console.log(token)
        const payload = {headers: {authorization: token}}
        axios.post(`${url}/users/accounts`, {}, payload).then(res => setUser(res.data)).catch(err => console.log(err.status))
      }
    }, [])

  const handleLoginUserChange = (e) => {
    setLoginUser(e.target.value);
  };

  const handleLoginPassChange = (e) => {
    setLoginPass(e.target.value);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    axios.post(`${url}/users/login`, {
      username: loginUser,
      password: loginPass
    }).then((res) => {
      handleLogin(res.data)
      return axios.get(`${url}/users/`).then((res) => {
        setUser(res.data.find((user) => user.username === loginUser));
      })
    }).catch(err => {
        if(err.response.status === 401) {
          setLoginUserError('')
          setLoginPassError('Incorrect Password.')
        } else if (err.response.status === 404) {
          setLoginUserError('Username not found.')
          setLoginPassError('')
        }
    })
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
          axios
            .post(`${url}/users/signup`, {
              username: signupUser,
              password: signupPass1,
              password2: signupPass2
            })
            .then((res) => {
            console.log(res.data)
            handleLogin(res.data)
            return axios.get(`${url}/users/`).then((res) => {
            console.log(res.data)
            setUser(res.data.find((user) => user.username === signupUser));
          })}).catch(err => {
            if(err.response.status === 401) {
              setSignupUserError('')
              setSignupPass2Error("Passwords don't match.")
            } else if (err.response.status === 400) {
              setSignupPass2Error('')
              setSignupUserError("User already exists.")
            }
          })
        };

  const logOut = () => {
    setUser("");
    handleLogout(token)
  };

  if (!user) {
    return (
      <Router>
        <NavBar user={user} logOut={logOut} size={size}/>
        <div className="container login-container">
          <div className="row border rounded justify-content-center p-2">
            <div className="col-10 col-md-6 text-center">
              <button
                onClick={() => setIsLogin(true)}
                className={`${isLogin ? "btn-dark" : "border border-dark"} btn w-50 font-weight-bold`}
              >
                Log In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`${isLogin ? "border border-dark" : "btn-dark"} btn w-50 font-weight-bold`}
              >
                Sign Up
              </button>
              <form
                className={`${isLogin ? "" : "d-none"} my-4`}
                onSubmit={handleLoginSubmit}
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
              <form
                className={`${isLogin ? "d-none" : ""} my-4`}
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
                    onChange={(e) => setSignupPass1(e.target.value)}
                  />
                  <small
                    className={`${signupPass1Error ? "" : "d-none"} form-text`}
                  >
                    Password must be at least 6 characters long.
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
            </div>
          </div>
        </div>
      </Router>
    );
  } else {
    if (size.width > 768){
    return (
      <Router>
        <NavBar user={user} setUserColor={setUserColor} handleTagsToggle={handleTagsToggle} isInbox={isInbox} logOut={logOut} size={size} />
        <TodoList user={user} isInbox={isInbox} />
      </Router>
    );
    } else {
      return (
        <Router>
        <NavBar user={user} setUserColor={setUserColor} handleTagsToggle={handleTagsToggle} isInbox={isInbox} logOut={logOut} size={size} />
        <TodoListMobile user={user} isInbox={isInbox} />
      </Router>
      )
    }
  }
}

export default App;
