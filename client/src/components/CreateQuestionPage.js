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
  Label
} from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'


const tagOptions = [
  { key: 1, value: "Math", text: 'Math'},
  { key: 2, value: "History", text: 'History'},
  { key: 3, value: "English", text: 'English'},
  { key: 4, value: "Science", text: 'Science'}
]
class CreateQuizsetPage extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "localhost:4001",
      quizsetID: 1,
      gamePIN: 0,
      players: [],
      redirect: false,
      quizset:[],
      currentQuiz:{},
      currentQuizId: "",
      name: "",
      tag: []
    }
   
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadQuizSet = this.loadQuizSet.bind(this);
    this.setQuizSet = this.setQuizSet.bind(this);
    this.setQuizId = this.setQuizId.bind(this);
    this.getQuestionById = this.getQuestionById.bind(this);
    // this.saveQuizset = this.saveQuizset.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
  }

  componentDidMount () {
    // axios.get('http://localhost:4001/create-new-session').then(res => {
    //   console.log(res);
    //   console.log(res.data.gamePIN);
    //       this.setState({gamePIN: res.data.gamePIN});
    //   })
    // this.setState({gamePIN: 287});
    this.loadQuizSet();
  }

  addQuestion(id) {
    this.setQuizId(id)
  }

  loadQuizSet() {
    // Loads quizset to the page
    // POST to express API to add a new game session to the DB collection
    axios.post('http://localhost:4001/quizset/get-quiz-set', {
      quizsetID: this.state.quizsetID
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

  setQuizId (id) {
    this.setState({currentQuizId: id});
    this.getQuestionById(id);
  }

  // postSession() {
  //   // POST to express API to add a new game session to the DB collection
  //   axios.post('http://localhost:4001/add-session', {
  //     gamePIN: this.state.gamePIN, players: this.players
  //   }).then(res => {
  //     // console.log(res);
  //     // console.log(res.data);
  //     })
  // }

  setQuizSet (quizset) {
    this.setState({quizset: quizset})
  }

  

  // saveQuizset() {
  //   // POST to express API to add a new game session to the DB collection
  //   axios.post('http://localhost:4001/quizset/update-quizset', {
  //     gamePIN: this.state.gamePIN, name:this.state.name, tag: this.state.tag
  //   }).then(res => {
  //     // console.log(res);
  //     })
  // }


  handleSubmit(event) {
    // Create new game session and redirect to the hosting page
    axios.post('http://localhost:4001/session/create-new-session', {
      quizsetID: this.state.quizsetID
    }).then(res => {
      this.setState({gamePIN: res.data.gamePIN}, function() {
        console.log("Game PIN is " + this.state.gamePIN);
        event.preventDefault();
        this.setState({redirect: true});
      });   
    })
  }


  render() {
    if(this.state.redirect){
      // Finish creating questions, redirecting to hosting page
      return <Redirect to={`host/${this.state.gamePIN}`} />
    }
    return (
      <ResponsiveContainer>
        <Form onSubmit={this.handleSubmit}>
          <Grid columns={4} divided style={{height: 60}}>
            <Grid.Row centered verticalAlign="middle">
              <Grid.Column textAlign="center" width={2}><Header as='h2'>QuizSet</Header></Grid.Column>
            <Grid.Column width={4}>
            <Input
                fluid
                label="Quizset Name"
                placeholder='Add name for Quizset'
                value={this.state.name}
                onChange={e => this.setState({name: e.target.value})}/>
            </Grid.Column>
            <Grid.Column width={7}>
            <Dropdown
              placeholder='Choose the tag'
              fluid
              multiple
              search
              selection
              options={tagOptions}
              value={this.state.tag}
              onChange={(e,{value}) => 
              { console.log(value)
                this.setState({tag: value})}} 
            />

                </Grid.Column>
              <Grid.Column textAlign="center" width={2}><Button primary type="button" name="save" onClick={()=>{this.saveQuizset()}}>Save Quizset</Button></Grid.Column>
              </Grid.Row>
          </Grid>
          
        <Segment>
          <Grid columns={2} divided style={{height: 750}}>
            <Grid.Row>
              <Grid.Column width={4} stretched>
                <Grid columns={1} >
                  <Grid.Row style={{height: 600}}>
                    <Grid.Column width={16} style={{height: 600, overflow:'auto'}}>
                      <ListFloated quizset={this.state.quizset} quizsetID={this.state.quizsetID} setQuizSet={this.setQuizSet} setQuizId={this.setQuizId} id={this.state.currentQuizId}/>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row textAlign='center'>
                    <Grid.Column>
                      <Button fluid size='large' type="button" onClick={()=>{this.addQuestion("")}}>Add Question</Button>
                      {/* <Link to={`/host/${this.gamePIN}`}> */}
                        <Button fluid primary size='large' style={{marginTop: '1em'}} type="submit">
                          Finish
                        </Button>
                      {/* </Link> */}
                      
                    </Grid.Column> 
                  </Grid.Row>
                </Grid>
                
              </Grid.Column>
              <Grid.Column width={12}>
                <Grid textAlign='center'>
                  <Grid.Row>
                    <Grid.Column>
                      <EditQuestionForm quizsetID={this.state.quizsetID} setQuizSet={this.setQuizSet} setQuizId={this.setQuizId} id={this.state.currentQuizId} quiz={this.state.currentQuiz}/>
                    </Grid.Column>
                  </Grid.Row>
                 
                  <Grid.Row style={{marginTop: '1.5em'}}>
                    
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            
          </Grid>
        </Segment>
        </Form>
    </ResponsiveContainer>
    )
  }

}

class ListFloated extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
        quizset: props.quizset,
        quizsetID: props.quizsetID,
        currentQuizId:props.id
    }
    this.deleteQuiz = this.deleteQuiz.bind(this);
  }


  componentWillReceiveProps(props) {
    this.setState({ quizset: props.quizset })
    this.setState({ quizsetID: props.quizsetID })
    this.setState({ currentQuizId: props.id })
  }

  deleteQuiz (deleteId) {
    console.log("quizsetID " + this.state.quizsetID)
    console.log("delete id " + deleteId)

    // Delete a Question from a quizset, then refresh the left
    // question list
    axios.post('http://localhost:4001/quizset/delete-question', {
      id: deleteId, quizsetID: this.state.quizsetID
    }).then(res => {
      // console.log(res);
      // console.log(res.data);
      this.props.setQuizSet(res.data.quizset)
      })
      
      if(this.state.currentQuizId == deleteId) {
        this.props.setQuizId("")
      }
  }

  render() {
    const list = []
    this.state.quizset.map((element, index) => {
      index++;
      list.push(<List.Item key={element._id}>
        <List.Content floated='right'>
          <Button type="button" icon='close' size='mini' color='red' onClick={()=>{this.deleteQuiz(element._id)}}/>
        </List.Content>
        <Icon name='help' />
        <List.Content verticalAlign='middle'>
      <List.Header><a onClick={()=>{this.props.setQuizId(element._id)}}>Question {index}</a></List.Header>
          <List.Description>
            {element.content}
          </List.Description>
        </List.Content>
      </List.Item>)
    })

  
    return <List divided verticalAlign='middle' relaxed='very'>
        {list}
      </List>
  

}}

