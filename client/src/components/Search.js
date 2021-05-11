import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Form from 'react-bootstrap/Form'
import './Search.css';
import $ from 'jquery';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchTimeline, fetchTweet, fetchKeyword } from '../actions/tweetActions';

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchType: 'user',
            query: {
                'user': "",
                'tweet': "",
                'keyword': ""
            }
        };

        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        var query = this.state.query;
        if (this.state.searchType === 'user') {
            query.user = e.target.value;
        } else if (this.state.searchType === 'tweet') {
            query.tweet = e.target.value;
        } else if (this.state.searchType === 'keyword'){
            query.keyword = e.target.value;
        }
        this.setState({query})
    }

    onSelect(e) {
        this.setState({ searchType: e });
        if (e === "user") {
            $('#searchBox').attr("placeholder", "Enter Twitter Username")
        } else if (e === "tweet") {
            $('#searchBox').attr("placeholder", "Enter Tweet ID") 
        } else {
            $('#searchBox').attr("placeholder", "Enter Search Keyword")  
        }
    }

    onSubmit(e) {
        e.preventDefault();
        if (!this.state.query[this.state.searchType].length) return;
        var apiLink = `http://localhost:9000/twitter/${this.state.searchType}/${this.state.query[this.state.searchType]}`;
        console.log(apiLink);
        if (this.state.searchType === "user") {
            this.props.fetchTimeline(apiLink);
        } else if (this.state.searchType === "tweet") {
            this.props.fetchTweet(apiLink);
        } else if (this.state.searchType === "keyword") {
            this.props.fetchKeyword(apiLink);
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
                        <Form.Row className="align-items-center">
                        <Col lg="auto">
                            <Form.Control id="searchBox" type="text" placeholder="Enter Twitter Username" onChange={this.onChange} value={this.state.query[this.state.searchType]} />
                        </Col>
                        <Col xs="auto">
                            <Button variant="primary" type="submit">
                                Search
                            </Button>
                        </Col>
                        </Form.Row>
                    </Form>
                </Row>


            </Container>
        )
    }
}

Search.propTypes = {
    fetchTimeline: PropTypes.func.isRequired
};

export default connect(null, { fetchTimeline, fetchTweet, fetchKeyword })(Search);