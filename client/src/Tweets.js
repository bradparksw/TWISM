import React, { Component } from "react";
import { TwitterTweetEmbed } from 'react-twitter-embed';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Tweets extends Component {

    render() {
      const tweets = this.props.newTweets.map(tweet => (
        <div key={tweet.id}>
          <TwitterTweetEmbed tweetId={tweet.id_str} placeholder={'loading'} />
        </div>
      ));
      console.log(tweets);
      
      return ( 
        <div className="App">
          {tweets}
        </div>
      )
    }
}

Tweets.propTypes = {
  tweets: PropTypes.array,
  newTweets: PropTypes.array
}

const mapStateToProps = state => ({
  tweets: state.tweets.items,
  newTweets: state.tweets.item
})

Tweets.defaultProps = {
  tweets: [],
  newTweets: [],
}

  
export default connect(mapStateToProps, {})(Tweets);