import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/urls";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";

const CreateTruck = ({ marker, urgentCities, cities, drivers }) => {
  const [city, setCity] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [driver, setDriver] = useState("");

  const createTruck = (event, lat, lng) => {
    const data = new FormData(event.currentTarget);
    console.log(lat);
    console.log(lng);
    const payload = {
      licensePlate: data.get("licensePlate"),
      water: data.get("water"),
      food: data.get("food"),
      clothing: data.get("clothing"),
      tent: data.get("tent"),
      latitude: lat,
      longitude: lng,
      fromCity,
      destinationCity: city,
      status: "Yola çıkıyor",
      userId: driver.id,
    };
    console.log(payload);
    axios
      .post(`${BASE_URL}/truck`, payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res.data);
      });
  };
  const handleChangeCity = (event) => {
    setCity(event.target.value);
    console.log(event.target.value);
  };
  const handleChangeFromCity = (event) => {
    setFromCity(event.target.value);
    console.log(event.target.value);
  };
  const handleChangeDriver = (event) => {
    setDriver(event.target.value);
    console.log(event.target.value);
  };

  return (
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
        <Typography component="h1" variant="h5">
          Tır Ekle
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => createTruck(e, marker.lat, marker.lng)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="licensePlate"
                label="Tır Plaka"
                name="licensePlate"
                autoComplete="licensePlate"
                autoFocus
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                id="water-input"
                label="Su (Litre)"
                name="water"
                autoComplete="water"
                autoFocus
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                id="tent-input"
                label="Çadır (Adet)"
                name="tent"
                autoFocus
                autoComplete="tent"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                id="food-input"
                label="Yiyecek (KG)"
                name="food"
                autoFocus
                autoComplete="food"
              />
            </Grid>
            <Grid item xs={6} sm={6} style={{ marginTop: "-15px"}}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                id="clothing-input"
                label="Kıyafet (Kişi Başı)"
                name="clothing"
                autoFocus
                autoComplete="clothing"
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="select-label-city">Varış Şehiri</InputLabel>
                <Select
                  labelId="select-label-city"
                  id="destinationCity"
                  value={city}
                  label="Varılacak Şehir"
                  onChange={handleChangeCity}
                >
                  {urgentCities.map((c, index) => (
                    <MenuItem key={index} value={c}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="select-label-from-city">
                  Çıkış Şehiri
                </InputLabel>
                <Select
                  labelId="select-from-label-city"
                  id="fromCity"
                  value={fromCity}
                  label="Çıkıi Şehir"
                  onChange={handleChangeFromCity}
                >
                  {cities.map((c, index) => (
                    <MenuItem key={index} value={c}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="select-label-driver">Boş Şöfor</InputLabel>
                <Select
                  labelId="select-label-driver"
                  id="driverSelect"
                  value={driver}
                  label="Boş Şöfor"
                  onChange={handleChangeDriver}
                >
                  {drivers.length > 0 ? (
                    drivers.map((driver, index) => (
                      <MenuItem key={index} value={driver}>
                        {driver.name + " " + driver.lastName + " (" + driver.city.name + ")"}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>
                      Boşta sürücü yok
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Ekle
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item></Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateTruck;
