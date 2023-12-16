import { Server } from "socket.io";
import { Redis } from "ioredis";

//two connections needed one for publishing and 1 for subscribing
const pub = new Redis({
  host: "",
  port: 0,
  username: "",
  password: "AVNS_eZiF7hrP3RbWTBFpdaY",
});
const sub = new Redis({
  host: "",
  port: 0,
  username: "",
  password: "",
});
class SocketService {
  private _io: Server;
  constructor() {
    console.log("init socket server");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");

    // this._io.on("connection", this.onConnection.bind(this));
  }
  public initListeners() {
    const io = this.io;
    console.log("initialised socket listeners");
    io.on("connect", (socket) => {
      console.log("new socket connected", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("new message reccieved", message);
        //publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("this is the message recieved", message);
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
