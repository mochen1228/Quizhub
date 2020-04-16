import React, { Component } from 'react'
import {
  Grid,
  Segment,
  Header,
  Statistic,
  Button,
  Icon,
  List
} from 'semantic-ui-react'

/**
 * Show all the players in the lobby with certain game PIN.
 * Props:
 * socket: the sokect to interact with backend
 * changeView: the state lifting up handler to change view of the parent component
 * gamePin: the game PIN for this quizset
 * quizsetName: the name of this quizset
 * isHost: true on GameHostPage, false on GamePlayPage
 */
class LobbyView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerList: [],
    };
    this.updatePlayerList = this.updatePlayerList.bind(this);
    this.startGame = this.startGame.bind(this);
    this.leaveGame = this.leaveGame.bind(this);
  }

  // update player playerNumber
  updatePlayerList = (newPlayerList) => {
    console.log("updatePlayerList")
    this.setState({
      playerList: newPlayerList.map(player => player.nickname),
    })
  }

  // host send start game signal to back end
  startGame(event) {
    console.log("start game pin " + this.props.gamePin);
    this.props.socket.emit('start game', this.props.gamePin);
    event.preventDefault();
  }

  // player send leave game signal to back end
  leaveGame(event) {
    console.log("leave game pin " + this.props.gamePin);
    event.preventDefault();
  }

  componentDidMount() {
    // get player list before mount
    this.props.socket.emit('get player list', this.props.gamePin);
    
    // wait for player list update
    this.props.socket.on('update player list' + this.props.gamePin, (playerList) => {
      this.updatePlayerList(playerList);
    })
  }

  render() {
    return (
      <Segment style={{height: '95vh'}}>
        <Grid centered>
          <Grid.Row verticalAlign='middle' style={{height: '10vh'}}>
            <Grid.Column width={2} textAlign='center'>
              <Statistic color='teal'>
                <Statistic.Value>{this.state.playerList.length}</Statistic.Value>
                <Statistic.Label>Players</Statistic.Label>
              </Statistic>
            </Grid.Column>
            <Grid.Column textAlign='center' width={12}>
              <Header as='h1' color='teal'>
                {this.props.quizsetName}
                <Header.Subheader>
                  Lobby {this.props.gamePin}
                </Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column textAlign='right' width={2}>
              {this.props.isHost
                ?
                  <Button color='teal' animated='fade' onClick={this.startGame}>
                    <Button.Content visible>Start</Button.Content>
                    <Button.Content hidden>
                      <Icon name='arrow right' />
                    </Button.Content>
                  </Button>
                :
                  <Button color='teal' animated='fade' onClick={this.leaveGame}>
                    <Button.Content visible>Leave</Button.Content>
                    <Button.Content hidden>
                      <Icon name='arrow right' />
                    </Button.Content>
                  </Button>
              }
            </Grid.Column>
          </Grid.Row>

          <Grid.Row centered style={{height: '20vh'}} verticalAlign='middle'>
            <Grid.Column>
              <Segment>
                {this.props.isHost
                  ?
                    <Header as='h1' color='grey' textAlign='center'>
                      Join with Game PIN: {this.props.gamePin}
                    </Header>
                  :
                    <Header as='h1' color='grey' textAlign='center'>
                      Waiting for host to start game...
                    </Header>
                }
                <Header as='h2' color='grey' textAlign='center'>
                  Players in the lobby:
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          
          <Grid.Row style={{height: '65vh'}}>
            <Grid.Column>
              <Segment size='large' style={{height: 450}}>
                <List 
                    items={this.state.playerList}
                    size='large'
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default LobbyView