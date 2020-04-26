import React, { Component } from 'react'
import {
    Grid,
    Header,
    Segment,
    Statistic,
    Button,
    Icon,
} from 'semantic-ui-react'
import RankingBar from './RankingBar'

class ResultView extends Component {
  
  render() {
    const results = []
    var numOfQuestions = Object.keys(this.props.stats).length
    console.log(this.props.quizset)
    for (let index = 0; index < numOfQuestions; index++) {
      // Push question content to render
      results.push(
          <Grid.Row style={{ maxWidth: 1200 }}>
            <Header as='h1' color='grey'>{this.props.quizset[index].content}</Header>
          </Grid.Row>
        
      )

      // Option 1 and 2
      results.push(
        <Grid.Row columns={2} style={{ maxWidth: 1000 }}>
            <Grid.Column>
              <Button fluid size='massive' color='orange'>
                <Icon link name='star outline'/>
                {this.props.quizset[index].option1}
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button fluid size='massive' color='yellow'>
                <Icon link name='heart outline'/>
                {this.props.quizset[index].option2}
              </Button>
            </Grid.Column>
        </Grid.Row>
      )
      
      // Option 3 and 4
      results.push(
        <Grid.Row  columns={2} style={{ maxWidth: 1000 }}>
          <Grid.Column>
              <Button fluid size='massive' color='blue'>
                <Icon link name='square outline'/>
                {this.props.quizset[index].option3}
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button fluid size='massive' color='teal'>
                <Icon link name='circle outline'/>
                {this.props.quizset[index].option4}
              </Button>
            </Grid.Column>
        </Grid.Row> 
      )

      // Push question stats to render
      results.push(
        <Grid.Row centered verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 800 }}>
            <Segment style={{height: '60vh'}}>
              <RankingBar data={this.props.stats[index]}/>
            </Segment>
          </Grid.Column>
        </Grid.Row>

      )
    }
    return (
      <Segment>
        <Grid centered>
          <Grid.Row verticalAlign='middle' style={{height: '10vh'}}>
            <Grid.Column width={4} textAlign='center'>
              <Statistic color='teal'>
                <Statistic.Value>40</Statistic.Value>
                <Statistic.Label>Players</Statistic.Label>
              </Statistic>
            </Grid.Column>
           
            <Grid.Column textAlign='center' width={8}>
              <Header as='h1' color='teal'>
                Quiz Completed!
                <Header.Subheader>
                  Here are the statistics
                </Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column textAlign='right' width={4}>
              <Button color='teal' onClick={this.nextQuestion}>
                Leave Game
              </Button>
            </Grid.Column>
          </Grid.Row>

          
          

        </Grid>
        <Grid centered>
            {results}
        </Grid>
      </Segment>
      
    )
  }
}

export default ResultView