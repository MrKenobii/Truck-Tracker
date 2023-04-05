import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  if(!username){
    return;
  }
  console.log("----------------------ADD USERS----------------------");
  if(!onlineUsers.some((user) => user.username.username === username && (Object.keys(username).length === 0))){
    if(Object.keys(username).length !== 0){
      onlineUsers.push({ username, socketId, notifications: [] });
    }
  }
    onlineUsers.map((user) => console.log(user.username.username));  
};

const removeUser = (socketId) => {
  const user = onlineUsers.find((user) => user.socketId === socketId && (Object.keys(user.username).length !== 0));
  console.log("----------------------ONINE USER REMOVE USER----------------------");
  // if(Object.keys(user && user.notifications).length !== 0){
  //   user.notifications.map((notif) => {
  //     const sender = notif.senderName;
  //     const payload = {
  //       id: notif.notif.id,
  //       content: notif.notif.content,
  //       emergencyLevel: notif.notif.emergencyLevel
  //     }
  //     console.log("MAPPPP");
  //     console.log(sender.username);
  //     console.log(payload);
  
  //   });
  // }
  //console.log(user.username.username);
  
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
const addNotification = (socketId, notif) => {
  console.log("----------------------Online USERS GET USER----------------------");
  const user = onlineUsers.find((user) => user.socketId === socketId && (Object.keys(user.username).length !== 0));
  user.notifications.push(notif);
  console.log(user);
}

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });

  socket.on("sendNotification", ({ senderName, recievers, content, emergencyLevel }) => {
    console.log("----------------------SEND NOTIF---------------------- " + recievers.length);
    recievers.map((reciverName) => {
      const receiver = getUser(reciverName.username);
      if(receiver && (reciverName.role.name === "ADMIN" || reciverName.role.name === "POLICE_STATION")){
        console.log("Sender: " + senderName.username);
        console.log("Receiver: " + reciverName.username);
        console.log(receiver.socketId);
        addNotification(receiver.socketId, {
          senderName,
          notif: {
            id: uuidv4(),
            content,
            emergencyLevel
          }
        });
        io.to(receiver.socketId).emit("getNotification", {
          senderName,
          notif: {
            id: uuidv4(),
            content,
            emergencyLevel
          }
        });
      }
    });
  });

  socket.on("sendToCops", ({ senderName, recievers, content, emergencyLevel }) => {
    console.log("----------------------CALL COPS---------------------- : " + content);
    recievers.map((reciverName) => {
      const receiver = getUser(reciverName.username);
      if(receiver && receiver.socketId && (reciverName.role.name === "ADMIN" || reciverName.role.name === "POLICE_STATION" || reciverName.role.name === "POLICE")){
        io.to(receiver.socketId).emit("getNotification", {
          senderName,
          notif: {
            id: uuidv4(),
            content,
            emergencyLevel
          }
        });
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
    removeUser(socket.id);
  });
});

io.listen(8001);