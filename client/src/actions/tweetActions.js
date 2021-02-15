import { FETCH_TIMELINE, FETCH_TWEET, ANALYZE_TWEET } from './types';

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

export const analyzeTweet = (apiLink) => dispatch => {
    fetch(apiLink)
        .then(res => res.json())
        .then(entities => {
            dispatch({
                type: ANALYZE_TWEET,
                entities: entities
            });
        });
}