const options = [
  { key: 1, value: "1", icon: 'star outline', text: 'Option 1'},
  { key: 2, value: "2", icon: 'heart outline', text: 'Option 2'},
  { key: 3, value: "3", icon: 'square outline', text: 'Option 3'},
  { key: 4, value: "4", icon: 'circle outline', text: 'Option 4'}
]

class EditQuestionForm extends React.Component { 
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
        id: ""
    }
    this.saveQuestion = this.saveQuestion.bind(this);
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
    // this.setState({ quizsetID: props.quizsetID })
  }

  // componentDidMount() {
  //   this.getQuestionById();
  // }

  

  saveQuestion() {
    console.log("QUIZSET", this.state.quizsetID)
    // console.log("game pin " + this.state.gamePIN)
    console.log("game answer " + this.state.answer)
    // POST to express API to add a new game session to the DB collection
    axios.post('http://localhost:4001/quizset/add-question', {
      question: this.state, quizsetID: this.state.quizsetID
    }).then(res => {
      // console.log(res);
      // console.log(res.data);
      // console.log(res.data.quizset)
      // console.log(res.data.id)
      this.props.setQuizSet(res.data.quizset)
      this.props.setQuizId(res.data.id)
      this.setState({id: res.data.id})
      })
  }
 
  render() {
  return <Form size='massive'>
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            fluid
            placeholder='Click to start typing your question'
            // style={{marginTop: '1em'}}
            value={this.state.content}
            onChange={e => this.setState({content: e.target.value})}
            size='massive'
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered verticalAlign='center'>
        <Grid.Column width={14}><Segment><Segment.Inline><Input
              fluid
              label="Time"
              placeholder='Add Time Limit Seconds'
              value={this.state.time}
              onChange={e => this.setState({time: e.target.value})}
          /></Segment.Inline></Segment></Grid.Column></Grid.Row>
      <Grid.Row centered verticalAlign='center' style={{height: 270}}>
        
        <Grid.Column width={14}>
          <Segment placeholder size='large'>
            <Header icon>
              <Icon name='file image outline' />
              Upload image from your computer
            </Header>
            <Segment.Inline>
              <Button primary>Upload Image</Button>
              <Button>Youtube Link</Button>
            </Segment.Inline>
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Form.Input
              fluid
              icon='star outline'
              iconPosition='left'
              placeholder='Add Answer 1'
              value={this.state.option1}
              onChange={e => this.setState({option1: e.target.value})}
          />
          </Grid.Column>
          <Grid.Column>
            <Form.Input
              fluid
              icon='heart outline'
              iconPosition='left'
              placeholder='Add Answer 2'
              value={this.state.option2}
              onChange={e => this.setState({option2: e.target.value})}
            />
            </Grid.Column>
            </Grid.Row>
      <Grid.Row columns={2}>
          <Grid.Column>
          <Form.Input
              fluid
              icon='square outline'
              iconPosition='left'
              placeholder='Add Answer 3 (Optional)'
              value={this.state.option3}
              onChange={e => this.setState({option3: e.target.value})}
          />
          </Grid.Column>
          <Grid.Column>
          <Form.Input
              icon='circle outline'
              iconPosition='left'
              placeholder='Add Answer 4 (Optional)'
              value={this.state.option4}
              onChange={e => this.setState({option4: e.target.value})}
          />
          </Grid.Column>
      </Grid.Row>
     
      <Grid.Row centered verticalAlign='center'>
         <Grid.Column width={6}>
          {/* <Label size="big">Answer</Label> */}
          <Menu compact>
            <Dropdown placeholder='Answer' options={options}  onChange={(e,{value}) => 
              { this.setState({answer: value})}} value={this.state.answer} selection />
          </Menu>
      </Grid.Column>
            <Grid.Column width={4}>
            <Button type="button" size='large' color='red' onClick={()=>{this.saveQuestion()}}>Save Question</Button>
            </Grid.Column>
       </Grid.Row>
         
    </Grid>

    
</Form>
  }
}
  
export default CreateQuizsetPage