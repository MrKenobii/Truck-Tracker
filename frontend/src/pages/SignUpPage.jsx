import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { BASE_URL } from "../constants/urls";


const theme = createTheme();
const SignUpPage = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fetchCities = async () => {
    let res = await axios.get(`${BASE_URL}/city`);
    return res.data;
  };
  const fetchRoles = async () => {
    let res = await axios.get(`${BASE_URL}/role`);
    return res.data;
  };
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  const register = async (payload) => {
    let res = await axios.post(`${BASE_URL}/auth/register`, payload);
    console.log(res);
    console.log(res.data);
    return res.data;
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    } else {
      fetchCities()
        .then((data) => {
          setIsLoading(true);
          const sortedList = data.sort((a, b) => a.name.localeCompare(b.name));
          setCities(sortedList);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error("Something went wrong !", {
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
    }
  }, []);
  const handleChangeCity = (event) => {
    setCity(event.target.value);
    console.log(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      data.get("email") &&
      data.get("password") &&
      data.get("confirmPassword") &&
      data.get("phone") &&
      data.get("firstName") &&
      data.get("lastName") &&
      city
    ) {
      if (isValidEmail(data.get("email"))) {
        if(data.get("phone").startsWith("5") && data.get("phone").length === 10){
          if (data.get("confirmPassword") === data.get("password")) {
            const payload = {
              email: data.get("email"),
              password: data.get("password"),
              phoneNumber: data.get("phone"),
              firstName: data.get("firstName"),
              lastName: data.get("lastName"),
              city,
              role: "NORMAL",
            };
            register(payload)
              .then((data) => {
                console.log(data);
                if (data.userId) {
                  toast.success("Başarıyla kayıt olundu!", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  });
                  navigate(`/activate-account/${data.userId}`);
                } else {
                  toast.error(data.message, {
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
              .catch((error) => {
                toast.error("Bir şeyler ters gitti !", {
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
          } else {
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
          }
        } else {
          toast.error("Telefon numarası formatını yanlış girdiniz!", {
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
        toast.error("E-mail formatı yanlış !", {
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
      toast.error("Lütfen formu tamamen doldurun !", {
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

    console.log({
      email: data.get("email"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
      phone: data.get("phone"),
      name: data.get("firstName"),
      lastName: data.get("lastName"),
      city,
      role: "NORMAL",
    });
  };
  console.log(isLoading);
  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
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
                Kayıt Ol
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="Ad"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Soyad"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="E-mail"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="phone"
                      label="Telefon numarası (5xxxxxxx)"
                      name="phone"
                      autoComplete="phone"
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="select-label-city">Şehir</InputLabel>
                      <Select
                        labelId="select-label-city"
                        id="select-city"
                        value={city}
                        label="Şehir"
                        onChange={handleChangeCity}
                      >
                        {cities.map((city, index) => (
                          <MenuItem key={index} value={city.name}>
                            {city.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Şifre"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Şifre Tekrar"
                      type="password"
                      id="confirmPassword"
                      autoComplete="confirm-password"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Kayıt ol
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      Zaten hesabın var mı? Giriş yap
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      )}
    </>
  );
};

export default SignUpPage;
