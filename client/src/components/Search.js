import React, { Component, useState } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Form from 'react-bootstrap/Form'
import './Search.css';
import $ from 'jquery';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchTimeline, fetchTweet } from '../actions/tweetActions';

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchType: 'user',
            query: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ ['query']: e.target.value})
    }

    onSelect(e) {
        this.setState({ ['searchType']: e });
        if (e == "user") {
            $('#searchBox').attr("placeholder", "Enter Twitter Username")
        } else if (e == "tweet") {
            $('#searchBox').attr("placeholder", "Enter Tweet ID") 
        } else {
            $('#searchBox').attr("placeholder", "Enter Search Keyword")  
        } 
    }

    onSubmit(e) {
        e.preventDefault();
        if (!this.state.query.length) return;
        var apiLink = `http://localhost:9000/twitter/${this.state.searchType}/${this.state.query}`;
        
        if (this.state.searchType == "user") {
            this.props.fetchTimeline(apiLink);
        } else if (this.state.searchType == "tweet") {
            this.props.fetchTweet(apiLink);
        }
    }

    render() {

        return (
            <Container id="searchContainer">
                <Row>
                    <h4 id="searchBy">Search By: </h4>
                </Row>
                <Row>
                <Tabs defaultActiveKey="user" id="uncontrolled-tab-example" onSelect={this.onSelect} value={this.state.searchType}>
                    <Tab eventKey="user" title="User">
                    </Tab>
                    <Tab eventKey="tweet" title="Tweet">
                    </Tab>
                    <Tab eventKey="keyword" title="Keyword">
                    </Tab>
                </Tabs>
                </Row>

                <Row>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Control id="searchBox" type="text" placeholder="Enter Twitter Username" onChange={this.onChange} value={this.state.query} />
                        <Button variant="primary" type="submit">
                            Search
                        </Button>
                    </Form>
                </Row>


            </Container>
        )
    }
}

Search.propTypes = {
    fetchTimeline: PropTypes.func.isRequired
};

export default connect(null, { fetchTimeline, fetchTweet })(Search);