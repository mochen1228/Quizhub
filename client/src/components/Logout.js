import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';

class LogoutPage extends Component{
  constructor(props) {
    super(props);
    localStorage.removeItem("username")

  }


  render(){
      return <Redirect to="/"></Redirect>
}}
export default LogoutPage