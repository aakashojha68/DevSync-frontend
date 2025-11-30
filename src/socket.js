import { io } from "socket.io-client";
import { BACKEND_URL } from "./constant";

export const socket = io(BACKEND_URL, {
  autoConnect: false,
  withCredentials: true,
});
