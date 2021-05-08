import React, { Component, Fragment } from "react";
import { TwitterTweetEmbed } from 'react-twitter-embed';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import './Search.css';
import { fetchTweet, analyzeTweet, fetchStockChart } from './actions/tweetActions';

import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class Tweets extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataPoints1: [],
      isLoaded: null
    }

    this.onClick = this.onClick.bind(this);
    this.getCandles = this.getCandles.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.chart != prevProps.chart) {
      var dps1 = [];
      for (var i = 0; i < this.props.chart.stockCandles.c.length; i++) {
        dps1.push({
          x: new Date(this.props.chart.stockCandles.t[i] * 1000),
          y: Number(this.props.chart.stockCandles.c[i])
        });
      }
      this.setState({
        isLoaded: this.props.chart.tweetId,
        dataPoints1: dps1
      });
    }
  }

  onClick(e) {

    var tweetId = e.target.id.replace("Button", "");

    var apiLink = `http://localhost:9000/analyzeText/${tweetId}`;
    this.props.analyzeTweet(apiLink);
    
  }

  getCandles(e) {
    var props = e.target.id.split("_");
    var tweetId = props[0];
    var symbol = props[1];
    var tweeted = new Date(this.props.newTweets[tweetId]);
    var tweetedUNIX = 0;
    var startTime = 0;
    var endTime = 0;
    console.log(tweeted);
    if (tweeted.getHours() < 4) {
      startTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate() - 1, 19).getTime() / 1000;
      tweetedUNIX = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate() - 1, 20).getTime() / 1000;
      endTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), 7).getTime() / 1000;
    } else if (tweeted.getHours() < 5) {
      startTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate() - 1, 19, tweeted.getMinutes()).getTime() / 1000;
      tweetedUNIX = tweeted.getTime() / 1000;
      endTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), 7, tweeted.getMinutes()).getTime() / 1000;
    } else if (tweeted.getHours() >= 20) {
      startTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), 19).getTime() / 1000;
      tweetedUNIX = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), 20).getTime() / 1000;
      endTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate() + 1, 7).getTime() / 1000;
    } else if (tweeted.getHours() >= 17) {
      startTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), tweeted.getHours() - 1, tweeted.getMinutes()).getTime() / 1000;
      tweetedUNIX = tweeted.getTime() / 1000;
      endTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate() + 1, 7 - (20 - tweeted.getHours()), tweeted.getMinutes()).getTime() / 1000;
    } else {
      startTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), tweeted.getHours() - 1, tweeted.getMinutes()).getTime() / 1000;
      tweetedUNIX = tweeted.getTime() / 1000;
      endTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), tweeted.getHours() + 3, tweeted.getMinutes()).getTime() / 1000;
    }

    var apiLink = `http://localhost:9000/stockChart/${tweetId}/${symbol}/${startTime}/${tweetedUNIX}/${endTime}`;
    console.log(apiLink);
    this.props.fetchStockChart(apiLink);
  }

  
  render() {
    var dataSeries = [{ 
      type: "line",
      yValueFormatString: "$###0.00",
      dataPoints: this.state.dataPoints1 
    }];
		const options = {
			zoomEnabled: true,
			animationEnabled: true,
			title: {
				text: "Try Zooming - Panning"
			},
      axisY: {
				prefix: "$",
				title: "Price"
			},
			data: dataSeries  
		}

    const tweets = (!this.props.newTweets)? null : 
      Object.keys(this.props.newTweets).map(tweetId => (
        <Row key={tweetId} style={{width: "100%"}}>
          <Col id={tweetId} style={{paddingLeft: "0px"}} lg="4">
              <TwitterTweetEmbed tweetId={tweetId} placeholder={'loading'}/>
          </Col>
          <Col lg="auto">
              <div style={{marginTop: "10px", marginBottom: "10px"}}>
                <Button id= {tweetId + "Button"} style={{top: "50%"}} onClick={this.onClick}>Analyze</Button>
              </div>
              {this.props.entities.id == tweetId ? (
                  this.props.entities.symbols.map(company => (
                    <Row key={tweetId + "_" + company.symbol}>
                      <Button id={tweetId + "_" + company.symbol + "_" + "Button"} onClick={this.getCandles}>
                        {company.symbol}
                      </Button>
                    </Row>
                  ))
              ) : null}
          </Col>
          <Col>
            {(this.props.chart != null && this.props.chart.tweetId == tweetId) ? (
              <CanvasJSChart options = {options} />
            ) : null}
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
  newTweets: PropTypes.object,
  entities: PropTypes.object,
  chart: PropTypes.object
}

const mapStateToProps = state => ({
  fullTweet: state.tweets.fullTweet,
  newTweets: state.tweets.searchRes,
  entities: state.tweets.entities,
  chart: state.tweets.chart
})

Tweets.defaultProps = {
  fullTweet: null,
  newTweets: null,
  entities: null,
  chart: null
}

  
export default connect(mapStateToProps, {fetchTweet, analyzeTweet, fetchStockChart})(Tweets);