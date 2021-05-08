import { FETCH_TIMELINE, FETCH_TWEET, ANALYZE_TWEET, FETCH_STOCK_CHART } from '../actions/types';

const initialState = {
    fullTweet: null,
    searchRes: null,
    entities: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_TIMELINE:
            return {
                ...state,
                searchRes: action.payload
            };
        case FETCH_TWEET:
            return {
                ...state,
                fullTweet: action.payload
            }
        case ANALYZE_TWEET:
            return {
                ...state,
                entities: action.entities
            }
        case FETCH_STOCK_CHART:
            return {
                ...state,
                chart: action.chart
            }
        default:
            return state;    
    }
}