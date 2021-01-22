import React, { Component } from "react";
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

  callAPI() {
    fetch("http://localhost:9000/testAPI")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res}))
      .catch(err => err);
  }

  componentDidMount() {
    this.callAPI();
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
