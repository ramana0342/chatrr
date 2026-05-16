import { io } from "socket.io-client";
import { getSocketURL } from "../../network/ApiConfig";

const socket = io(getSocketURL(), {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"]
});

export default socket;