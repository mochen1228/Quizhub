import React, { Component } from 'react'
import socketIOClient from "socket.io-client"
import ResponsiveContainer from './ResponsiveContainer'
import LobbyView from './LobbyView'
import MonitoringView from './MonitoringView'
import ResultView from './ResultView'
import axios from "axios"
import DetailedResultView from './DetailedResultView'

class GameHostPage extends Component {
  constructor() {
    super();
    this.state = {
      socket: socketIOClient("localhost:4001"),
      quizsetName: "quizset Name",
      quizset: [],
      view: "lobby",
      gamePIN: "",
      quizsetID: 1,
      overallStats: undefined
    };
    this.handleViewChange = this.handleViewChange.bind(this);
    this.createNewSession = this.createNewSession.bind(this);
    this.setOverallStats = this.setOverallStats.bind(this);
  }

  componentDidMount() {
    // wait for the game start signal
    console.log(this.props.match.params.id);
    this.state.socket.on("start game" + this.props.match.params.id, (quizset)=>{
      console.log(quizset);
      this.setState({quizset: quizset});
      this.handleViewChange('monitor');
      // this.createNewSession();
    })
  }

  createNewSession() {
    axios.post('http://localhost:4001/session/create-new-session', {
      quizsetID: this.state.quizsetID
    }).then(res => {
      this.setQuizSet(res.data.quizzes)
      this.setState({gamePIN: res.data.gamePIN});
    })
  }

  handleViewChange(newView) {
    this.setState({
      view: newView
    });
  }

  setOverallStats(stats) {
    this.setState({
      overallStats: stats
    })
  }


  render() {
    switch(this.state.view) {
      case 'lobby':
        // show all the player joining the game
        return (
          <ResponsiveContainer>
            <LobbyView
              socket={this.state.socket}
              quizsetName={this.state.quizsetName}
              gamePin={this.props.match.params.id}
              isHost={true}
              changeView={this.handleViewChange}
            />
          </ResponsiveContainer>
        )
      case 'monitor':
        // show quiz content, options and time
        return (
          <ResponsiveContainer>
            <MonitoringView
              socket={this.state.socket}
              quizsetName={this.state.quizsetName}
              gamePIN={this.props.match.params.id}
              quizset={this.state.quizset}
              changeView={this.handleViewChange}
              setStats={this.setOverallStats}
            />
          </ResponsiveContainer>
        );
      case 'result':
        return (
          <ResponsiveContainer>
            {/* <ResultView
              stats={this.state.overallStats}
              quizset={this.state.quizset}
              gamePIN={this.state.gamePIN}
            /> */}
            <DetailedResultView
              stats={this.state.overallStats}
              quizset={this.state.quizset}
              gamePIN={this.state.gamePIN}
            />
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  }
}

export default GameHostPage