import PropTypes from 'prop-types'
import React, { Component } from 'react'
import socketIOClient from "socket.io-client";
import {
  Button,
  Container,
  Header,
  Icon,
  Segment,
} from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'


/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as='h1'
      content='Quizhub'
      inverted 
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='A game-based learning web application'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <Button primary size='huge' href='/join'>
      Get Started
      <Icon name='right arrow' />
    </Button>
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}



class HomePage extends Component {
  // constructor(props) {
  //     super(props);
  //     this.state = { apiResponse: "" };
  // }

  // callAPI() {
  //     fetch("http://localhost:8000/testAPI")
  //         .then(res => res.text())
  //         .then(res => this.setState({ apiResponse: res }));
  // }

  // componentWillMount() {
  //     this.callAPI();
  // }
  
  render() {
    return (
      <ResponsiveContainer activeItem='home'>
        <Segment
            textAlign='center'
            inverted
            style={{ minHeight: 700, padding: '1em 0em' }}
            vertical
        >
            <HomepageHeading/>
        </Segment>
      </ResponsiveContainer>
    );
  }
}

export default HomePage