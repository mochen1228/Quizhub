import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Container,
  Header,
  Icon,
  Segment,
  Grid,
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
      color='grey'
      content='Quizhub'
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
        color: 'rgba(0,0,0,1.0)'
      }}
    />
    <Header
      as='h2'
      color='grey'
      content='A game-based learning web application'
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
        marginBottom: mobile ? '0.5em' : '1.5em',
        color: 'rgba(0,0,0,1.0)'
      }}
    />
    <Button color='grey' size='huge' href='/join'>
      Get Started
      <Icon name='right arrow' />
    </Button>
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}



class HomePage extends Component { 
  render() {
    return (
      <ResponsiveContainer activeItem='home'>
        <Grid style={{ 
              minHeight: '95vh', 
              backgroundImage: `url(${"background1.png"})`,
            }}>
          <Grid.Row>
            <Grid.Column>
              <Segment
                textAlign='center'
                inverted
                style={{ 
                  minHeight: '100vh', 
                  backgroundColor: 'rgba(255,255,255,0.6)'
                }}
                vertical
              >
                <HomepageHeading/>
              </Segment>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </ResponsiveContainer>
    );
  }
}

export default HomePage