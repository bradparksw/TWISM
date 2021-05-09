import { FETCH_TIMELINE, FETCH_TWEET, ANALYZE_TWEET, FETCH_STOCK_CHART } from '../actions/types';

const initialState = {
    fullTweet: null,
    searchRes: null,
    entities: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_TIMELINE:
            if (action.payload == null) {
                return {
                    ...state
                };
            }
            return {
                ...state,
                searchRes: action.payload
            };
        case FETCH_TWEET:
            return {
                ...state,
                searchRes: action.payload
            }
        case ANALYZE_TWEET:
            if (state.entities == null) {
                state.entities = {}
            }
            state.entities[action.entities.id] = action.entities.symbols;
            console.log(state.entities);
            return {
                ...state
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