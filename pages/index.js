import { CheckBoxOutlineBlank, CheckBoxOutlined, Refresh } from '@material-ui/icons';
import Cookies from 'js-cookie';
import Head from 'next/head';
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Col, Container, ListGroup, ListGroupItem, Navbar, Row } from 'reactstrap';
import states from '../utils/us-states.json';
import provinces from '../utils/ca-provinces.json';

const initialState = Cookies.getJSON('activeTerritories') ?? [];
const ADD_TERRITORY = 'ADD_TERRITORY';
const REMOVE_TERRITORY = 'REMOVE_TERRITORY';
const RESET_TERRITORIES = 'RESET_TERRITORIES';

function reducer(state, { type, payload: abbreviation }) {
  switch (type) {
    case ADD_TERRITORY:
      return [...state, abbreviation];
    case REMOVE_TERRITORY:
      return [...state.filter((existingAbbreviation) => abbreviation !== existingAbbreviation)];
    case RESET_TERRITORIES:
      return [];
    default:
      throw new Error(`Unknown action: "${type}`);
  }
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTerritories, dispatch] = useReducer(reducer, initialState);

  function handleStateClick(abbreviation) {
    dispatch({
      type: activeTerritories.includes(abbreviation) ? REMOVE_TERRITORY : ADD_TERRITORY,
      payload: abbreviation,
    });
  }

  function handleResetClick() {
    dispatch({
      type: RESET_TERRITORIES,
    });
  }

  // Needed to make the previously selected territories in the cookie work ¯\_(ツ)_/¯

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Save the current state in a cookie every time a territory selection changes

  useEffect(() => {
    Cookies.set('activeTerritories', activeTerritories);
  }, [activeTerritories]);

  return (
    <>
      <Head>
        <title>Play the License Plate Game Online for Free</title>
        <meta
          name="description"
          content="No app download required! As you spot license plates from different states and provinces during your trip, check the box!"
        />
      </Head>
      <Navbar color="primary" fixed="top" className="shadow">
        <h1 className="lead mb-0">License Plate Game!</h1>
        {isMounted && activeTerritories.length > 0 && activeTerritories.length}
      </Navbar>
      <Container>
        <div className="my-3 p-3 rounded border">
          <div className="lead border-bottom mb-2 pb-2">How to play</div>
          As you spot license plates from different states and provinces during your trip, check the box!
        </div>
        <Row className="mt-3 d-flex align-items-end">
          <Col>
            <div className="font-weight-bold">United States</div>
          </Col>
          <Col xs="auto">
            <Button className="d-inline-flex align-items-center" onClick={handleResetClick}>
              <Refresh className="mr-2" />
              Reset
            </Button>
          </Col>
        </Row>
        <ListGroup className="border-top border-dark pt-3 mt-3">
          {isMounted &&
            states.map(({ name, abbreviation }) => (
              <ListGroupItem
                active={activeTerritories.includes(abbreviation)}
                onClick={() => handleStateClick(abbreviation)}
                className="d-flex align-items-center"
                key={name}
              >
                {activeTerritories.includes(abbreviation) ? <CheckBoxOutlined /> : <CheckBoxOutlineBlank />}
                <span className="ml-3">{name}</span>
              </ListGroupItem>
            ))}
        </ListGroup>
        <div className="font-weight-bold border-bottom border-dark pb-3 mb-3 mt-4">Canada</div>
        {isMounted &&
          provinces.map(({ name, abbreviation }) => (
            <ListGroupItem
              active={activeTerritories.includes(abbreviation)}
              onClick={() => handleStateClick(abbreviation)}
              className="d-flex align-items-center"
              key={name}
            >
              {activeTerritories.includes(abbreviation) ? <CheckBoxOutlined /> : <CheckBoxOutlineBlank />}
              <span className="ml-3">{name}</span>
            </ListGroupItem>
          ))}
      </Container>
      <footer className="bg-dark p-3 mt-3">
        &copy; 2020 <a href="https://ryanwalters.dev">Ryan Walters</a>
      </footer>
    </>
  );
}
