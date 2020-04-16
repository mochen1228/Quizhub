import React, { Component } from 'react'
import {
    Grid,
    Segment,
    Header,
    Statistic,
    Button,
    Icon,
} from 'semantic-ui-react'

/**
 * Show the content and options of a quiz.
 * Props:
 * changeView: the state lifting up handler to change view of the parent component
 * gamePin: the game PIN for this quizset
 * quizSetName: the name of this quizset
 * quizNo: indicate the index of the incoming quiz in the quiz set
 * quizset: the whole quiz set
 * playerAnswer: player's choice
 * data: the answer statistic of this quiz, to generate a bar chart
 */
class QuestionView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: this.props.quizset[this.props.quizNo].time
    };

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // count down
  tick() {
    if (this.state.time > 0) {
      this.setState((state) => ({
        time: this.state.time - 1
      }));
    } else {
      // this.props.changeView("wait");
    }
  }

  // submit answer
  handleSubmit(value) {
    // record answer locally
    this.props.recordAnswer(value);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    var quiz = this.props.quizset[this.props.quizNo];
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
            <Grid.Column textAlign='center' width={12}>
              <Header as='h1' color='teal'>
                {this.props.quizsetName}
                <Header.Subheader>
                  Question {this.props.quizNo + 1}
                </Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column textAlign='right' width={2}>
              
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered style={{height: '20vh'}} verticalAlign='middle'>
            <Grid.Column width={12}>
              <Segment>
                <Header as='h1' color='grey' textAlign='center'>
                  {quiz.content}
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered style={{height: '40vh'}}>
            <Grid.Column>
              <Segment placeholder>
                <Header icon>
                  <Icon name='image outline' />
                  No Image Uploaded.
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Button
                fluid size='massive' color='orange'
                onClick={(e) => this.handleSubmit("1", e)}
              >
                <Icon link name='star outline'/>
                {quiz.option1}
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                fluid size='massive' color='yellow'
                onClick={(e) => this.handleSubmit("2", e)}
              >
                <Icon link name='heart outline'/>
                {quiz.option2}
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Button
                fluid size='massive' color='blue'
                onClick={(e) => this.handleSubmit("3", e)}
              >
                <Icon link name='square outline'/>
                {quiz.option3}
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                fluid size='massive' color='teal'
                onClick={(e) => this.handleSubmit("4", e)}
              >
                <Icon link name='circle outline'/>
                {quiz.option4}
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}

export default QuestionView