import React, { Component } from 'react'
import { Button, Form, Grid, Header, Segment, Icon, Message } from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'
import { Redirect } from 'react-router-dom';
import axios from "axios"
class LoginForm extends Component{
  constructor(props) {
    super(props);
    let loggedIn = false;
    this.state={
      username:"",
      password:"",
      message:"",
      loggedIn
    }

    this.submitForm = this.submitForm.bind(this);
  }

 
  submitForm (e){
    e.preventDefault()
    axios.post('http://localhost:4001/users/user-login', {
       username: this.state.username, password: this.state.password
    }).then(res => {
       if (res.data.username == null ) {
        this.setState({message: <Message negative>
          <Message.Header>Invalid password or username</Message.Header>
        </Message>})
       } else {
        localStorage.setItem("username", res.data.username);
        this.setState({
          loggedIn: true
        })
       }
    })
    // const{username, password} = this.state
    // if (username == 'A' && password == '1') {
    //   localStorage.setItem("username", username);
    //   this.setState({
    //     loggedIn: true
    //   })
    // }
  }
  render(){

    if (this.state.loggedIn) {
      return  <Redirect to='/'></Redirect>
    }
    return <ResponsiveContainer>
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='grey' textAlign='center'>
          Log-in to your account
        </Header>
        <Form size='large' onSubmit={this.submitForm}>
          <Segment stacked>
          {this.state.message}
            {/* <Button animated='fade' color='facebook' fluid size='large' style={{marginTop: '1em'}}>
              <Button.Content visible>
                <Icon name='facebook' /> Log in with Facebook
              </Button.Content>
              <Button.Content hidden>
                <Icon name='arrow right' />
              </Button.Content>
            </Button>
            <Button animated='fade' color='google plus' fluid size='large' style={{marginTop: '1em'}}>
              <Button.Content visible>
                <Icon name='google plus' /> Log in with Google
              </Button.Content>
              <Button.Content hidden>
                <Icon name='arrow right' />
              </Button.Content>
            </Button> */}
            <Form.Input
              fluid icon='user'
              iconPosition='left'
              placeholder='Username'
              style={{marginTop: '1em'}}
              value={this.state.username}
              onChange={e => this.setState({username: e.target.value})}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              style={{marginTop: '1em'}}
              value={this.state.password}
              onChange={e => this.setState({password: e.target.value})}
            />
            <Button type='submit' animated='fade' color='blue' fluid size='large' style={{marginTop: '1em'}}>
              <Button.Content visible>Log in</Button.Content>
              <Button.Content hidden>
                <Icon name='arrow right' />
              </Button.Content>
            </Button>
            <Button as='a' href="/register" animated='fade' fluid size='large' style={{marginTop: '1em'}}>
              <Button.Content visible>
                New to us?
                <Icon name='arrow right' />
                Sign Up
              </Button.Content>
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
export default LoginForm