import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar'
import './TopNav.css';

class TopNav extends Component {
    render() {
        return (
            <Navbar bg="light" variant="light">
                <Navbar.Brand href="#home">
                <img
                    alt=""
                    src="/assets/images/Twitter-Logo.png"
                    width="53.3"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                Twitter's Stock Market Influence
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar>
        )
    }
}

export default TopNav;