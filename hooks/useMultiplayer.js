import { useEffect, useState } from 'react';

export default function useMultiplayer() {
  const [websocket, setWebsocket] = useState(null);
  const [gameId, setGameId] = useState();
  const [isConnected, setIsConnected] = useState(false);

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

        setIsConnected(true);
      };

      // Disconnect

      websocket.onclose = () => {
        setIsConnected(false);
        setGameId(undefined);
        setWebsocket(null);
      };
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
    gameId,
    isConnected,
  };
}
