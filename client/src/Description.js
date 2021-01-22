import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import './Description.css';

class Description extends Component {
    render() {
        return (
             <Container id="descContainer">
                 <Row>
                     <h4>Calculate how much a Tweet has impacted specific company's stock!</h4>
                 </Row>
             </Container>
        )
    }
}

export default Description;