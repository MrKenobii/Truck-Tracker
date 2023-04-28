import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../constants/urls";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  const { user } = useSelector((state) => state.user);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activateUser = (_user) => {
    console.log(_user.smsActivationToken);
    console.log(_user.accountActivationToken);
    axios
      .put(`${BASE_URL}/auth/activate-account/${_user.id}`, {
        activationToken: _user.accountActivationToken,
        activationSmsToken: _user.smsActivationToken,
        admin: true
      })
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          setUsers(users.filter((u) => u.id !== _user.id));
          toast.success(`${_user.name + " " + _user.lastName} adlı kullanıcının hesabı başarıyla aktive edildi.`, {
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
          toast.error(`${res.data.message}`, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      });
  };
  const deleteUser = async (_user) => {
      await axios.delete(`${BASE_URL}/user/${_user.id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then((res) => {
        if(res.status === 200){
          setUsers(users.filter((u) => u.id !== _user.id));
          toast.warning(`${_user.name + " " + _user.lastName} adlı kullanıcının hesabı başarıyla silindi.`, {
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
          toast.error("Silme işlemi başarısız", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }).catch(err => console.log(err));
      
  };
  const getRoleByName = (role) => {
    if (role === "POLICE") return "POLİS";
    else if (role === "POLICE_STATION") return "KARAKOL";
    else if (role === "GOVERNMENT") return "HÜKÜMET";
    else if (role === "TRUCK_DRIVER") return "TIR ŞÖFORÜ";
    else if (role === "ADMIN") return "YÖNETİCİ";
    else if (role === "NORMAL") return "NORMAL KULLANICI";
    else return "";
  };
  useEffect(() => {
    const getUsers = async () => {
      let res = await axios.get(`${BASE_URL}/user`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      if (res.status === 200) {
        return res.data;
      }
    };
    if (user && localStorage.getItem("token")) {
      if (user.role.name !== "ADMIN") {
        navigate("/");
      } else {
        getUsers()
          .then((usersData) => {
            console.log(usersData);
            setUsers(
              usersData.filter(
                (u) =>
                  !u.accountActive &&
                  u.role.name !== "ADMIN" &&
                  u.id !== user.id
              )
            );
          })
          .catch((err) => console.log(err));
      }
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <>
      {users.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            {users.map((_user, index) => (
              <Card
                sx={{
                  minWidth: 100,
                  marginX: 3,
                  marginY: 3,
                  backgroundColor: "#2E3B55",
                }}
                key={index}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: "white" }}
                  >
                    {_user.name + " " + _user.lastName + " kaydoldu."}
                  </Typography>
                  <Typography
                    sx={{ mb: 1.5 }}
                    color="text.secondary"
                    sx={{ color: "white" }}
                    component="p"
                    variant="body2"
                  >
                    {"E-mail: " + _user.email}
                  </Typography>
                  <Typography
                    sx={{ mb: 1.5 }}
                    color="text.secondary"
                    sx={{ color: "white" }}
                    component="p"
                    variant="body2"
                  >
                    {"Rol: " + getRoleByName(_user.role.name)}
                  </Typography>
                  <Typography
                    sx={{ mb: 1.5 }}
                    color="text.secondary"
                    sx={{ color: "white" }}
                    component="p"
                    variant="body2"
                  >
                    {"Telefon No: " + _user.phoneNumber}
                  </Typography>
                  <Typography
                    component="p"
                    variant="body2"
                    color="text.secondary"
                    sx={{ color: "white" }}
                  >
                    {"Şehir : " + _user.city.name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    type="button"
                    color="success"
                    variant="contained"
                    size="small"
                    onClick={() => activateUser(_user)}
                    sx={{ mt: 1, mb: 2 }}
                  >
                    Aktive et
                  </Button>
                  <Button
                    type="button"
                    color="error"
                    size="small"
                    variant="contained"
                    sx={{ mt: 1, mb: 2 }}
                    onClick={() => deleteUser(_user)}
                  >
                    Kullanıcıyı sil
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      ) : (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <Card
              sx={{
                minWidth: 100,
                marginX: 3,
                marginY: 3,
                backgroundColor: "#2E3B55",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ color: "white" }}
                >
                  Bekleyen Kullanıcı Yok
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      )}
    </>
  );
};

export default AdminDashboard;
