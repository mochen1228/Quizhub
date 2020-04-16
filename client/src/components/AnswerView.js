import React, { Component } from 'react'
import {
    Grid,
    Segment,
    Header,
    Button,
    Icon,
    Label
} from 'semantic-ui-react'
import RankingBar from './RankingBar'

/**
 * Show the correctness of an option and number of players who selected it.
 * Props:
 * icon: icon name
 * color: segment color
 * content: option content
 * correct: if it is a correct option
 * selected: if it is selected by player
 */
class OptionStatistic extends Component {
  render() {
    return (
      <Segment inverted color={this.props.color} size='massive'>
        {this.props.correct
          ? <Label attached='top right' color='green'>Correct</Label>
          : <Label attached='top right' color='red'>Wrong</Label>
        }
        {this.props.selected
          ? <Label attached='bottom right'>Your answer</Label>
          : <Label attached='bottom right' color={this.props.color}></Label>
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
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

/**
 * Show the content, options, correct answer and answer statistic of a quiz.
 * Props:
 * changeView: the state lifting up handler to change view of the parent component
 * gamePin: the game PIN for this quizset
 * quizsetName: the name of this quizset
 * quizNo: indicate the index of the incoming quiz in the quiz set
 * quizset: the whole quiz set
 * recordAnswer: the state lifting up handler to record player's answer in parent component
 */
class AnswerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ifCorrect: this.props.playerAnswer == 
                  this.props.quizset[this.props.quizNo].answer
    };
  }

  render() {
    var quiz = this.props.quizset[this.props.quizNo];
    return (
      <Segment style={{height: '95vh'}}>
        <Grid centered>
          <Grid.Row verticalAlign='middle' style={{height: '10vh'}}>
            <Grid.Column textAlign='center' width={12}>
              <Header as='h1' color='teal'>
                {this.props.quizsetName}
                <Header.Subheader>
                  Question {this.props.quizNo + 1}
                </Header.Subheader>
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered style={{height: '10vh'}} verticalAlign='middle'>
            <Grid.Column>
              <Segment>
                <Header as='h1' color='grey' textAlign='center'>
                  {quiz.content}
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered style={{height: '40vh'}}>
            <Grid.Column>
              <RankingBar data={this.props.data}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <OptionStatistic
                color='orange'
                icon='star outline'
                content={quiz.option1}
                correct={quiz.answer == '1'}
                selected={this.props.playerAnswer == "1"}
              />
            </Grid.Column>
            <Grid.Column>
              <OptionStatistic
                color='yellow'
                icon='heart outline'
                content={quiz.option2}
                correct={quiz.answer == '2'}
                selected={this.props.playerAnswer == "2"}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <OptionStatistic
                color='blue'
                icon='square outline'
                content={quiz.option3}
                correct={quiz.answer == '3'}
                selected={this.props.playerAnswer == "3"}
              />
            </Grid.Column>
            <Grid.Column>
              <OptionStatistic
                color='teal'
                icon='circle outline'
                content={quiz.option4}
                correct={quiz.answer == '4'}
                selected={this.props.playerAnswer == "4"}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}

export default AnswerView