module.exports = function (io) {
  io.on('connection', async (socket) => {

    console.log('client connected', socket.id);

    socket.on('login', async (data, cb) => {
      try {

      } catch (error) {
        console.log('login error', error);
      }
    });

    socket.on("joinRoom", async (data, cb) => {
      try {

      } catch (error) {
        console.log('login error', error);
      }
    });

    socket.on("sendMessage", async (data, cb) => {
      try {

      } catch (error) {
        console.log('login error', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
    });
  });
}