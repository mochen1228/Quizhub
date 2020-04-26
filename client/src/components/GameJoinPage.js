import React, { Component } from 'react'
import socketIOClient from "socket.io-client"
import { Redirect} from 'react-router-dom'
import axios from "axios"
import {
  Grid,
  Icon,
  Segment,
  Button,
  Form,
  Header,
  Message
} from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'


class EnterGamePinForm extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "https://guarded-gorge-11703.herokuapp.com/",
      gamePin: "",
      nickname: "",
      newQuizsetID: "",
      redirectPlay: false,
      redirectHost: false,
      message:""
    };

    this.handleGamePin = this.handleGamePin.bind(this);
    this.handleNickname = this.handleNickname.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleHost = this.handleHost.bind(this);
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
    axios.post('https://guarded-gorge-11703.herokuapp.com/session/add-player', {
        gamePIN: this.state.gamePin, player: this.state.nickname
      }).then(res => {
        console.log(res);
        console.log(res.data);

        const socket = socketIOClient(this.state.endpoint);

        // Signaling app.js to broadcast updated player list
        socket.emit('get player list', this.state.gamePin);
    })
  }
  handleJoin(event) {
    // validate PIN and nickname
    const {nickname, gamePin} = this.state;
    if (nickname == null || nickname === "" || gamePin == null || gamePin === "") {
      this.setState({message: <Message negative>
        <Message.Header>Please input nickname and correct game PIN !</Message.Header>
      </Message>})
      return;
    } 

    axios.post('https://guarded-gorge-11703.herokuapp.com/session/validate-game', {
      gamePIN: this.state.gamePin
      }).then(res=> {
        if (res.data.result === false) {
          console.log("result " + res.data.result)
          this.setState({message: <Message negative>
            <Message.Header>Game PIN doesn't exist!</Message.Header>
          </Message>})
          return 
        }else {
          // POST a new player to the API and signal the server a player
          //  just joined
          this.addPlayer()
          // console.log("game pin is " + this.state.gamePin);
          // console.log("nickname is " + this.state.nickname);
          var JSONstr = JSON.stringify({
            gamePin: this.state.gamePin,
            nickname: this.state.nickname
          })
          console.log(JSONstr)

          event.preventDefault();
          this.setState({redirectPlay: true});
        }
      })
  
    
  }

  handleHost(event) {
    axios.post('https://guarded-gorge-11703.herokuapp.com/quizset/create-quizset', {
      }).then(res=> {
        this.setState({newQuizsetID:res.data.quizsetID})
        this.setState({redirectHost:true});
      })
  }

  render() {
    if(this.state.redirectPlay){
      console.log("Redirecting to play")

      return <Redirect to={{
        pathname:`/play/${this.state.gamePin}/${this.state.nickname}`,
        state: {nickname: this.state.nickname}
      }} />
    }

    if(this.state.redirectHost){
      console.log("Redirecting to host")
      return <Redirect to={{
        pathname:`/create`,
        state: {id: this.state.newQuizsetID}
      }}/>    
    }
    
    return (
      <Segment stacked>
        <Form onSubmit={this.handleJoin}>
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
          {this.state.message}
          <Button animated='fade' color='blue' fluid style={{marginTop: '1em'}} type="submit">
            <Button.Content visible>Join Game</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow right' />
            </Button.Content>
          </Button>
        </Form>


        <Button onClick={()=>{this.handleHost()}} animated='fade' fluid style={{marginTop: '1em'}}>
          <Button.Content visible>Create And Host</Button.Content>
          <Button.Content hidden>
            <Icon name='arrow right' />
          </Button.Content>
        </Button>


      </Segment>
    )
  }

}

class GameJoinPage extends Component {
  render() {
    return (
      <ResponsiveContainer>
        <Segment>
          <Grid textAlign='center' style={{ height: '100vh', backgroundImage: `url(${"background1.png"})` }} verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' block color='grey' textAlign='center'
                style={{
                  backgroundColor: 'rgba(255,255,255,0.6)'
                }}
                >
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