import { useCallback, useEffect, useState } from 'react';

export default function useMultiplayer({ joinGameId, onDispatch }) {
  const [websocket, setWebsocket] = useState(null);
  const [error, setError] = useState();
  const [gameId, setGameId] = useState(joinGameId);

  const createGame = useCallback(() => {
    if (!websocket) {
      setWebsocket(new WebSocket('wss://7esjaw2uci.execute-api.us-east-1.amazonaws.com/dev/'));
    }
  }, [websocket]);

  const sendMessage = useCallback(
    (payload) => {
      try {
        websocket?.send(JSON.stringify(payload));
      } catch (err) {
        // send this error somewhere
      }
    },
    [websocket]
  );

  function disconnect() {
    websocket?.close();
  }

  // Automatically create and join a game if 'joinGameId' is passed

  useEffect(() => {
    if (joinGameId) {
      createGame();
    }
  }, [createGame, joinGameId]);

  useEffect(() => {
    let interval;

    if (websocket) {
      // Create message listener

      websocket.onmessage = ({ data }) => {
        const parsedData = JSON.parse(data);

        switch (parsedData.type) {
          case 'updateGameId':

          // eslint-disable-next-line no-fallthrough
          case 'getGameId': {
            setGameId(parsedData.gameId);
            break;
          }

          case 'dispatch': {
            onDispatch(parsedData.payload);
            break;
          }

          default:
        }
      };

      // Fetch or join game id after opening the connection

      websocket.onopen = () => {
        if (!joinGameId) {
          sendMessage({ action: 'getGameId' });
        } else {
          sendMessage({
            action: 'updateGameId',
            gameId: joinGameId,
          });
        }
      };

      // Send keep-alive ping every 6 min (automatically times out after 7 min)

      interval = setInterval(() => {
        sendMessage({ action: 'ping' });
      }, 1000 * 60 * 6);

      // Disconnect

      websocket.onclose = () => {
        setGameId(undefined);
        setWebsocket(null);
      };

      // Error

      websocket.onerror = (websocketError) => setError(websocketError);
    }

    // Disconnect on unmount

    return () => {
      websocket?.close();
      clearInterval(interval);
    };
  }, [joinGameId, sendMessage, websocket]);

  return {
    createGame,
    disconnect,
    sendMessage,
    error,
    gameId,
    isConnected: websocket?.readyState === 1, // WebSocket.OPEN
    isConnecting: websocket?.readyState === 0, // WebSocket.CONNECTING
    readyState: websocket?.readyState,
  };
}
