import React, { Component } from 'react'
import { Redirect} from 'react-router-dom'
import axios from "axios" 
import {
  Grid,
  Icon,
  List,
  Segment,
  Button,
  Form,
  Header,
  Dropdown, 
  Menu,
  Input,
  Image,
  Dimmer,
  Loader,
  Confirm
} from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'


const tagOptions = [
  { key: 1, value: "Arts", text: 'Arts'},
  { key: 2, value: "Astronomy", text: 'Astronomy'},
  { key: 3, value: "Biology", text: 'Biology'},
  { key: 4, value: "Chemistry", text: 'Chemistry'},
  { key: 5, value: "ComputerScience", text: 'Computer Science'},
  { key: 6, value: "Geography", text: 'Geography'},
  { key: 7, value: "History", text: 'History'},
  { key: 8, value: "Languages", text: 'Languages'},
  { key: 9, value: "Literature", text: 'Literature'},
  { key: 10, value: "Math", text: 'Math'},
  { key: 11, value: "Music", text: 'Music'},
  { key: 12, value: "Physics", text: 'Physics'},
  { key: 13, value: "Science", text: 'Science'},
  { key: 14, value: "Sport", text: 'Sport'},
  { key: 15, value: "Trivia", text: 'Trivia'},
]
class CreateQuizsetPage extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "https://guarded-gorge-11703.herokuapp.com/",
      quizsetID: "",
      gamePIN: 0,
      players: [],
      redirect: false,
      quizset:[],
      currentQuiz:{},
      currentQuizId: "",
      name: "",
      tag: [],
      AddOrEditQuiz: false,
      error: false,
      errorMsg: "",
      saved: false,
      savedMsg: ""
    }
   
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadQuizSet = this.loadQuizSet.bind(this);
    this.setQuizSet = this.setQuizSet.bind(this);
    this.setQuizId = this.setQuizId.bind(this);
    this.getQuestionById = this.getQuestionById.bind(this);
    // this.saveQuizset = this.saveQuizset.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.hiddenOrShowEditQuizForm = this.hiddenOrShowEditQuizForm.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount () {
    this.setState({quizsetID: this.props.location.state.id})
    this.loadQuizSet();
  }

  addQuestion(id) {
    axios.post('https://guarded-gorge-11703.herokuapp.com/quizset/add-question', {
      quizsetID: this.state.quizsetID
    }).then(res => {
      this.setQuizSet(res.data.quizset)
      this.setQuizId(res.data.id)
      this.setState({AddOrEditQuiz: true})
    })
  }

  handleSave() {
    if(!this.saveQuizset()) {
      return;
    }

    this.setState({saved: true, savedMsg:"Save the quiz successfully!"})
  }

  hiddenOrShowEditQuizForm(e) {
    this.setState({AddOrEditQuiz: e})
  }
  loadQuizSet() {
    console.log("Incoming ID", this.props.location.state.id)
    // Loads quizset to the page
    // POST to express API to add a new game session to the DB collection
    axios.post('https://guarded-gorge-11703.herokuapp.com/quizset/get-quiz-set', {
      quizsetID: this.props.location.state.id
    }).then(res => {
      
      if (res.data.quizzes == null || res.data.quizzes.length === 0) {
        console.log("init add new quiz ")
        this.addQuestion("")
      } else {
        this.setQuizSet(res.data.quizzes)
        this.setQuizId(res.data.quizzes[0]._id)
      }
      
      this.setState({name:res.data.quizset.name})
      this.setState({tag:res.data.quizset.tag})
      })
  }


  getQuestionById(quizId) {
    if (quizId == "") return
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
      time: "",
      picture: ""}
      this.setState({currentQuiz:quiz})
     
  }

  setQuizId (id) {
    this.setState({currentQuizId: id});
    this.getQuestionById(id);
    this.hiddenOrShowEditQuizForm(true)
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

  

  saveQuizset() {
    console.log("save quiz set")
    if (this.state.name == null || this.state.name === "") {
      this.setState({error: true, errorMsg: "Please input quizset name!"})
      return false;
    }
    if (this.state.tag  == null || this.state.tag.length === 0) {
      this.setState({error: true, errorMsg: "Please choose tag!"})
      return false;
    } 

    // POST to express API to add a new game session to the DB collection
    axios.post('https://guarded-gorge-11703.herokuapp.com/quizset/update-quizset', {
      quizsetID:this.state.quizsetID, name:this.state.name, tag: this.state.tag
    }).then(res => {
      
      })

      return true;
  }


  handleSubmit(event) {
    if (!this.saveQuizset()) {
      return
    }
    axios.post('https://guarded-gorge-11703.herokuapp.com/quizset/validate-quizset', {
      quizsetID: this.state.quizsetID
    }).then(res => {
      if (res.data.result) {
        // Create new game session and redirect to the hosting page
        axios.post('https://guarded-gorge-11703.herokuapp.com/session/create-new-session', {
          quizsetID: this.state.quizsetID
        }).then(res => {
          this.setState({gamePIN: res.data.gamePIN}, function() {
            console.log("Game PIN is " + this.state.gamePIN);
            event.preventDefault();
            this.setState({redirect: true});
          });   
        })
        return true;
      } else {
        this.setState({error: true, errorMsg: res.data.message})
        return false
      }
    })
    
  }


  render() {
    const {AddOrEditQuiz} = this.state;
    if(this.state.redirect){
      // Finish creating questions, redirecting to hosting page
      return <Redirect to={{
        pathname:`/host/${this.state.gamePIN}`,
        state: {quizsetID: this.props.location.state.id}
      }} />
    }

   
    const EditQuestion = () => {
      if (AddOrEditQuiz) {
        return <EditQuestionForm quizsetID={this.state.quizsetID} setQuizSet={this.setQuizSet} setQuizId={this.setQuizId} id={this.state.currentQuizId} quiz={this.state.currentQuiz}
        hiddenOrShowEditQuizForm={this.hiddenOrShowEditQuizForm}/>
      } 
    }
    return (
      <ResponsiveContainer>
        <Form onSubmit={this.handleSubmit}>
          <Grid columns={4} divided style={{height: 60}}>
            <Grid.Row centered verticalAlign="middle">
              <Grid.Column textAlign="center" width={4}><Header as='h2'>{this.state.name}</Header></Grid.Column>
            <Grid.Column width={4}>
            <Input
                fluid
                label="Name"
                placeholder='Add name for Quizset'
                value={this.state.name}
                onChange={e => this.setState({name: e.target.value})}/>
            </Grid.Column>
            <Grid.Column width={5}>
            <Dropdown
              placeholder='Choose the tag'
              fluid
              multiple
              search
              selection
              options={tagOptions}
              value={this.state.tag}
              onChange={(e,{value}) => 
              { this.setState({tag: value})}} 
            />

                </Grid.Column>
              {/* <Grid.Column textAlign="center" width={2}><Button primary type="button" name="save" onClick={()=>{this.saveQuizset()}}>Update</Button></Grid.Column> */}
              </Grid.Row>
          </Grid>
          
        <Segment>
          <Grid columns={2} divided style={{height: 800}}>
            <Grid.Row>
              <Grid.Column width={4} stretched>
                <Grid columns={1} >
                  <Grid.Row style={{height: 600}}>
                    <Grid.Column width={16} style={{height: 600, overflow:'auto'}}>
                      <ListFloated hiddenOrShowEditQuizForm={this.hiddenOrShowEditQuizForm} quizset={this.state.quizset} quizsetID={this.state.quizsetID} setQuizSet={this.setQuizSet} setQuizId={this.setQuizId} id={this.state.currentQuizId}/>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row textAlign='center'>
                  
                    <Grid.Column>
                    
                      <Button fluid size='large' type="button" onClick={()=>{this.addQuestion("")}}>Add Question</Button>
                      <Button fluid  size='large' style={{marginTop: '1em'}} type="button" onClick={()=>{this.handleSave()}} >
                          Save This Quiz
                        </Button>
                        <Confirm
                          open={this.state.saved}
                          content={this.state.savedMsg}
                          onCancel={()=>{this.setState({saved: false, savedMsg: ""})}}
                          onConfirm={()=>{this.setState({saved: false, savedMsg: ""})}}
                        />
                      {/* <Link to={`/host/${this.gamePIN}`}> */}
                        <Button fluid primary size='large' style={{marginTop: '1em'}} type="submit">
                          Host This Quiz
                        </Button>
                        <Confirm
                          open={this.state.error}
                          content={this.state.errorMsg}
                          onCancel={()=>{this.setState({error: false, errorMsg: ""})}}
                          onConfirm={()=>{this.setState({error: false, errorMsg: ""})}}
                        />
                      {/* </Link> */}
                     
                    </Grid.Column> 
                  </Grid.Row>
                </Grid>
                
              </Grid.Column>
              <Grid.Column width={12}>
                <Grid textAlign='center'>
                  <Grid.Row>
                    <Grid.Column>
                      {EditQuestion()}
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
    axios.post('https://guarded-gorge-11703.herokuapp.com/quizset/delete-question', {
      id: deleteId, quizsetID: this.state.quizsetID
    }).then(res => {
      // console.log(res);
      // console.log(res.data);
      this.props.setQuizSet(res.data.quizset)
      })
      
      if(this.state.currentQuizId === deleteId) {
        this.props.setQuizId("")
        this.props.hiddenOrShowEditQuizForm(false)
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
      <List.Header onClick={()=>{this.props.setQuizId(element._id)}}>Question {index}</List.Header>
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
        picture: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        answer: "",
        time: null,
        gamePIN: "",
        id: "",
        image:"",
        filename:"Upload image from your computer",
        error: false,
        errorMsg: ""
    }

    this.validateQuiz = this.validateQuiz.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.removeImage = this.removeImage.bind(this);
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
    this.setState({ quizsetID: props.quizsetID })
    this.setState({picture:props.quiz.picture})
  }

  // componentDidMount() {
  //   this.getQuestionById();
  // }

  validateQuiz() {
    
    const {content, option1, option2, option3, option4, answer, time} = this.state
    if (content == null || content === "") {
      this.setState({errorMsg: "Please input the question!"});
      this.setState({error: true});
      return true;
    }

    if (time == null || time === 0) {
      this.setState({errorMsg: "Please input the time!"});
      this.setState({error: true});
      return true;
    }
    if (option1 == null || option1 === "" || option2 == null || option2 === ""
    || option3 == null || option3 === "" || option4 == null || option4 === "") {
      this.setState({errorMsg: "Please input four options!"});
      this.setState({error: true});
      return true;
    }
    if (answer == null || answer === "") {
      this.setState({errorMsg: "Please input the correct answer!"});
      this.setState({error: true});
      return true;
    }

   
    
    return false;
  }

  uploadFiles(){
    if (this.state.image !== "") {
      const formData = new FormData()
      formData.append('image', this.state.image)
      axios.post("https://guarded-gorge-11703.herokuapp.com/quizset/upload_image", formData, {
      }).then(res => {
          this.setState({uploading: false, picture: res.data.image.filename})
          console.log(res)
      })
    }
  }

  removeImage() {
    this.setState({filename: "Upload image from your computer", image:"", picture:""})
  }

  onChange = e => {
    const file = e.target.files[0].name
    this.setState({ filename: file, image: e.target.files[0]})
  }


  saveQuestion() {
    
    console.log("QUIZSET", this.state.quizsetID)
    // console.log("game pin " + this.state.gamePIN)
    console.log("game answer " + this.state.answer)
    // POST to express API to add a new game session to the DB collection
    axios.post('https://guarded-gorge-11703.herokuapp.com/quizset/update-question', {
      question: this.state, quizsetID: this.state.quizsetID
    }).then(res => {
      this.props.setQuizSet(res.data.quizset)
      this.props.setQuizId(res.data.id)
      this.setState({id: res.data.id})
      this.props.hiddenOrShowEditQuizForm(false)
      })
  }
 
  render() {
    const{uploading, filename, picture} = this.state;
  const content = () => {
    switch(true) {
      case uploading:
        return  <Segment placeholder size='large'>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              </Segment>
      case picture != null && picture !== "":
        return  <Segment placeholder size='large' >
                <Image centered src={picture} size="medium"/>
                               <Segment.Inline> 
                                 <Button type="button" id="file" primary onClick={this.removeImage}>Remove Image</Button>
                              </Segment.Inline>
                </Segment>
      default:
        return   <Segment placeholder size='large'><Header icon>
                         <Icon name='file image outline' />
                         {filename}
                       </Header>
                       <Segment.Inline> 
                       <label for="file" class="ui icon button">
                           <i class="file icon"></i>
                           Open File</label>
                       <input type="file" id="file" name="file" hidden onChange={this.onChange}/>
                       
                       <Button type="button" id="file" primary onClick={this.uploadFiles}>Upload File</Button>
                       </Segment.Inline>
                       
                       </Segment>
                      
                       
    }
  }
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
          {content()}
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
              placeholder='Add Answer 3'
              value={this.state.option3}
              onChange={e => this.setState({option3: e.target.value})}
          />
          </Grid.Column>
          <Grid.Column>
          <Form.Input
              icon='circle outline'
              iconPosition='left'
              placeholder='Add Answer 4'
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
            <Button type="button" size='large' color='red' onClick={()=>{if (!this.validateQuiz()) this.saveQuestion()}}>Save Question</Button>
            <Confirm
              open={this.state.error}
              content={this.state.errorMsg}
              onCancel={()=>{this.setState({error: false, errorMsg: ""})}}
              onConfirm={()=>{this.setState({error: false, errorMsg: ""})}}
            />
            </Grid.Column>
       </Grid.Row>
         
    </Grid>

    
</Form>
  }
}
  
export default CreateQuizsetPage