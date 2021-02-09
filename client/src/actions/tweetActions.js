import { FETCH_TWEETS } from './types';

export const fetchTweets = (apiLink) => dispatch => {
    fetch(apiLink)
        .then(res => res.json())
        .then(tweets => {
            dispatch({
                type: FETCH_TWEETS,
                payload: tweets
            });
        });
}