import React, { Component } from "react";
import './App.css';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css'

import TopNav from './components/TopNav.js';
import Description from './components/Description.js';
import Search from './components/Search.js';
import Tweets from './components/Tweets.js';

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
