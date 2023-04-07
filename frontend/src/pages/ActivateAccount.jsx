import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";
import { BASE_URL } from "../constants/urls";

const theme = createTheme();

const ActivateAccount = () => {
  const [userToken, setUserToken] = useState("");
  const [userFromApi, setUserFromApi] = useState(null);
  const { user } = useSelector((state) => state.user);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("token"));
    if (data.get("token").trim() === "" ) {
      toast.error("Lütfen eksiksiz tamamlayınız !", {
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
       if(data.get("token") === userFromApi.accountActivationToken){
           axios
             .put(`${BASE_URL}/auth/activate-account/${userId}`, {
               activationToken: data.get("token"),
             })
             .then((res) => {
               console.log(res.data);
               if (res.status === 200) {
                 toast.success(`${res.data.message}`, {
                   position: toast.POSITION.BOTTOM_CENTER,
                   autoClose: 3000,
                   hideProgressBar: false,
                   closeOnClick: true,
                   pauseOnHover: true,
                   draggable: true,
                   progress: undefined,
                   theme: "dark",
                 });
                 localStorage.setItem("token", res.data.token);
                 dispatch(setUser({
                    token: res.data.token,
                    user: res.data.user
                  }));
                 console.log(user);
                 navigate("/");
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

       } else {
        toast.error("Yanlış kod girdiniz", {
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
      
    }
  };
  useEffect(() => {
    if (user && localStorage.getItem("token")) {
      navigate("/");
    } else {
      axios.get(`${BASE_URL}/auth/user/${userId}`).then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          if (
            !response.data.accountActive &&
            response.data.accountActivationToken
          ) {
            setUserFromApi(response.data);
          } else {
            navigate("/login");
          }
        }
      });
    }
  }, []);
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
            {"Sayın " + userFromApi?.name + " " + userFromApi?.lastName}
          </Typography>
          <Typography component="h1" variant="h5">
            Hesabınızı Aktive Edin
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
              type="text"
              id="token"
              label="6-Haneli Kodunuz"
              name="token"
              autoComplete="token"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Gönder
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ActivateAccount;
