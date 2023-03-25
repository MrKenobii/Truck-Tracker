import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  console.log("----------------------ADD USERS----------------------");
  !onlineUsers.some((user) => user.username.username === username) &&
    onlineUsers.push({ username, socketId });
    onlineUsers.map((user) => console.log(user.username.username));  
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  console.log("----------------------Online USERS GET USER----------------------")
  onlineUsers.map((user) => console.log(user.username.username));  
  return onlineUsers.find((user) => {
    //console.log(user.username.username);
    return user.username.username === username
  });
};

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });

  socket.on("sendNotification", ({ senderName, recievers, content }) => {
    console.log("----------------------SEND NOTIF----------------------" + recievers.length);
    recievers.map((reciverName) => {
      const receiver = getUser(reciverName.username);
      if(receiver){
        console.log("Sender: " + senderName.username);
        console.log("Receiver: " + reciverName.username);
        console.log(receiver.socketId);
        io.to(receiver.socketId).emit("getNotification", {
          senderName,
          notif: {
            id: uuidv4(),
            content
          }
        });
      }
    });
  });

  socket.on("sendText", ({ senderName, receiverName, text }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getText", {
      senderName,
      text,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(8001);