import React, { Component } from 'react'
import {
    Grid,
    Header,
    Loader,
} from 'semantic-ui-react'

/**
 * Show the waiting page. Waiting for instruction.
 * Props:
 * changeView: the state lifting up handler to change view of the parent component
 * ifAnswered: if player has submit his/her answer
 */
class WaitingView extends Component {
  
  render() {
    return (
      <Grid textAlign='center' style={{ height: '90vh' }} verticalAlign='middle'>
        <Grid.Row centered>
          <Grid.Column textAlign='center' width={12}>
            <Loader active inline='centered' size='big'/>
            <Header as='h1' icon color='teal'>
              {this.props.ifAnswered
                ? "Answer Submitted!"
                : "Time's up!"
              }
              <Header.Subheader>
                Waiting for instructor to show answer...
              </Header.Subheader>
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default WaitingView