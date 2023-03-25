import React  from "react";
import socketio from "socket.io-client";
import { SOCKETIO_URL } from "../constants/urls";
export const socket = socketio.connect(SOCKETIO_URL);
export const SocketContext = React.createContext();