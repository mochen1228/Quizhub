import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link, Redirect} from 'react-router-dom'
import axios from "axios"

import {
  Grid,
  Icon,
  List,
  Segment,
  Button,
  Form,
  Rating,
  Header,
  Radio,
  Dropdown, 
  Menu,
  Input,
  Label,
  Statistic
} from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'
import RankingBar from './RankingBar'


class DetailedResultView extends Component {
    constructor(props) {
        super(props);
        this.state = {
          endpoint: "localhost:4001",
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
        this.loadQuizSet();
        this.setQuizSet();
        this.setQuizId(this.state.quizset[0]._id);
        this.setQuizIndex(1);
    }

    loadQuizSet() {
        // Loads quizset to the page
        // POST to express API to add a new game session to the DB collection
        axios.post('http://localhost:4001/quizset/get-quiz-set', {
          quizsetID: this.state.quizset.quizsetID
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
    
        axios.post('http://localhost:4001/quizset/get-quiz', {
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
        <Segment>
            <Grid centered >
                
                <Grid.Row verticalAlign="middle" style={{height: '10vh'}}>
                    <Grid.Column width={4} textAlign='center'>
                    </Grid.Column>

                    <Grid.Column textAlign="center" width={8}>
                        <Header as='h2' color='teal'>
                            Quiz Completed!
                        </Header>
                    </Grid.Column>

                    <Grid.Column textAlign='right' width={4}>
                        <Button color='teal'>
                            Leave Game
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            
            <Segment>
                <Grid columns={2} divided style={{height: 1000}}>
                <Grid.Row>
                    <Grid.Column width={4} stretched>
                        <Grid columns={1} >
                        <Grid.Row style={{height: 600}}>
                            
                            <Grid.Column width={16} style={{height: 600, overflow:'auto'}}>
                                <QuestionList quizset={this.state.quizset} setQuizSet={this.setQuizSet} setQuizId={this.setQuizId} setQuizIndex={this.setQuizIndex} id={this.state.currentQuizId}/>
                            </Grid.Column>
                        </Grid.Row>
                        </Grid>    
                    </Grid.Column>

                    <Grid.Column width={12}>
                        <Grid textAlign='center'>
                        <Grid.Row>
                            <Grid.Column>
                                <QuestionDetail stats={this.state.stats} index={this.state.currentIndex} quizsetID={this.state.quizsetID} setQuizSet={this.setQuizSet} setQuizId={this.setQuizId} id={this.state.currentQuizId} quiz={this.state.currentQuiz}/>
                            </Grid.Column>
                        </Grid.Row>
                        
                        <Grid.Row style={{marginTop: '1.5em'}}>
                            
                        </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
                    
                </Grid>
            </Segment>
        </Segment>

        )
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

    // componentWillReceiveProps(props) {
    //     this.setState({ quizset: this.props.quizset })
    //     this.setState({ quizsetID: this.props.quizsetID })
    //     this.setState({ currentQuizId: this.props.id })
    //     console.log("??????", this.state.quizset)

    // }

    componentDidMount(props) {

    }

    render() {
        const list = []

        this.state.quizset.map((element, index) => {
            index++;
            list.push(<List.Item key={element._id}>

            <List.Content verticalAlign='middle'>
            <List.Header><a onClick={()=>{
                this.props.setQuizId(element._id)
                this.props.setQuizIndex(index)
            }}>Question {index}</a></List.Header>
                <List.Description>
                {element.content}
                </List.Description>
            </List.Content>
            </List.Item>)
        })

    
        return (<List divided verticalAlign='middle' relaxed='very'>
            {list}
            </List>
        )
    }
}

class QuestionDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizsetID: 0,
            // quizsetID: 
            content: "",
            // picture: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            answer: "",
            time: null,
            gamePIN: "",
            id: "",
            index: 0,
        }
        // this.saveQuestion = this.saveQuestion.bind(this);
    }

    componentWillReceiveProps(props) {
        // this.setState({ gamePIN: props.gamePIN })
        this.setState({ id: props.id })
        this.setState({ content:props.quiz.content})
        this.setState({ option1:props.quiz.option1})
        this.setState({ option2:props.quiz.option2})
        this.setState({ option3:props.quiz.option3})
        this.setState({ option4:props.quiz.option4})
        this.setState({ answer:props.quiz.answer})
        this.setState({ time:props.quiz.time})
        // console.log("my answer " + props.quiz.answer)
    
        this.setState({ quizsetID: props.quizsetID })
        this.setState({index: this.props.index})
        // console.log("Selected Index: ", this.state.index)
        // console.log(this.props.stats)

        // this.setState({ quizsetID: props.quizsetID })
    }

    render() {
        const data_1 = [
            { name: 'A', value: 30},
            { name: 'B', value: 90 },
            { name: 'C', value: 50 },
            { name: 'D', value: 40 },
          ]
        return (
        <Grid>
            <Grid.Row centered style={{ maxWidth: 1200 }}>
                <Header as='h1' color='grey'>{this.state.content}</Header>
            </Grid.Row>

            <Grid.Row centered style={{height: '60vh'}}>
                <Grid.Column style={{ maxWidth: 800 }}>
                    <RankingBar data={this.props.stats[this.state.index-1]}/>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row centered columns={2} style={{ maxWidth: 1000 }}>
                <Grid.Column>
                    <Button fluid size='massive' color='orange'>
                        <Icon link name='star outline'/>
                        {this.state.option1}
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button fluid size='massive' color='yellow'>
                        <Icon link name='heart outline'/>
                        {this.state.option2}
                    </Button>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row centered columns={2} style={{ maxWidth: 1000 }}>
                <Grid.Column>
                    <Button fluid size='massive' color='blue'>
                        <Icon link name='square outline'/>
                        {this.state.option3}
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button fluid size='massive' color='teal'>
                        <Icon link name='circle outline'/>
                        {this.state.option4}
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        )
    }
}

export default DetailedResultView