import React, { Component } from 'react'
import socketIOClient from "socket.io-client"
import ResponsiveContainer from './ResponsiveContainer'
import LobbyView from './LobbyView'
import MonitoringView from './MonitoringView'
import axios from "axios"
import DetailedResultView from './DetailedResultView'

class GameHostPage extends Component {
  constructor() {
    super();
    this.state = {
      socket: socketIOClient("localhost:4001"),
      quizsetName: undefined,
      quizset: [],
      view: "lobby",
      gamePIN: "",
      quizsetID: "",
      overallStats: undefined
    };
    this.handleViewChange = this.handleViewChange.bind(this);
    this.createNewSession = this.createNewSession.bind(this);
    this.setOverallStats = this.setOverallStats.bind(this);
  }

  componentDidMount() {
    if (this.state.quizsetName === undefined) {
      // send enter game signal
      this.state.socket.emit('enter game', this.props.match.params.id);
    }
    // wait for quizname
    this.state.socket.on("enter game" + this.props.match.params.id, (quizname)=>{
      console.log(quizname);
      this.setState({quizsetName: quizname});
    })
    // wait for the game start signal
    this.setState({quizsetID: this.props.location.state.quizsetID})
    this.state.socket.on("start game" + this.props.match.params.id, (quizset)=>{
      console.log(quizset);
      this.setState({
        quizset: quizset,
        answerSet: new Array(quizset.length)
      });
      this.setState({gamePIN: this.props.match.params.id})
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
    console.log(this.state.quizset);
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
        // Save the stats to the database
        console.log("stats:", this.state.overallStats)
        console.log("pin:", this.state.gamePIN)

        axios.post('http://localhost:4001/session/save-history', {
          gamePIN: this.state.gamePIN,
          stats: this.state.overallStats
        }).then(res => {
        })

        return (
          <ResponsiveContainer>
            <DetailedResultView
              isHost={true}
              stats={this.state.overallStats}
              quizset={this.state.quizset}
              gamePIN={this.state.gamePIN}
              quizsetID={this.state.quizsetID}
              answerSet={this.state.answerSet}
            />
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  }
}

export default GameHostPage