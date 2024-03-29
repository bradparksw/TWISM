import { FETCH_TIMELINE, FETCH_TWEET, ANALYZE_TWEET, FETCH_STOCK_CHART, FETCH_KEYWORD } from './types';

export const fetchTimeline = (apiLink) => dispatch => {
    fetch(apiLink)
        .then(res => res.json())
        .then(tweets => {
            dispatch({
                type: FETCH_TIMELINE,
                payload: tweets
            });
        });
}

export const fetchTweet = (apiLink) => dispatch => {
    fetch(apiLink)
        .then(res => res.json())
        .then(tweet => {
            dispatch({
                type: FETCH_TWEET,
                payload: tweet
            });
        });
}

export const fetchKeyword = (apiLink) => dispatch => {
    fetch(apiLink)
        .then(res => res.json())
        .then(tweets => {
            dispatch({
                type: FETCH_KEYWORD,
                payload: tweets
            });
        });
}

export const analyzeTweet = (apiLink) => dispatch => {
    fetch(apiLink, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(entities => {
            dispatch({
                type: ANALYZE_TWEET,
                entities: entities
            });
        });
}

export const fetchStockChart = (apiLink) => dispatch => {
    fetch(apiLink, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(chartObj => {
            dispatch({
                type: FETCH_STOCK_CHART,
                chart: chartObj
            })
        })
}