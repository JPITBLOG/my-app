import {applyMiddleware,compose, createStore} from 'redux';
import thunk from 'redux-thunk';

import AllReducer from './reducer';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunk)
);

const INITIAL_STATE = {
    loginUser: {
        loginDetail: {}
    },
    topic: {
        AllSelectedTopic: []
    },
    cartInfo: {
        cartItem: []
    }
}
let loggedInUser = localStorage.getItem('loggedInUser');
let selectedTopic = localStorage.getItem("selectedTopic");
let AddedcartItem = localStorage.getItem('addToCart');

if (loggedInUser || selectedTopic || AddedcartItem) {
    if (loggedInUser)
        INITIAL_STATE.loginUser= JSON.parse(loggedInUser);
    if (selectedTopic)
        INITIAL_STATE.topic.AllSelectedTopic = JSON.parse(selectedTopic);
    if (AddedcartItem)
        INITIAL_STATE.cartInfo.cartItem = JSON.parse(AddedcartItem);
}

export type AppState = ReturnType<typeof AllReducer>;

// @ts-ignore
export default createStore( AllReducer, INITIAL_STATE, enhancer);