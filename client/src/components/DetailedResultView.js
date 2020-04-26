import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"

import {
  Grid,
  Icon,
  List,
  Segment,
  Button,
  Header,
  Label,
} from 'semantic-ui-react'
import RankingBar from './RankingBar'


class DetailedResultView extends Component {
    constructor(props) {
        super(props);
        this.state = {
          endpoint: "https://guarded-gorge-11703.herokuapp.com/",
          // quizsetID: 1,
          gamePIN: this.props.gamePIN,
          // players: [],
          // redirect: false,
          quizset: this.props.quizset,
          currentQuiz:{},
          currentQuizId: "",
          name: "",
          currentIndex: 0,
          stats: this.props.stats
        }

        this.setQuizSet = this.setQuizSet.bind(this);
        this.setQuizId = this.setQuizId.bind(this);
        this.getQuestionById = this.getQuestionById.bind(this);
        this.setQuizIndex = this.setQuizIndex.bind(this);
        
    }

    componentDidMount () {
        // this.loadQuizSet();
        this.setQuizSet();
        this.setQuizId(this.state.quizset[0]._id);
        this.setQuizIndex(1);
    }

    loadQuizSet() {
        // Loads quizset to the page
        // POST to express API to add a new game session to the DB collection
        axios.post('https://guarded-gorge-11703.herokuapp.com/quizset/get-quiz-set', {
          quizsetID: this.props.quizsetID
        }).then(res => {
          // console.log(res);
          this.setQuizSet(res.data.quizzes)
          // console.log("quizzes:", res.data.quizzes)
          this.setState({name:res.data.quizset.name})
          this.setState({tag:res.data.quizset.tag})
          })
    }

    getQuestionById(quizId) {
        console.log("getQuestionById id = " + quizId)
    
        axios.post('https://guarded-gorge-11703.herokuapp.com/quizset/get-quiz', {
          id: quizId
        }).then(res => {
          // console.log(res);
          // console.log(res.data);
          if (res.data) {
            this.setState({currentQuiz:res.data})
          } 
          return;
          })
          var quiz = {content: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          answer: "",
          time: ""}
          this.setState({currentQuiz:quiz})
         
    }

    setQuizSet (quizset) {
        this.setState({quizset: quizset})
    }

    setQuizId (id) {
        this.setState({currentQuizId: id});
        this.getQuestionById(id);
    }

    setQuizIndex (index) {
        this.setState({currentIndex: index}, () => {
        });
    }

    render() {
        return (
        <Segment style={{height: '90vh'}}>
            <Grid>
                <Grid.Row verticalAlign="middle" style={{height: '10vh'}}>
                    <Grid.Column width={4} textAlign='center'>
                    </Grid.Column>

                    <Grid.Column textAlign="center" width={8}>
                    {this.props.isHost
                    ?
                        <Header as='h2' color='teal'>
                            Quiz Completed!
                        </Header>
                    :
                        <Header as='h2' color='teal'>
                            Quiz Completed! {this.props.score} out of {this.props.quizset.length} correct!
                        </Header>
                    }
                    </Grid.Column>

                    <Grid.Column textAlign='right' width={4}>
                        <Link to={'/'}>
                            <Button color='teal'>Leave</Button>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row divided style={{height: '80vh'}}>
                    <Grid.Column width={4} style={{overflow:'auto'}}>
                        <QuestionList
                            quizset={this.state.quizset}
                            setQuizSet={this.setQuizSet}
                            setQuizId={this.setQuizId}
                            setQuizIndex={this.setQuizIndex}
                            id={this.state.currentQuizId}
                        />  
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <QuestionDetail
                            stats={this.state.stats}
                            index={this.state.currentIndex}
                            quizsetID={this.state.quizsetID}
                            setQuizSet={this.setQuizSet}
                            id={this.state.currentQuizId}
                            quiz={this.state.currentQuiz}
                            answerSet={this.props.answerSet}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
        )
    }
}

class ResultStatistic extends Component {
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
            <span>
                <Icon name={this.props.icon}/>
                {this.props.content}
            </span>

        </Segment>
      );
    }
  }

class QuestionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizset: this.props.quizset,
            // quizsetID: props.quizsetID,
            currentQuizId: this.props.id,
            // currentIndex: this.props.index
        }
    }
    componentDidMount(props) {

    }

    render() {
        const list = []

        this.state.quizset.map((element, index) => {
            index++;
            list.push(
            <List.Item key={element._id}>
                <List.Content verticalAlign='middle'>
                    <List.Header onClick={()=>{
                        this.props.setQuizId(element._id)
                        this.props.setQuizIndex(index)
                    }}>
                        Question {index}
                    </List.Header>
                    <List.Description>
                    {element.content}
                    </List.Description>
                </List.Content>
            </List.Item>
            )
        })

        return (
            <List divided verticalAlign='middle' relaxed='very'>
                {list}
            </List>
        )
    }
}

class QuestionDetail extends React.Component {
    render() {
        console.log(this.props.answerSet)
        return (
        <Grid>
            <Grid.Row centered style={{ height: '10vh' }}>
                <Header as='h1' color='grey'>{this.props.quiz.content}</Header>
            </Grid.Row>

            <Grid.Row centered style={{height: '45vh'}}>
                <Grid.Column style={{ maxWidth: 800 }}>
                    <RankingBar data={this.props.stats[this.props.index - 1]}/>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row centered columns={2} style={{ maxWidth: 1000 }}>
                <Grid.Column>
                    <ResultStatistic
                        color='orange'
                        icon='star outline'
                        content={this.props.quiz.option1}
                        correct={this.props.quiz.answer === '1'}
                        selected={this.props.answerSet[this.props.index - 1] === "1"}
                    />
                </Grid.Column>
                <Grid.Column>
                    <ResultStatistic
                        color='yellow'
                        icon='heart outline'
                        content={this.props.quiz.option2}
                        correct={this.props.quiz.answer === '2'}
                        selected={this.props.answerSet[this.props.index - 1] === "2"}
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row centered columns={2} style={{ maxWidth: 1000 }}>
                <Grid.Column>
                    <ResultStatistic
                        color='blue'
                        icon='square outline'
                        content={this.props.quiz.option3}
                        correct={this.props.quiz.answer === '3'}
                        selected={this.props.answerSet[this.props.index - 1] === "3"}
                    />
                </Grid.Column>
                <Grid.Column>
                    <ResultStatistic
                        color='teal'
                        icon='circle outline'
                        content={this.props.quiz.option4}
                        correct={this.props.quiz.answer=== '4'}
                        selected={this.props.answerSet[this.props.index - 1] === "4"}
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }
}

export default DetailedResultView