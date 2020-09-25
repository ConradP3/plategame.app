import { CheckBoxOutlineBlank, CheckBoxOutlined, Refresh } from '@material-ui/icons';
import Cookies from 'js-cookie';
import Head from 'next/head';
import React, { useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  Navbar,
  Row,
} from 'reactstrap';
import DefaultTemplate from '../templates/DefaultTemplate/DefaultTemplate';
import useMultiplayer from '../../hooks/useMultiplayer';
import provinces from '../../utils/ca-provinces.json';
import states from '../../utils/us-states.json';

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

/**
 * 1. Look up game id, if doesnt exist, 404
 * 2. "Invite Friends" button opens up a full screen modal with a QR code that takes the scanner to this page
 * 3. Show indicator that others have joined game
 */

/* export function getServerSideProps({ query: { gameId } }) {
  return {
    props: {
      gameId,
    },
  };
} */

export default function GamePage() {
  const {
    query: { gameId: joinGameId },
  } = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTerritories, dispatch] = useReducer(reducer, initialState);
  const { disconnect, error, gameId, isConnected, isConnecting, readyState, sendMessage } = useMultiplayer({
    joinGameId,
    onDispatch: ({ payload }) => dispatch(payload),
  });

  // todo: can we clean this up? maybe figure out how to subscribe to

  function handleTerritoryClick(abbreviation) {
    const payload = {
      type: activeTerritories.includes(abbreviation) ? REMOVE_TERRITORY : ADD_TERRITORY,
      payload: abbreviation,
    };

    dispatch(payload);

    sendMessage({
      action: 'dispatch',
      payload,
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
    <DefaultTemplate activeTerritories={activeTerritories}>
      <div className="my-3 p-3 rounded border">
        <div className="lead border-bottom mb-2 pb-2">How to play</div>
        As you spot license plates from different states and provinces during your trip, check the box!
      </div>
      <ButtonGroup className="d-flex">
        <Button onClick={() => {}} disabled={isConnected || isConnecting}>
          {isConnecting && '...'}
          {isConnected && `Game ID: ${gameId}`}
          {/*{error && 'Reconnect'}*/}
        </Button>
        {isConnected && <Button onClick={disconnect}>Disconnect</Button>}
      </ButtonGroup>
      {/* {isConnected && <Check className="ml-3 text-success" />} */}
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
              onClick={() => handleTerritoryClick(abbreviation)}
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
            onClick={() => handleTerritoryClick(abbreviation)}
            className="d-flex align-items-center"
            key={name}
          >
            {activeTerritories.includes(abbreviation) ? <CheckBoxOutlined /> : <CheckBoxOutlineBlank />}
            <span className="ml-3">{name}</span>
          </ListGroupItem>
        ))}
    </DefaultTemplate>
  );
}
