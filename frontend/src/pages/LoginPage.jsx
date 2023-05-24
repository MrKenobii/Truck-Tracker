import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from 'react-redux'
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";
import { BASE_URL } from "../constants/urls";


const theme = createTheme();

const LoginPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchUser = async (token) => {
    return await axios.get(`${BASE_URL}/user/token`, {
      headers: { Authorization: "Bearer " + token }
    });
  }
  useEffect(() => {
    console.log(user);
    const token = localStorage.getItem("token");
    if(token){
      navigate("/");
    }
  }, []);
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    if(isValidEmail(data.get("email"))){
      if(data.get("email") && data.get("password")){
        axios
          .post(`${BASE_URL}/auth/authenticate`, {
            email: data.get("email"),
            password: data.get("password"),
          })
          .then(function (response) {
            console.log(response);
            if(response.status === 200 && response.data.token){
              //dispatch(setUser(response.data));
              fetchUser(response.data.token).then((userResponse) => {
                if(userResponse.status === 200){
                  console.log(userResponse.data);
                  dispatch(setUser({
                    token: response.data,
                    user: userResponse.data
                  }));
                  navigate("/");
                }
              }).catch(err => {
                console.log(err);
              });
              toast.success("Giriş Başarılı !", {
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
              toast.error(`${response.data.message}`, {
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
            
          })
          .catch(function (error) {
            console.log(error);
            toast.error("Giriş hatalı. Tekrar deneyiniz !", {
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
      } else {
        toast.error("Lütfen istenilen yerleri eksiksiz giriniz!", {
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
    } else {
      toast.error("Mail formatı doğru değil!", {
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
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Giriş Yap
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Giriş yap
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgot-password" variant="body2">
                  Şifrenizi mi unuttunuz ?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Hesabınız yok mu? Kayıt ol"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
