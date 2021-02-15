import React, { Component, Fragment } from "react";
import { TwitterTweetEmbed } from 'react-twitter-embed';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import './Search.css';
import { fetchTweet, analyzeTweet } from './actions/tweetActions';

class Tweets extends Component {

  constructor(props) {
    super(props);
    this.state = {
        text: 'user',
        query: ''
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    console.log(e);
    var tweetId = e.target.id.replace("Button", "");
    var tweetStr = "";
    
    for (let i = 0; i < this.props.newTweets.length; i++) {
      if (this.props.newTweets[i].id_str == tweetId) {
        tweetStr = this.props.newTweets[i].full_text;
      }
    }

    // do in_reply_to_status_id_str to get retweet string as well by calling twitter fetchtweet api

    console.log(tweetStr);

    var apiLink = `http://localhost:9000/analyzeText/${tweetStr}`;
    this.props.analyzeTweet(apiLink);
    console.log(this.props.entities);

    // this.props.fetchTweet(apiLink);
  }

  
  render() {
    const tweets = this.props.newTweets.map(tweet => (
      <Row key={tweet.id} style={{width: "100%"}}>
        <Col id={tweet.id_str} style={{paddingLeft: "0px"}} lg="4">
            <TwitterTweetEmbed tweetId={tweet.id_str} placeholder={'loading'}/>
        </Col>
        <Col>
        <div style={{marginTop: "10px", marginBottom: "10px"}}>
          <Button id= {tweet.id_str + "Button"} style={{top: "50%"}} onClick={this.onClick}>Analyze</Button>
        </div>
        </Col>
        <Col>
          
        </Col>
      </Row>
    ));

    return ( 
      <Container className="Tweets">
        {tweets}
      </Container>
    )
  }
}

Tweets.propTypes = {
  fullTweet: PropTypes.object,
  newTweets: PropTypes.array,
  entities: PropTypes.array
}

const mapStateToProps = state => ({
  fullTweet: state.tweets.fullTweet,
  newTweets: state.tweets.searchRes,
  entities: state.tweets.companies
})

Tweets.defaultProps = {
  fullTweet: null,
  newTweets: [],
  entities: []
}

  
export default connect(mapStateToProps, {fetchTweet, analyzeTweet})(Tweets);