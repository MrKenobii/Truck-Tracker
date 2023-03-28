import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../context/socket";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { BASE_URL } from "../constants/urls";
import axios from "axios";

const NotificationsPage = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const socket = useContext(SocketContext);
  const location = useLocation();
  console.log(location);
  const fetchUsers = async (token) => {
    return await axios.get(`${BASE_URL}/user`, {
      headers: { Authorization: "Bearer " + token },
    });
  };
  const handleRead = (id) => {
    console.log(id);
    setNotifications(
      notifications.filter((notif) => {
        if(notif.notif){
          console.log(notif.notif.id);
          return notif.notif.id !== id;
        } else {
          console.log(notif.id);
          return notif.id !== id;
        }
        
      })
    );
  };

  const handleNotification = () => {
    socket.emit("sendNotification", {
      senderName: user,
      recievers: users,
      content: "Yardım İstiyor",
      emergencyLevel: 5,
    });
  };

  useEffect(() => {
    console.log("Initial State");
    fetchUsers(localStorage.getItem("token"))
      .then((usersData) => {
        setUser(location.state.user);
        setNotifications(location.state.notifications);
        console.log(usersData.data);
        console.log(location.state);
        console.log(location.state.user);
        console.log(location.state.notifications);
        console.log(location.state.user.notifications);
        const filteredUsers = usersData.data.filter(
          (u) => u.id !== location.state.user.id
        );
        setUsers(filteredUsers);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log("Second UseEffect");
    socket?.on("getNotification", (data) => {
      console.log(data);
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  return (
    <>
      <Box sx={{ minWidth: 275, margin: "20px 10px" }}>
        <Button
          onClick={() => handleNotification()}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Send
        </Button>
      </Box>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <Card sx={{ minWidth: 275, margin: "20px 10px" }} key={index}>
            {notification.senderName && (
              <>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {notification.senderName && (
                      <>
                        {notification.senderName.name +
                          " " +
                          notification.senderName.lastName}
                      </>
                    )}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {notification.notif ? (
                      <>{notification.notif.content}</>
                      ): (
                      <>{notification.content}</>
                    )}
                  </Typography>
                </CardContent>
                <CardActions>
                  {notification.notif ? (
                        <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleRead(notification.notif.id)}
                      >
                        Okundu olarak işaretle
                      </Button>
                        ): (
                          <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleRead(notification.id)}
                        >
                          Okundu olarak işaretle
                        </Button>
                  )}
                  
                </CardActions>
              </>
            )}
          </Card>
        ))
      ) : (
        <Box>
          Bildirim yok !!!
        </Box>
      )}
    </>
  );
};

export default NotificationsPage;
