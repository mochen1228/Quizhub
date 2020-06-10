import React, { Component } from 'react'
import axios from "axios"

import {
  Grid,
  Image,
  List,
  Segment,
  Card,
  Pagination
} from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'
import { Link } from 'react-router-dom'

class ListAnimated extends Component {
  constructor(props){
    super(props)
    this.state = {
      tag: props.tag
    }


  }

  componentWillReceiveProps(props) {
    this.setState({tag: props.tag})
  }

  

  render(){
    const list = []
    console.log("TAG", this.state.tag)
    list.push(<List.Item key='1'>
      <Image avatar src='./MultiSubject.png' />
      <List.Content>
        <List.Header onClick={()=>{this.props.handleTagQuizSet("All")}}>All Quizzes</List.Header>
      </List.Content>
    </List.Item>)
    this.state.tag.map((element, index) => {
      index++;
      list.push(<List.Item key={element._id}>
          <Image avatar src={'./' + element.tag + '.png'} />
          <List.Content>
            <List.Header onClick={()=>{this.props.handleTagQuizSet(element.tag)}}>{element.tag}</List.Header>
          </List.Content>
        </List.Item>)
    })

  
    return <List 
    animated
    divided
    verticalAlign='middle'
    size='large'
    style={{marginLeft: '0.5em'}}>
        {list}
      </List>
   
    }
}


class CardQuizCard extends Component {
  constructor(props){
    super(props)
    this.state = {
      quizsets: this.props.quizsets
    }
  }

  componentWillReceiveProps(props) {
    this.setState({quizsets: props.quizsets})
  }
  render() {
    const list = []

    this.state.quizsets.map((element, index) => {
      console.log(element)
      var image_name = './MultiSubject.png'
      if (element.tag.length === 1) {
        image_name = './' + element.tag[0] + '.png'
      }
      index++;
      list.push(
      <Card key={element._id}>
        <Image src={image_name} wrapped ui={false} />
        <Card.Content>
          <Card.Header><Link to={{
            pathname:`/edit/${element._id}`,
            state: {id:element._id}
            }}>{element.name}</Link></Card.Header>
          <Card.Meta>{element.quizset.length} Questions</Card.Meta>
          {/* <Card.Meta>
            <span className='date'></span>
          </Card.Meta> */}
          {/* <Card.Description>
          </Card.Description> */}
        </Card.Content>
        {/* <Card.Content extra>
          <a>
            <Icon name='heart' />
            12 Likes
          </a>
        </Card.Content> */}
      </Card>
      )
    })
    return list
  }
}

class ExplorePage extends Component {
  constructor() {
    super()
    this.state = {
      tag:[],
      quizsets:[],
      itemsPerPage: 15,
      activePage: 1,
    }

    this.handleTagQuizSet = this.handleTagQuizSet.bind(this)
  }

  componentDidMount () {
    axios.get('http://localhost:4001/get-tags').then(res => {
      console.log(res);
      console.log(res.data);
      this.setState({tag: res.data});
      })

    axios.get('http://localhost:4001/quizset/get-all-quizset').then(res => {
    console.log(res);
    console.log(res.data);
    this.setState({quizsets: res.data});
    })
  }

  handleTagQuizSet(selectedTag) {
    if (selectedTag === "All") {
      axios.get('http://localhost:4001/quizset/get-all-quizset', {
      }).then(res => {
        this.setState({quizsets:res.data})
        this.setState({activePage:1})
      })
    } else {
      // Show specific tags
        axios.post('http://localhost:4001/quizset/get-tag-quizset', {
        tag: selectedTag
      }).then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({quizsets:res.data.quizset})
        this.setState({activePage:1})
      })
    }
  }

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

  render() {

    return <ResponsiveContainer activeItem='explore'>
      <Segment style={{ maxHeight: '100%', padding: '1em 0em' }}>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column width={3} style={{overflow:'auto'}}>
              <ListAnimated tag={this.state.tag} handleTagQuizSet={this.handleTagQuizSet}/>
            </Grid.Column>
            <Grid.Column width={13}>
              <Grid>
                <Grid.Row centered>
                  <Grid.Column width={15}>
                    <Card.Group itemsPerRow={5}>
                      <CardQuizCard
                        quizsets={
                          this.state.quizsets.slice(
                            this.state.itemsPerPage * (this.state.activePage - 1),
                            Math.min(this.state.quizsets.length, this.state.itemsPerPage * (this.state.activePage))
                          )
                        }
                      />
                    </Card.Group>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column textAlign='center'>
                  <Pagination
                    boundaryRange={0}
                    defaultActivePage={1}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={2}
                    onPageChange={this.handlePaginationChange}
                    totalPages={Math.ceil(this.state.quizsets.length / this.state.itemsPerPage)}
                  />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </ResponsiveContainer>}
}
  
  export default ExplorePage