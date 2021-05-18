import React, { useState, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Users from "./components/users/Users";
import Search from "./components/users/Search";
import Alert from "./components/layout/Alert";
import About from "./components/pages/About";
import User from "./components/users/User";
import NotFound from "./components/pages/NotFound";
import axios from "axios";
import "./App.css";

let githubClientId;
let githubClientSecret;

if (process.env.NODE_ENV !== "production") {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Search Github Users
  const searchUsers = (text) => {
    setLoading(true);
    axios
      .get(
        `https://api.github.com/search/users?q=${text}&client_id=${githubClientId}&client_secret=${githubClientSecret}`
      )
      .then((res) => {
        setUsers(res.data.items);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Get single Github user
  const getUser = (userName) => {
    setLoading(true);
    axios
      .get(
        `https://api.github.com/users/${userName}?client_id=${githubClientId}&client_secret=${githubClientSecret}`
      )
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Get users repos
  const getUserRepos = (userName) => {
    setLoading(true);

    axios
      .get(
        `https://api.github.com/users/${userName}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`
      )
      .then((res) => {
        setRepos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Clear users from state
  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  };

  // Set Alert
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Alert alert={alert} />
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Fragment>
                  <Search
                    searchUsers={searchUsers}
                    clearUsers={clearUsers}
                    showClear={users.length > 0 ? true : false}
                    showAlert={showAlert}
                  />
                  <Users loading={loading} users={users} />
                </Fragment>
              )}
            />
            <Route exact path="/about" component={About} />
            <Route
              exact
              path="/user/:login"
              render={(props) => (
                <User
                  {...props}
                  getUser={getUser}
                  getUserRepos={getUserRepos}
                  user={user}
                  repos={repos}
                  loading={loading}
                />
              )}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
