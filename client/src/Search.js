import React, { Component, useState } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Form from 'react-bootstrap/Form'
import './Search.css';
import $ from 'jquery'; z

function Search() {
    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('1');

    const radios = [
        { name: 'User', value: '1' },
        { name: 'Tweet', value: '2' },
        { name: 'Keyword', value: '3' },
    ];

    const placeholder = {
        1: 'Enter Twitter Username',
        2: 'Enter Tweet ID',
        3: 'Enter Keyword'
    }

    return (
        <Container id="searchContainer">
            <Row>
                <h4 id="searchBy">Search By: </h4>
            </Row>
            <Row>
                <ButtonGroup toggle>
                    {radios.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        type="radio"
                        variant="secondary"
                        name="radio"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={(e) => {
                                setRadioValue(e.currentTarget.value)
                                $('#searchBox').attr("placeholder", placeholder[e.currentTarget.value]);
                            }
                        }
                    >
                        {radio.name}
                    </ToggleButton>
                    ))}
                </ButtonGroup>
            </Row>

            <Row>
                <Form>
                    <Form.Control id="searchBox" type="text" placeholder={placeholder[1]} />
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Row>
            
        </Container>
    )
}

export default Search;