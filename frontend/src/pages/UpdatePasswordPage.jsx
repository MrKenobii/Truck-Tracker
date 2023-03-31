import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";
import { BASE_URL } from "../constants/urls";

const theme = createTheme();

const UpdatePasswordPage = () => {
  const { user } = useSelector((state) => state.user);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    } else {
        axios.get(`${BASE_URL}/auth/user/${userId}`).then((response) => {
            console.log(response.data);
            if(response.status === 200){
                if(response.data.status === "PASSWORD_RENEW"){
                    
                } else {
                    navigate("/");
                }
            } 
        })
    }
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("confirmPassword"));
    console.log(data.get("password"));
    if(data.get("confirmPassword").trim() === "" || data.get("password").trim() === ""){
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
        if(data.get("confirmPassword").trim() !== data.get("password").trim()){
            toast.error("Şifreler eşleşmiyor !", {
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
            axios
              .put(`${BASE_URL}/auth/update-password/${userId}`, {
                password: data.get("password"),
                confirmPassword: data.get("confirmPassword")
              })
              .then((res) => {
                console.log(res);
                if(res.status === 200){
                    toast.success("Şifreniz başarıyla yenilendi !", {
                        position: toast.POSITION.BOTTOM_CENTER,
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    navigate("/login");

                } else {
                    toast.success("Bir şeyler ters gitti. !", {
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
        
        }
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
            Şifre Yenile
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
              type="password"
              id="password"
              label="Şifre"
              name="password"
              autoComplete="password"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              id="confirm-password"
              label="Şifre Tekrar"
              name="confirmPassword"
              autoComplete="confirm-password"
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
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Hesabınız var mı? Giriş yap"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UpdatePasswordPage;
