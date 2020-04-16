import React, { Component } from 'react'
import { Button, Form, Grid, Header, Segment, Icon, Message } from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'
import { Redirect } from 'react-router-dom';
import axios from "axios"
class RegisterForm extends Component{
  
  constructor(props) {
    super(props);
    let loggedIn = false;
    this.state={
      message:"",
      loggedIn
    }
    this.submitForm = this.submitForm.bind(this)
    this.onChange = this.onChange.bind(this)
    this.createNewUser = this.createNewUser.bind(this)
  }

  createNewUser() {
    axios.post('http://localhost:4001/users/create-user', {
      user: this.state
    }).then(res => {
      if (res) {
       if (res.data && res.data.username != null) {
        localStorage.setItem("username", res.data.username);
        this.setState({
          loggedIn: true
        })
        return;
       }
      }
      this.setState({message: <Message negative>
        <Message.Header>Username already exists</Message.Header>
      </Message>})
    })
  }

  submitForm (e){
    e.preventDefault()


    const{username, password, password2, email} = this.state

    // validation!
    var testUsername = /^[a-zA-Z0-9]+$/;
    if (username == null || testUsername.test(username) === false) {
      this.setState({message: <Message negative>
        <Message.Header>Invalid username</Message.Header>
      </Message>})
      return;
    }
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(email) === false) {
      this.setState({message: <Message negative>
        <Message.Header>Invalid Email Address</Message.Header>
      </Message>})
      return;
    }  
    if (password == null || password2 == null) {
      this.setState({message: <Message negative>
        <Message.Header>Invalid password</Message.Header>
      </Message>})
      return;
    }
    if (password != password2) {
      this.setState({message: <Message negative>
        <Message.Header>Passwords are not the same</Message.Header>
      </Message>})
      return;
    }

    this.createNewUser()
   
  
  }

  onChange (e){
    this.setState({
        [e.target.name] : e.target.value
    })
    
  }
  render(){
    
    if (this.state.loggedIn) {
      return  <Redirect to='/'></Redirect>
    }
    return <ResponsiveContainer>
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='grey' textAlign='center'>
          Sign up your account
        </Header>
        <Form size='large' onSubmit={this.submitForm}>
          <Segment stacked>
            {this.state.message}
            <Form.Input
              fluid icon='user'
              iconPosition='left'
              placeholder='Username'
              name="username"
              style={{marginTop: '1em'}}
              value={this.state.username}
              onChange={this.onChange}
            />
            <Form.Input
              fluid
              icon='mail'
              iconPosition='left'
              placeholder='E-mail Address'
              name="email"
              style={{marginTop: '1em'}}
              value={this.state.email}
              onChange={this.onChange}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              name="password"
              style={{marginTop: '1em'}}
              value={this.state.password}
              onChange={this.onChange}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Confirm password'
              type='password2'
              name="password2"
              style={{marginTop: '1em'}}
              value={this.state.password2}
              onChange={this.onChange}
            />

            <Button type='submit' animated='fade' color='blue' fluid size='large' style={{marginTop: '1em'}}>
              <Button.Content visible>Register</Button.Content>
              <Button.Content hidden>
                <Icon name='arrow right' />
              </Button.Content>
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  </ResponsiveContainer>
}}
export default RegisterForm