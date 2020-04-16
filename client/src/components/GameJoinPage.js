import PropTypes from 'prop-types'
import React, { Component } from 'react'
import socketIOClient from "socket.io-client"
import { Link, Redirect} from 'react-router-dom'
import axios from "axios"
import {
  Grid,
  Icon,
  Segment,
  Button,
  Form,
  Header
} from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'


class EnterGamePinForm extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "localhost:4001",
      gamePin: "",
      nickname: "",
      redirect: false,
    };

    this.handleGamePin = this.handleGamePin.bind(this);
    this.handleNickname = this.handleNickname.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleGamePin(event) {
    this.setState({gamePin: event.target.value});
  }

  handleNickname(event) {
    this.setState({nickname: event.target.value});
  }

  addPlayer() {
    // POST to express API to add a player to current game session
    // NOTE: socket emit should be inside this function to prevent
    //    loading outdated data
    const result = axios.post('http://localhost:4001/session/add-player', {
      gamePIN: this.state.gamePin, player: this.state.nickname
    }).then(res => {
      console.log(res);
      console.log(res.data);

      const socket = socketIOClient(this.state.endpoint);

      // Signaling app.js to broadcast updated player list
      socket.emit('get player list', this.state.gamePin);
  })
  }

  handleSubmit(event) {
    // POST a new player to the API and signal the server a player
    //  just joined
    this.addPlayer()
    console.log("game pin is " + this.state.gamePin);
    console.log("nickname is " + this.state.nickname);
    var JSONstr = JSON.stringify({
      gamePin: this.state.gamePin,
      nickname: this.state.nickname
    })
    console.log(JSONstr)

    event.preventDefault();
    this.setState({redirect: true});
  }

  render() {
    if(this.state.redirect){
      console.log("Redirecting")

      return <Redirect to={`play/${this.state.gamePin}/${this.state.nickname}`} />
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Segment stacked>
          <Form.Input
            fluid icon='gamepad'
            iconPosition='left'
            placeholder='Game PIN'
            style={{marginTop: '1em'}}
            value={this.state.gamePin}
            onChange={this.handleGamePin}
          />
          <Form.Input
            fluid icon='chess'
            iconPosition='left'
            placeholder='Nickname'
            style={{marginTop: '1em'}}
            value={this.state.nickname}
            onChange={this.handleNickname}
          />
          <Button animated='fade' color='blue' fluid style={{marginTop: '1em'}} type="submit">
            <Button.Content visible>Enter Game</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow right' />
            </Button.Content>
          </Button>
          
          
          <Link to="/create">
            <Button animated='fade' fluid style={{marginTop: '1em'}}>
              <Button.Content visible>Host Game</Button.Content>
              <Button.Content hidden>
                <Icon name='arrow right' />
              </Button.Content>
            </Button>
          </Link>
        </Segment>
      </Form>
    )
  }

}

class GameJoinPage extends Component {
  render() {
    return (
      <ResponsiveContainer>
        <Segment>
          <Grid textAlign='center' style={{ height: '80vh' }} verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='grey' textAlign='center'>
                  Join A Game Using PIN
                </Header>
                <EnterGamePinForm/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </ResponsiveContainer>
    )
  }
}
// export default withRouter(GameJoinPage)
export default GameJoinPage