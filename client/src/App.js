import React, { Component } from "react";
import { createStore } from 'redux';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'

import TopNav from './TopNav.js';
import Description from './Description.js';
import Search from './Search.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  render() {
    return ( 
      <div className="App">
        <TopNav />
        <Description />
        <Search />
      </div>
    )
  }
}

export default App;
