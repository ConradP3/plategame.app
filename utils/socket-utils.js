export async function connect(socket) {
  return new Promise((resolve, reject) => {
    const maxAttempts = 10;
    const intervalTime = 200;

    let currentAttempt = 0;

    const interval = setInterval(() => {
      if (currentAttempt > maxAttempts - 1) {
        clearInterval(interval);

        reject(new Error('Max number of attempts exceeded'));
      } else if (socket.readyState === socket.OPEN) {
        clearInterval(interval);

        resolve();
      }

      currentAttempt += 1;
    }, intervalTime);
  });
}

export async function sendMessage(socket, message) {
  if (socket.readyState !== socket.OPEN) {
    try {
      await connect(socket);

      socket.send(message);
    } catch (error) {
      console.error(error);
    }
  }
}
