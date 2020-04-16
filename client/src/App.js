import React, { Component, Suspense } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage'
import ExplorePage from './components/ExplorePage'
import LoginForm from './components/LoginPage'
import CreateQuizsetPage from './components/CreateQuestionPage'
import GameJoinPage from './components/GameJoinPage'
import GameHostPage from './components/GameHostPage'
import GamePlayPage from "./components/GamePlayPage";
import LogoutPage from "./components/Logout";
import RegisterPage from "./components/RegisterPage";
function App() {
  // TODO:
  // /host should be replaced by /create, which is creating the quiz
  // After creating a quiz, it should then route to /host/:id
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route path="/explore" component={ExplorePage}/>
          <Route path="/login" component={LoginForm}/>
          <Route path="/register" component={RegisterPage}/>
          <Route path="/logout" component={LogoutPage}/>
          <Route path="/create" component={CreateQuizsetPage}/>
          <Route path="/join" component={GameJoinPage}/>
          <Route path="/host/:id" component={GameHostPage}/>
          <Route path="/play/:id" component={GamePlayPage}/>
          <Route path="/edit/:id" component={CreateQuizsetPage}/>
        </Switch>
      </Suspense>
    </Router>
  )
}

export default App;
