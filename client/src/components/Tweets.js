import React, { Component } from "react";
import { TwitterTweetEmbed } from 'react-twitter-embed';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import './tweets.css';
import { analyzeTweet, fetchStockChart } from '../actions/tweetActions';
import Form from 'react-bootstrap/Form'
import ReactPlaceholder from 'react-placeholder';

import CanvasJSReact from '../scripts/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class Tweets extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chart: {},
      symbolSearch: {}
    }

    this.onClick = this.onClick.bind(this);
    this.getCandles = this.getCandles.bind(this);
    this.manualSearch = this.manualSearch.bind(this);
    this.updateSymbolSearch = this.updateSymbolSearch.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.chart !== prevProps.chart) {
      if(this.props.chart.stockCandles == null) {
        alert("Only US Stocks are supported at the moment :(")
        return;
      }
      var dps1 = [];
      for (var i = 0; i < this.props.chart.stockCandles.c.length; i++) {
        dps1.push({
          x: new Date(this.props.chart.stockCandles.t[i] * 1000),
          y: Number(this.props.chart.stockCandles.c[i])
        });
      }

      // Binary Search to locate the data with date closest to the tweeted date

      let start = 0, end = this.props.chart.stockCandles.c.length - 1;
      while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (mid === 0 || (this.props.chart.stockCandles.t[mid] <= this.props.chart.tweetedUNIX && 
            (mid === 0 || mid === this.props.chart.stockCandles.c.length - 1 || this.props.chart.stockCandles.t[mid + 1] >= this.props.chart.tweetedUNIX))) {
              dps1[mid].indexLabel = "Time of Tweet";
              dps1[mid].indexLabelOrientation = "vertical";
              dps1[mid].indexLabelFontColor = "orangered";
              dps1[mid].markerType = "circle";
              dps1[mid].markerColor = "orangered";
              dps1[mid].markerSize = 8;
              if (mid === this.props.chart.stockCandles.c.length - 1) {
                alert("The stock market hasn't been open since the tweet. Let's wait for the stock market to open tomorrow and see what influence this tweet will have!");
              }
              break;
        } else if (this.props.chart.stockCandles.t[mid] <= this.props.chart.tweetedUNIX) {
          start = mid + 1;
        } else {
          end = mid - 1;
        }
      }

      var dataSeries = [{ 
        type: "line",
        xValueFormatString: "D'th' MMMM YYYY hh:mm tt",
        yValueFormatString: "$###0.00",
        dataPoints: dps1
      }];
      const options = {
        zoomEnabled: true,
        animationEnabled: true,
        title: {
          text: "Tweet's Influence on " + this.props.chart.symbol
        },
        axisY: {
          prefix: "$"
        },
        data: dataSeries  
      }

      let chart = {...this.state.chart};
      let currentChart = chart[this.props.chart.tweetId];
      currentChart = options;
      chart[this.props.chart.tweetId] = currentChart;
      this.setState({chart});
    }
  }

  onClick(e) {

    var tweetId = e.target.id.replace("Button", "");

    var apiLink = `http://localhost:9000/analyzeText/${tweetId}`;
    this.props.analyzeTweet(apiLink);
    
  }

  getChartTimes(tweetId) {
    var tweeted = new Date(this.props.newTweets[tweetId]);
    var tweetedUNIX = 0;
    var startTime = 0;
    var endTime = 0;
    if (tweeted.getHours() < 4) {
      startTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate() - 1, 18).getTime() / 1000;
      tweetedUNIX = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate() - 1, 20).getTime() / 1000;
      endTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), 7).getTime() / 1000;
    } else if (tweeted.getHours() < 5) {
      startTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate() - 1, 18, tweeted.getMinutes()).getTime() / 1000;
      tweetedUNIX = tweeted.getTime() / 1000;
      endTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), 7, tweeted.getMinutes()).getTime() / 1000;
    } else if (tweeted.getHours() >= 20) {
      startTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), 18).getTime() / 1000;
      tweetedUNIX = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), 20).getTime() / 1000;
      endTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate() + 1, 7).getTime() / 1000;
    } else if (tweeted.getHours() >= 17) {
      startTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), tweeted.getHours() - 2, tweeted.getMinutes()).getTime() / 1000;
      tweetedUNIX = tweeted.getTime() / 1000;
      endTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate() + 1, 7 - (20 - tweeted.getHours()), tweeted.getMinutes()).getTime() / 1000;
    } else {
      startTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), tweeted.getHours() - 2 , tweeted.getMinutes()).getTime() / 1000;
      tweetedUNIX = tweeted.getTime() / 1000;
      endTime = new Date(tweeted.getFullYear(), tweeted.getMonth(), tweeted.getDate(), tweeted.getHours() + 3, tweeted.getMinutes()).getTime() / 1000;
    }
    return {
      startTime: startTime,
      tweetedUNIX: tweetedUNIX,
      endTime: endTime
    }
  }

  getCandles(e) {
    var props = e.target.id.split("_");
    var tweetId = props[0];
    var symbol = props[1];
    
    var times = this.getChartTimes(tweetId);
    var apiLink = `http://localhost:9000/stockChart/${tweetId}/${symbol}/${times.startTime}/${times.tweetedUNIX}/${times.endTime}`;
    this.props.fetchStockChart(apiLink);
  }

  manualSearch(e) {
    e.preventDefault();
    var tweetId = e.target.id.split("_")[0];
    var symbol = this.state.symbolSearch[tweetId];
    if (!symbol.length) return;
    var times = this.getChartTimes(tweetId);
    var apiLink = `http://localhost:9000/stockChart/${tweetId}/${symbol}/${times.startTime}/${times.tweetedUNIX}/${times.endTime}`;
    this.props.fetchStockChart(apiLink);
  }

  updateSymbolSearch(e) {
    let symbolSearch = {...this.state.symbolSearch};
    let symbol = symbolSearch[e.target.id.split("_")[0]];
    symbol = e.target.value;
    symbolSearch[e.target.id.split("_")[0]] = symbol;
    this.setState({symbolSearch});
  }

  render() {
    const tweets = (!this.props.newTweets)? null : 
      Object.keys(this.props.newTweets).map(tweetId => (
        <Row key={tweetId} className="tweetRow">
          <Col id={tweetId} className="embed" lg="4">
              <TwitterTweetEmbed tweetId={tweetId} placeholder={<ReactPlaceholder type='media' rows={7} />}/>
          </Col>
          <Col xs="auto">
              {(this.props.entities && tweetId in this.props.entities) ? (
                this.props.entities[tweetId].length ? ( 
                  this.props.entities[tweetId].map(company => (
                    <div key={tweetId + "_" + company} className="symbolButtonDiv">
                      <Button id={tweetId + "_" + company + "_Button"} className="symbolButton autoGenratedButton" onClick={this.getCandles}>
                        {company}
                      </Button>
                    </div>
                  ))
                ) : (
                  "No related US stocks found. Please manually fill in the ticker symbol below."
                )
              ) : (
                <div className="symbolButtonDiv">
                  <Button id= {tweetId + "Button"} className="symbolButton automaticSearch" onClick={this.onClick}>Search for related stocks</Button>
                </div>
              )}
            <Form id={tweetId + "_SymbolSearchForm"} onSubmit={this.manualSearch}>
              <Form.Row className="align-items-center">
                <Col xs>
                  <Form.Label htmlFor="inlineFormInput" srOnly>
                    Symbol
                  </Form.Label>
                  <Form.Control
                    className="mb-2 symbolSearch"
                    id={tweetId + "_SymbolSearch"}
                    placeholder="Enter Symbol"
                    onChange={this.updateSymbolSearch}
                    value={tweetId in this.state.symbolSearch ? this.state.symbolSearch[tweetId] : ""}
                  />
                </Col>
                <Col xs>
                  <Button type="submit" className="mb-2 symbolButton">
                    Analyze
                  </Button>
                </Col>
              </Form.Row>
            </Form>
          </Col>
          <Col lg="auto">
            {(tweetId in this.state.chart) ? (
              <CanvasJSChart options = {this.state.chart[tweetId]} />
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

  
export default connect(mapStateToProps, {analyzeTweet, fetchStockChart})(Tweets);