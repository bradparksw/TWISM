import React, { Component } from "react";
import './App.css';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css'

import TopNav from './TopNav.js';
import Description from './Description.js';
import Search from './Search.js';
import Tweets from './Tweets.js';

import store from './store';

class App extends Component {
  render() {
    return ( 
      <Provider store={store}>
        <div className="App">
          <TopNav />
          <Description />
          <Search />
          <Tweets />
        </div>`
      </Provider>
    )
  }
}

export default App;
