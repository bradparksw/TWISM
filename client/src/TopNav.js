import React, { Component } from "react";
import Nav from 'react-bootstrap/Nav'
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
                <Navbar.Collapse className="justify-content-end" activeKey="/#home">
                    <Nav>
                        <Nav.Link href="#aboutUs">About</Nav.Link>
                        <Nav.Link href="#aboutUs">Contact</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default TopNav;