import { nanoid } from 'nanoid';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button, Input, InputGroup, InputGroupAddon, Modal, ModalBody } from 'reactstrap';
import DefaultTemplate from '../templates/DefaultTemplate/DefaultTemplate';
import styles from './HomePage.module.scss';

/**
 * todo:
 * - use react-hook-form for join game validation
 *   - close modal on success
 *   - show error when game doesnt exist
 */

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function toggleModal() {
    setIsModalOpen((prevIsOpen) => !prevIsOpen);
  }

  function handleJoinGameSubmit(event) {
    event.preventDefault();

    // joinGame(event.target.elements.gameId.value);

    setIsModalOpen(false);
  }

  return (
    <DefaultTemplate>
      <h3 className="my-3">Welcome!</h3>
      <div className="lead mb-4">
        <div className="mb-2">Click &quot;Start Game&quot; to start a new game!</div>
        Click &quot;Join Game&quot; if your friend has a game code for you, or scan the QR on their screen to join
        automatically.
      </div>
      <Link href={`/game/${nanoid(4)}`}>
        <Button tag="a" size="lg" color="success" block>
          Start Game
        </Button>
      </Link>
      <Button size="lg" color="success" block outline onClick={toggleModal}>
        Join Game
      </Button>
      <Modal isOpen={isModalOpen} toggle={toggleModal} modalClassName={styles.joinModal}>
        <ModalBody>
          <form onSubmit={handleJoinGameSubmit}>
            <InputGroup>
              <Input name="gameId" placeholder="Enter Game ID..." maxLength={4} />
              <InputGroupAddon addonType="append">
                <Button type="submit">Join</Button>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </ModalBody>
      </Modal>
    </DefaultTemplate>
  );
}
