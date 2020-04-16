import React, { Component } from 'react'
import {
    Grid,
    Header,
    Statistic,
    Icon,
} from 'semantic-ui-react'

/**
 * Counting down for 3 seconds before showing quiz view.
 * Props:
 * changeView: the state lifting up handler to change view of the parent component
 * quizsetName: the name of this quizset
 * quizNo: indicate the index of the incoming quiz in the quiz set
 */
class PreparingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 3
    };
  }

  // count down
  tick() {
    if (this.state.timer > 0) {
      this.setState((state) => ({
        timer: state.timer - 1
      }));
    } else {
      this.props.changeView("quiz");
    }
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
    return (
      <Grid textAlign='center' style={{ height: '90vh' }} verticalAlign='bottom'>
        <Grid.Row centered>
          <Grid.Column textAlign='center' width={12}>
            <Header as='h1' icon color='teal'>
              <Icon name='rocket' />
              {this.props.quizsetName}
              <Header.Subheader>
                Question {this.props.quizNo + 1}
              </Header.Subheader>
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered style={{height: '10vh'}}>
          <Grid.Column textAlign='center' width={8}>
            <Statistic color='teal'>
              <Statistic.Label>Ready</Statistic.Label>
              {this.state.timer == 0
                ? <Statistic.Value>Go</Statistic.Value>
                : <Statistic.Value>{this.state.timer}</Statistic.Value>
              }
            </Statistic>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default PreparingView