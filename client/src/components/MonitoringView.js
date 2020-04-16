import React, { Component } from 'react'
import {
    Grid,
    Segment,
    Header,
    Statistic,
    Button,
    Icon,
    Label
} from 'semantic-ui-react'
import PieChart from './PieChart'

/**
 * Show the correctness of an option and number of players who selected it.
 * Props:
 * icon: icon name
 * color: segment color
 * content: option content
 * correct: if it is a correct option
 * data: how many players has selected this option
 */
class OptionStatistic extends Component {
  render() {
    return (
      <Segment inverted color={this.props.color} size='massive'>
        {this.props.correct
          ? <Label attached='top left' color='green'>Correct</Label>
          : <Label attached='top left' color='red'>Wrong</Label>
        }
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <span>
                <Icon name={this.props.icon}/>
                {this.props.content}
              </span>
            </Grid.Column>
            <Grid.Column width={8} textAlign='right'>
              <span>
                {this.props.data} selected
              </span>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

/**
 * Show all the answering statistic of a quiz.
 * Handle the 'show ansewr', 'next quiz' and 'show result' function
 * Props:
 * socket: the sokect to interact with backend
 * changeView: the state lifting up handler to change view of the parent component
 * gamePIN: the game PIN for this quizset
 * quizsetName: the name of this quizset
 * quizset: the whole quiz set
 * 
 * 
 * click answer -> emit to app.js <submit result> -> 
 * app.js got answer -> emit to MonitoringView <notify host>
 */
class MonitoringView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: this.props.quizset[0].time,
      prepareTime: 5,
      quizNo: 0,
      showAnswer: false,
      answerStatistic: [
        { name: 'A', value: 0 },
        { name: 'B', value: 0 },
        { name: 'C', value: 0 },
        { name: 'D', value: 0 },
      ],
    };
    this.showAnswer = this.showAnswer.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.showResult = this.showResult.bind(this);
  }

  // count down
  tick() {
    if (this.state.prepareTime > 0) {
      this.setState((state) => ({
        prepareTime: state.prepareTime - 1
      }));
    } else if (this.state.time > 0) {
      this.setState((state) => ({
        time: state.time - 1
      }));
    }
  }

  // send show amswer signal to backend
  showAnswer(event) {
    console.log("show answer" + this.props.gamePIN)
    this.props.socket.emit('show answer', {
      gamePIN: this.props.gamePIN,
      quizNo: this.state.quizNo,
      answerStatistic: this.state.answerStatistic,
    });
    this.setState({
      showAnswer: true
    });
    event.preventDefault();
  }

  // send change quiz signal to backend
  nextQuestion(event) {
    this.props.socket.emit('next quiz', {
      gamePIN: this.props.gamePIN,
      quizNo: this.state.quizNo + 1,
    });
    this.setState((state, props) => ({
      time: props.quizset[state.quizNo + 1].time,
      prepareTime: 5,
      showAnswer: false,
      quizNo: state.quizNo + 1,
    }));

    // Reset answer stats
    this.state.answerStatistic[0].value = 0;
    this.state.answerStatistic[1].value = 0;
    this.state.answerStatistic[2].value = 0;
    this.state.answerStatistic[3].value = 0;

    
    event.preventDefault();
  }

  // All questions are done
  // Send show result signal to backend
  showResult(event) {
    this.props.socket.emit('show result', {
      gamePIN: this.props.gamePIN
    });
    // this.props.changeView("result");
    // event.preventDefault();
  }


  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
    this.props.socket.on("notify host", (info) => {
      this.state.answerStatistic[info.choice-1].value += 1;
    })

    // Listen to players' submissions of choices
    this.props.socket.on("notify host", (info) => {
      this.state.answerStatistic[info.choice-1].value += 1;
    })

    // Listen to the backend to transmit stats for the
    this.props.socket.on("show result" + this.props.gamePIN, (stats)=>{
      console.log("Stats received", stats);
      this.setState({
        overallStats: stats
      }, () => {
        this.props.setStats(stats);
        this.props.changeView("result");
      })
    })
    
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    var quiz = this.props.quizset[this.state.quizNo];
    var answerNum = this.state.answerStatistic[0].value
                  + this.state.answerStatistic[1].value
                  + this.state.answerStatistic[2].value
                  + this.state.answerStatistic[3].value;
    return (
      <Segment style={{height: '95vh'}}>
        <Grid centered>
          <Grid.Row verticalAlign='middle' style={{height: '10vh'}}>
            <Grid.Column width={2} textAlign='center'>
              <Statistic color='teal'>
                <Statistic.Value>{this.state.time}</Statistic.Value>
                <Statistic.Label>Time Left</Statistic.Label>
              </Statistic>
            </Grid.Column>
            <Grid.Column width={2} textAlign='center'>
              <Statistic color='teal'>
                <Statistic.Value>{answerNum}</Statistic.Value>
                <Statistic.Label>Answered</Statistic.Label>
              </Statistic>
            </Grid.Column>
            <Grid.Column textAlign='center' width={8}>
              <Header as='h1' color='teal'>
                {this.props.quizsetName}
                <Header.Subheader>
                  Question {this.state.quizNo + 1}
                </Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column textAlign='right' width={4}>
              {this.state.showAnswer
                ?
                  (
                    this.state.quizNo == (this.props.quizset.length - 1)
                    ?
                      <Button color='teal' onClick={this.showResult}>
                        Show Result
                      </Button>
                    :
                      <Button color='teal' onClick={this.nextQuestion}>
                        Next Question
                      </Button>
                  )
                :
                  <Button color='teal' onClick={this.showAnswer}>
                    Show Answer
                  </Button>
              }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered style={{height: '15vh'}} verticalAlign='middle'>
            <Grid.Column>
              <Segment>
                <Header as='h1' color='grey' textAlign='center'>
                  {quiz.content}
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered divided style={{height: '70vh'}} verticalAlign='middle'>
            <Grid.Column width={8}>
              <OptionStatistic
                color='orange'
                icon='star outline'
                content={quiz.option1}
                correct={quiz.answer == '1'}
                data={this.state.answerStatistic[0].value}
              />
              <OptionStatistic
                color='yellow'
                icon='heart outline'
                content={quiz.option2}
                correct={quiz.answer == '2'}
                data={this.state.answerStatistic[1].value}
              />
              <OptionStatistic
                color='blue'
                icon='square outline'
                content={quiz.option3}
                correct={quiz.answer == '3'}
                data={this.state.answerStatistic[2].value}
              />
              <OptionStatistic
                color='teal'
                icon='circle outline'
                content={quiz.option4}
                correct={quiz.answer == '4'}
                data={this.state.answerStatistic[3].value}
              />
              
            </Grid.Column>
            <Grid.Column width={8}>
              <PieChart
               data={this.state.answerStatistic}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}

export default MonitoringView