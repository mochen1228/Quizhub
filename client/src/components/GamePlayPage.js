import React, { Component } from 'react'
import socketIOClient from "socket.io-client"
import ResponsiveContainer from './ResponsiveContainer'
import PreparingView from './PreparingView'
import QuestionView from './QuestionView'
import WaitingView from './WaitingView'
import AnswerView from './AnswerView'
import LobbyView from './LobbyView'
import ResultView from './ResultView'

  
class GamePlayPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Unique ID for each player. For now, it is the user's nickname
      playerID: "",
      socket: socketIOClient("localhost:4001"),
      quizsetName: "Quiz Name",
      quizNo: 0,
      gamePIN: 0,
      quizset: undefined,
      view: "lobby",
      ifSelected: false, // if player finish answering
      playerAnswer: undefined, // player selected answer
      answerStatistic: undefined,
      overallStatistic: undefined
    };

    this.handleViewChange = this.handleViewChange.bind(this);
    this.handlePlayerChoice = this.handlePlayerChoice.bind(this);
  }

  componentDidMount() {
    this.state.gamePIN = this.props.match.params.id
    // Wait for the game start signal
    this.state.socket.on("start game" + this.props.match.params.id, (quizset)=>{
      this.setState({quizset: quizset});
      this.handleViewChange('prepare');
    })
    // Wait for the show answer signal
    this.state.socket.on("show answer" + this.props.match.params.id, (answerStatistic)=>{
      this.setState({answerStatistic: answerStatistic});
      this.handleViewChange('answer');
    })
    // wait for the next quiz signal
    this.state.socket.on("next quiz" + this.props.match.params.id, (quizNo)=>{
      this.setState({
        quizNo: quizNo,
        ifSelected: false,
        playerAnswer: undefined,
        answerStatistic: undefined,
      });
      this.handleViewChange('prepare');
    })
    // wait for the show result signal
    this.state.socket.on("show result" + this.props.match.params.id, (stats)=>{
      console.log("Stats received", stats)
      this.setState({
        overallStatistic: stats
      }, () => {
        console.log(this.state.overallStatistic)
        this.handleViewChange('result');
      })
    })

  }

  handleViewChange(newView) {
    this.setState({
      view: newView
    });
    console.log("show answer" + this.props.match.params.id)
  }

  // Record player's answer and notify the backend
  handlePlayerChoice(answer) {
    console.log(answer)
    this.setState({
      ifSelected: true,
      playerAnswer: answer,
      // view: 'wait'
    });
    // TODO: emit player's answer to backend
    this.state.socket.emit('submit answer', {
      gamePIN: this.state.gamePIN,
      choice: answer
    });
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
              isHost={false}
              changeView={this.handleViewChange}
            />
          </ResponsiveContainer>
        )
      case 'prepare':
        // Counting down 3 seconds, get ready for answering quizs
        return (
          <ResponsiveContainer>
            <PreparingView
              quizsetName={this.state.quizsetName}
              quizNo={this.state.quizNo}
              changeView={this.handleViewChange}
            />
          </ResponsiveContainer>
        );
      case 'quiz':
        // show quiz content, options and timer
        return (
          <ResponsiveContainer> 
            <QuestionView
              quizsetName={this.state.quizsetName}
              quizNo={this.state.quizNo}
              quizset={this.state.quizset}
              recordAnswer={this.handlePlayerChoice}
              changeView={this.handleViewChange}
            />
          </ResponsiveContainer>
        );
      case 'wait':
        // waiting for instructor to move forward
        // after submitting the answer or time up
        return (
          <ResponsiveContainer>
            <WaitingView
              ifSelected={this.state.ifSelected}
              changeView={this.handleViewChange}
            />
          </ResponsiveContainer>
        );
      case 'answer':
        // show the correct answer and statistics
        return (
          <ResponsiveContainer>
            <AnswerView
              quizsetName={this.state.quizsetName}
              quizNo={this.state.quizNo}
              data={this.state.answerStatistic}
              quizset={this.state.quizset}
              playerAnswer={this.state.playerAnswer}
              changeView={this.handleViewChange}
            />
          </ResponsiveContainer>
        );
      case 'result':
        return (
          <ResponsiveContainer>
            <ResultView
              stats={this.state.overallStatistic}
              quizset={this.state.quizset}
            /> 
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  }
}

export default GamePlayPage