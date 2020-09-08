import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@material-ui/icons';
import Head from 'next/head';
import React, { useReducer } from 'react';
import { Badge, Container, ListGroup, ListGroupItem, Navbar, Table, UncontrolledAlert } from 'reactstrap';
import states from '../utils/us-states.json';
import provinces from '../utils/ca-provinces.json';

const initialState = [];
const ADD_STATE = 'ADD_STATE';
const REMOVE_STATE = 'REMOVE_STATE';

function reducer(state, { type, payload: abbreviation }) {
  switch (type) {
    case ADD_STATE:
      return [...state, abbreviation];
    case REMOVE_STATE:
      return [...state.filter((existingAbbreviation) => abbreviation !== existingAbbreviation)];
    default:
      throw new Error(`Unknown action: "${type}`);
  }
}

export default function Home() {
  const [activeTerritories, dispatch] = useReducer(reducer, initialState);

  function handleStateClick(abbreviation) {
    dispatch({
      type: activeTerritories.includes(abbreviation) ? REMOVE_STATE : ADD_STATE,
      payload: abbreviation,
    });
  }

  return (
    <>
      <Head>
        <title>Play the License Plate Game Online for Free</title>
        <meta
          name="description"
          content="As you spot license plates from different states throughout your trip, check the box for the state you saw!"
        />
      </Head>
      <Navbar color="primary" fixed="top" className="shadow">
        <h1 className="lead mb-0">License Plate Game!</h1>
        <div
          className="rounded-circle bg-info text-center align-items-center justify-content-center"
          style={{ height: '1.75em', width: '1.75em' }}
        >
          {activeTerritories.length}
        </div>
      </Navbar>
      <Container>
        <UncontrolledAlert className="my-3">
          <div className="lead border-bottom mb-2 pb-2">How to play</div>
          As you spot license plates from different states and provinces during your trip, check the box for the state
          you saw!
        </UncontrolledAlert>
        <div className="font-weight-bold border-bottom border-dark pb-3 mb-3 mt-4">United States</div>
        <ListGroup>
          {states.map(({ name, abbreviation }) => (
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
        {provinces.map(({ name, abbreviation }) => (
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
