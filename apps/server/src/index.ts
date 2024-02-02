import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/consumer";

async function init() {
  startMessageConsumer();
  const socketService = new SocketService();
  const httpServer = http.createServer();
  const PORT = process.env.PORT || 8000;
  socketService.io.attach(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
  });

  socketService.initListeners();
}
init();
