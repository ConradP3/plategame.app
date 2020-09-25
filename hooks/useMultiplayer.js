import { useEffect, useState } from 'react';

export default function useMultiplayer() {
  const [websocket, setWebsocket] = useState(null);
  const [error, setError] = useState();
  const [gameId, setGameId] = useState();

  useEffect(() => {
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

          default:
        }

        console.log('message', parsedData);
      };

      // Fetch or join game id after opening the connection

      websocket.onopen = () => {
        websocket.send(
          JSON.stringify({
            action: 'getGameId',
          })
        );
      };

      // Disconnect

      websocket.onclose = () => {
        setGameId(undefined);
        setWebsocket(null);
      };

      // Error

      websocket.onerror = (websocketError) => setError(websocketError);
    }

    // Disconnect on unmount

    return () => websocket?.close();
  }, [websocket]);

  function createGame() {
    if (!websocket) {
      setWebsocket(new WebSocket('wss://7esjaw2uci.execute-api.us-east-1.amazonaws.com/dev/'));
    }
  }

  function disconnect() {
    websocket?.close();
  }

  return {
    createGame,
    disconnect,
    error,
    gameId,
    isConnected: websocket?.readyState === 1, // WebSocket.OPEN
    isConnecting: websocket?.readyState === 0, // WebSocket.CONNECTING
    readyState: websocket?.readyState,
  };
}
