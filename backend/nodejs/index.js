import { Server } from "socket.io";
import axios from "axios";
const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  if (!username) {
    return;
  }
  console.log("----------------------ADD USERS----------------------");
  if (
    !onlineUsers.some(
      (user) =>
        user.username.username === username &&
        Object.keys(username).length === 0
    )
  ) {
    if (Object.keys(username).length !== 0) {
      onlineUsers.push({ username, socketId });
    }
  }
  onlineUsers.map((user) => console.log(user.username.username));
};

const removeUser = (socketId) => {
  const user = onlineUsers.find(
    (user) =>
      user.socketId === socketId && Object.keys(user.username).length !== 0
  );
  console.log(
    "----------------------ONINE USER REMOVE USER----------------------"
  );
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  console.log(
    "----------------------Online USERS GET USER----------------------"
  );
  onlineUsers.map((user) => console.log(user.username.username));
  return onlineUsers.find((user) => {
    //console.log(user.username.username);
    return user.username.username === username;
  });
};
const addNotification = (socketId, notif) => {
  console.log(
    "----------------------Online USERS GET USER----------------------"
  );
  const user = onlineUsers.find(
    (user) =>
      user.socketId === socketId && Object.keys(user.username).length !== 0
  );
  user.notifications.push(notif);
  console.log(user);
};

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });

  socket.on(
    "sendNotification",
    ({ senderName, recievers, content, emergencyLevel }) => {
      console.log(
        "----------------------SEND NOTIF---------------------- " +
          recievers.length
      );
      recievers.map((reciverName) => {
        const receiver = getUser(reciverName.username);

        if (receiver) {
          console.log("------SENDER------");
          console.log("Sender: " + senderName.username);
          console.log("------RECIVER------");
          console.log("Receiver: " + reciverName.username);
          console.log(receiver.socketId);

          const payload = {
            senderName,
            notif: {
              content,
              emergencyLevel,
            },
          };

          axios
            .post(
              `http://localhost:8080/api/v1/notification/${reciverName.id}/save`,
              {
                id: payload.notif.id,
                content: payload.notif.content,
                emergencyLevel: payload.notif.emergencyLevel,
                senderId: payload.senderName.id,
              },
              {
                headers: { Authorization: `Bearer ${reciverName.token}` },
              }
            )
            .then((data) => {
              console.log("SUBMIT");
              console.log(data.data);

              io.to(receiver.socketId).emit("getNotification", {
                senderName: payload.senderName,
                notif: {
                  id: data.data.id,
                  content: payload.notif.content,
                  emergencyLevel: payload.notif.emergencyLevel,
                  createdAt: data.data.createdAt,
                },
              });
            })
            .catch((err) => console.log(err));
        }
      });
    }
  );

  socket.on(
    "sendToCops",
    ({ senderName, recievers, content, emergencyLevel }) => {
      console.log(
        "----------------------CALL COPS---------------------- : " + content
      );
      recievers.map((reciverName) => {
        const receiver = getUser(reciverName.username);
        if (
          receiver &&
          receiver.socketId &&
          (reciverName.role.name === "ADMIN" ||
            reciverName.role.name === "POLICE_STATION" ||
            (reciverName.role.name === "POLICE" &&
              senderName.role.name === "POLICE_STATION") ||
            (reciverName.role.name === "POLICE_STATION" &&
              senderName.role.name === "ADMIN"))
        ) {
          console.log(
            "REciveerrr " + reciverName.name + " " + reciverName.lastName
          );
          const payload = {
            senderName,
            notif: {
              content,
              emergencyLevel,
            },
          };

          axios
            .post(
              `http://localhost:8080/api/v1/notification/${reciverName.id}/save`,
              {
                content: payload.notif.content,
                emergencyLevel: payload.notif.emergencyLevel,
                senderId: payload.senderName.id,
              },
              {
                headers: { Authorization: `Bearer ${reciverName.token}` },
              }
            )
            .then((data) => {
              console.log("SUBMIT");
              console.log(data.data);

              io.to(receiver.socketId).emit("getNotification", {
                senderName: payload.senderName,
                notif: {
                  id: data.data.id,
                  content: payload.notif.content,
                  emergencyLevel: payload.notif.emergencyLevel,
                  createdAt: data.data.createdAt,
                },
              });
            })
            .catch((err) => console.log(err));
        }
      });
    }
  );
  socket.on(
    "gatherUnits",
    ({ senderName, recievers, content, emergencyLevel }) => {
      console.log(
        "----------------------GATHER UNITS---------------------- : " + content
      );
      recievers.map((reciverName) => {
        const receiver = getUser(reciverName.username);
        if (
          receiver &&
          receiver.socketId &&
          (reciverName.role.name === "ADMIN" ||
            reciverName.role.name === "POLICE")
        ) {
          console.log(
            "Reciveerrr " + reciverName.name + " " + reciverName.lastName
          );
          const payload = {
            senderName,
            notif: {
              content,
              emergencyLevel,
            },
          };

          axios
            .post(
              `http://localhost:8080/api/v1/notification/${reciverName.id}/save`,
              {
                content: payload.notif.content,
                emergencyLevel: payload.notif.emergencyLevel,
                senderId: payload.senderName.id,
              },
              {
                headers: { Authorization: `Bearer ${reciverName.token}` },
              }
            )
            .then((data) => {
              console.log("SUBMIT");
              console.log(data.data);

              io.to(receiver.socketId).emit("getNotification", {
                senderName: payload.senderName,
                notif: {
                  id: data.data.id,
                  content: payload.notif.content,
                  emergencyLevel: payload.notif.emergencyLevel,
                  createdAt: data.data.createdAt,
                },
              });
            })
            .catch((err) => console.log(err));
        }
      });
    }
  );
  socket.on(
    "replyMessage",
    ({ senderName, reciever, content, emergencyLevel }) => {
      console.log(
        "----------------------CALL COPS---------------------- : " + content
      );
      // console.log(senderName);
      // console.log(reciever);
      const receiverSocket = getUser(reciever.username);
      if (receiverSocket) {
        console.log("Console: " + receiverSocket.socketId);
        const payload = {
          senderName,
          notif: {
            content,
            emergencyLevel,
          },
        };

        axios
          .post(
            `http://localhost:8080/api/v1/notification/${reciever.id}/save`,
            {
              content: payload.notif.content,
              emergencyLevel: payload.notif.emergencyLevel,
              senderId: payload.senderName.id,
            },
            {
              headers: { Authorization: `Bearer ${reciever.token}` },
            }
          )
          .then((data) => {
            console.log("SUBMIT");
            console.log(data.data);

            io.to(receiverSocket.socketId).emit("getNotification", {
              senderName: payload.senderName,
              notif: {
                id: data.data.id,
                content: payload.notif.content,
                emergencyLevel: payload.notif.emergencyLevel,
                createdAt: data.data.createdAt,
              },
            });
          })
          .catch((err) => console.log(err));
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("Disconnected");
    removeUser(socket.id);
  });
});

io.listen(8001);
