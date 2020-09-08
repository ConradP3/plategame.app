import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@material-ui/icons';
import Head from 'next/head';
import React, { useReducer } from 'react';
import { Container, ListGroup, ListGroupItem, Navbar, Table, UncontrolledAlert } from 'reactstrap';
import states from '../utils/states.json';

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
  const [activeStates, dispatch] = useReducer(reducer, initialState);

  function handleStateClick(abbreviation) {
    dispatch({
      type: activeStates.includes(abbreviation) ? REMOVE_STATE : ADD_STATE,
      payload: abbreviation,
    });
  }

  return (
    <>
      <Head>
        <title>Play the License Plate Game Online</title>
      </Head>
      <Navbar color="primary">
        <div className="lead">License Plate Game!</div>
      </Navbar>
      <Container>
        <UncontrolledAlert className="my-3">
          As you spot license plates from different states (plus DC), check the box for the state you saw!
        </UncontrolledAlert>
        <Table>
          <thead>
            <tr>
              <th>Found</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            <tr className="lead">
              <td>{activeStates.length}</td>
              <td>{states.length - activeStates.length}</td>
            </tr>
          </tbody>
        </Table>
        <div className="font-weight-bold border-bottom border-dark pb-3 mb-3">Select State</div>
        <ListGroup>
          {states.map(({ name, abbreviation }) => (
            <ListGroupItem
              active={activeStates.includes(abbreviation)}
              onClick={() => handleStateClick(abbreviation)}
              className="d-flex align-items-center"
              action
              key={name}
            >
              {activeStates.includes(abbreviation) ? <CheckBoxOutlined /> : <CheckBoxOutlineBlank />}
              <span className="ml-3">{name}</span>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Container>
      <footer className="bg-dark p-3 mt-3">
        &copy; 2020 <a href="https://ryanwalters.dev">Ryan Walters</a>
      </footer>
    </>
  );
}
