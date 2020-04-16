import PropTypes from 'prop-types'
import React, { Component } from 'react'
import axios from "axios"

import {
  Grid,
  Image,
  Icon,
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
    this.state.tag.map((element, index) => {
      index++;
      list.push(<List.Item key={element._id}>
          {/* <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' /> */}
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
      index++;
      list.push(<Card>
        {/* <Image src={'https://react.semantic-ui.com/images/avatar/large/matthew.png'} wrapped ui={false} /> */}
        <Card.Content>
          <Card.Header><Link to={`/edit/${element._id}`}>{element.name}</Link></Card.Header>
          <Card.Meta>Quiz Number: {element.quizset.length}</Card.Meta>
          {/* <Card.Meta>
            <span className='date'></span>
          </Card.Meta> */}
          <Card.Description>
        {/* Matthew is a musician living in Nashville. */}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='heart' />
            12 Likes
          </a>
        </Card.Content>
      </Card>)
    })
    return list
  }
}

const PaginationCompact = () => (
  <Pagination
    boundaryRange={0}
    defaultActivePage={1}
    ellipsisItem={null}
    firstItem={null}
    lastItem={null}
    siblingRange={1}
    totalPages={10}
  />
)

class ExplorePage extends Component {
  constructor() {
    super()
    this.state = {
      tag:[],
      quizsets:[]
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
    axios.post('http://localhost:4001/quizset/get-tag-quizset', {
      tag: selectedTag
    }).then(res => {
      console.log(res);
      console.log(res.data);
      this.setState({quizsets:res.data.quizset})
      })
  }

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
                    <Card.Group itemsPerRow={4}>
                      <CardQuizCard quizsets={this.state.quizsets}/>
                      
                    </Card.Group>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column textAlign='center'>
                    <PaginationCompact/>
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