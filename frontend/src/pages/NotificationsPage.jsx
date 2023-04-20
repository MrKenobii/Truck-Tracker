import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { SocketContext } from "../context/socket";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { BASE_URL } from "../constants/urls";
import axios from "axios";
import { Container, Grid, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/features/userSlice";



const NotificationsPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState([]);
  const socket = useContext(SocketContext);
  const location = useLocation();

  const formatDate = (inputDate) => {
    console.log(inputDate);
    let date, month, year, hour, minute, second;
    
      date = inputDate.getDate();
      month = inputDate.getMonth() + 1;
      year = inputDate.getFullYear();
      hour = inputDate.getHours();
      minute = inputDate.getMinutes();
      second = inputDate.getSeconds();
    
        date = date
            .toString()
            .padStart(2, '0');
    
        month = month
            .toString()
            .padStart(2, '0');
        hour = hour
            .toString()
            .padStart(2, '0');
        minute = minute
            .toString()
            .padStart(2, '0');
        second = second
            .toString()
            .padStart(2, '0');
    
      return `${date}/${month}/${year} ${hour}:${minute}:${second}`;
  
  }
  const fetchUsers = async (token) => {
    return await axios.get(`${BASE_URL}/user`, {
      headers: { Authorization: "Bearer " + token },
    });
  };
  const fetchRoles = async (token) => {
    return await axios.get(`${BASE_URL}/role`, {
      headers: { Authorization: "Bearer " + token },
    });
  };
  const fetchNotifications = async (token) => {
    return await axios.get(`${BASE_URL}/notification/by-user/${user.id}`, {
      headers: { Authorization: "Bearer " + token },
    });
  };
  const handleRead = (id) => {
    let url = `${BASE_URL}/notification/${id}/user/${user.id}`;
    console.log(url);
    console.log(localStorage.getItem("token"));
    axios.delete(`${BASE_URL}/notification/${id}/user/${user.id}`, {
      headers: `Bearer ${localStorage.getItem("token")}`
    })
    setNotifications(
      notifications.filter((notif) => {
        if (notif.notif) {
          //console.log(notif.notif.id);
          return notif.notif.id !== id;
        } else {
          //console.log(notif.id);
          return notif.id !== id;
        }
      })
    );

    
  };
  const handleChangeRole = (event) => {
    const {
      target: { value },
    } = event;
    setRoleName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleNotification = (message) => {
    setMessage("");
    console.log(message);
    if (message.trim() === "") {
      toast.error("Mesaj içeriği boş olamaz !", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      if (user.role.name === "ADMIN") {
        console.log("ADMIN");
        console.log(users);
        socket.emit("sendNotification", {
          senderName: user,
          recievers: users,
          content: message,
          emergencyLevel: 5,
        });
      } else if(user.role.name === "POLICE_STATION"){
        const newUsers = users.filter(
          (u) =>
            u.role.name === "ADMIN" || u.role.name === "POLICE"
        );
        console.log(newUsers);
        console.log(users);
        socket.emit("sendNotification", {
          senderName: user,
          recievers: newUsers,
          content: message,
          emergencyLevel: 5,
        });
      } else {
        console.log("BAŞKA");
        const newUsers = users.filter(
          (u) =>
            u.role.name === "ADMIN" || u.role.name === "POLICE_STATION"
        );
        console.log(newUsers);
        console.log(users);
        socket.emit("sendNotification", {
          senderName: user,
          recievers: newUsers,
          content: message,
          emergencyLevel: 5,
        });
      }
    }
  };

  useEffect(() => {
    if (id !== user.id) {
      navigate("/not-found");
    } else {
      console.log(id);
      fetchUsers(localStorage.getItem("token"))
        .then((usersData) => {
          console.log(usersData.data);
          const filteredUsers = usersData.data.filter(
            (u) => u.id !== user.id
          );
          console.log(filteredUsers);
          setUsers(filteredUsers);
        })
        .catch((err) => console.log(err));
      fetchRoles(localStorage.getItem("token"))
        .then((rolesData) => {
          if (rolesData.status === 200) {
            //console.log(rolesData.data);
            setRoles(rolesData.data);
          } else {
            console.log("error");
          }
        })
        .catch((error) => console.log(error));
      fetchNotifications(localStorage.getItem("token")).then((res) => {
        console.log(res);
        let sortedArr = res.data.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.date) - new Date(a.date);
        });
        console.log(sortedArr);
        setNotifications(sortedArr);
      }).catch((error) => console.log(error));
    }
  }, []);
  useEffect(() => {
    console.log("Second UseEffect");
    socket?.on("getNotification", (data) => {
      console.log(data);
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  return (
    <Grid container>
      <Container>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={8} sm={4} md={4}>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                margin="normal"
                fullWidth
                id="message"
                label="Mesaj"
                name="message"
                autoComplete="message"
                autoFocus
              />
            </Box>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <Box sx={{ minWidth: 275 }}>
              <Button
                onClick={() => handleNotification(message)}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Gönder
              </Button>
              <Button
                color="error"
                onClick={() => handleNotification("Acil Yardım İstiyor !!!")}
                variant="contained"
                sx={{ mt: 3, mb: 2, mx: 3 }}
              >
                Acil Yardım
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Container component="main" maxWidth="xs">
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
                            notification.senderName.lastName + " " + formatDate(new Date(notification.createdAt))}
                        </>
                      )}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {notification.notif ? (
                        <>{notification.notif.content}</>
                      ) : (
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
                    ) : (
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
          <Box>Bildirim yok !!!</Box>
        )}
      </Container>
    </Grid>
  );
};

export default NotificationsPage;
