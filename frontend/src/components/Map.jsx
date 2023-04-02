import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Geocode from "react-geocode";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  InfoWindowF,
} from "@react-google-maps/api";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { BASE_URL } from "../constants/urls";
import LoadingComponent from "./LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
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

//38.473619157092614, 27.135962991566277
//41.41639660475681, 29.602251748436288
//40.99893685519544, 28.857916572952533
// https://dev.to/lauratoddcodes/using-the-google-maps-api-in-react-31ph
const delay = 5 * 30;
const apiKey = "AIzaSyDVrg8ingS4jIjJVTp7iH3vHOXITV4jDg8";
const Map = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showInfoWindow, setInfoWindowFlag] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [trucks, setTrucks] = useState([]);
  const [cities, setCities] = useState([]);
  const [urgentCities, setUrgentCities] = useState([]);
  const [city, setCity] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [driver, setDriver] = useState("");
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [updatedUser, setUpdatedUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [markers, setMarkers] = useState([]);
  const handleMapLeftClick = (e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
    ]);
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
  const removeMarker = (marker) => {
    const newMarkers = markers.filter(
      (m) => m.lat !== marker.lat && m.lng !== marker.lng
    );
    setMarkers(newMarkers);
  };
  const createTruck = (event, lat, lng) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(lat);
    console.log(lng);
    const payload = {
      licensePlate: data.get("licensePlate"),
      content: data.get("content"),
      latitude: lat,
      longitude: lng,
      fromCity,
      destinationCity: city,
      status: "Yola çıkıyor",
      userId: driver.id
    };
    console.log(payload);
    axios.post(`${BASE_URL}/truck`, payload, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    }).then((res) => {
      console.log(res.data);
    });
  };
  const setLocation = async (lat, long) => {
    let res = await axios.put(
      `${BASE_URL}/user/${user.id}/location`,
      {
        longitude: long,
        latitude: lat,
      },
      {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      }
    );
    return res.data;
  };
  const deliverGoods = async () => {
    if (trucks.find((t) => t.user.id === user.id)) {
      await axios.put(`${BASE_URL}/truck/${user.id}/deliver`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
    }
  };
  const getImageByRole = (role) => {
    if (role === "POLICE")
      return "https://cdn-icons-png.flaticon.com/512/386/386437.png";
    else if (role === "POLICE_STATION")
      return "https://cdn-icons-png.flaticon.com/512/3485/3485494.png";
    else if (role === "GOVERNMENT")
      return "https://cdn-icons-png.flaticon.com/512/3530/3530558.png";
    else if (role === "TRUCK_DRIVER")
      return "https://cdn-icons-png.flaticon.com/512/4047/4047296.png";
    else if (role === "ADMIN")
      return "https://cdn-icons-png.flaticon.com/512/2206/2206368.png";
    else if (role === "NORMAL")
      return "https://cdn-icons-png.flaticon.com/512/25/25694.png";
    else return "";
  };
  const getRole = (role) => {
    if (role === "POLICE") return "POLİS";
    else if (role === "POLICE_STATION") return "KARAKOL";
    else if (role === "GOVERNMENT") return "HÜKÜMET";
    else if (role === "TRUCK_DRIVER") return "TIR ŞÖFORÜ";
    else if (role === "ADMIN") return "YÖNETİCİ";
    else if (role === "NORMAL") return "NORMAL KULLANICI";
    else return "";
  };
  const getUrgency = (urg) => {
    if (urg === 1) return "ÇOK ACİL DEĞİL";
    else if (urg === 2) return "ACİL";
    else if (urg === 3) return "ÖNCELİKLİ";
    else if (urg === 4) return "ÖNEMLİ";
    else if (urg === 5) return "ÇOK ACİL";
  };
  const fetchTrucks = async () => {
    setIsLoading(false);
    let res = await axios.get(`${BASE_URL}/truck`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    return res.data;
  };
  const fetchFreeDrivers = async () => {
    setIsLoading(false);
    let res = await axios.get(`${BASE_URL}/user/free-drivers`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    return res.data;
  };
  const fetchUsers = async () => {
    setIsLoading(false);
    let res = await axios.get(`${BASE_URL}/user`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    return res.data;
  };
  const fetchCities = async () => {
    setIsLoading(false);
    let res = await axios.get(`${BASE_URL}/city`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    return res.data;
  };
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  Geocode.setApiKey(apiKey);
  Geocode.setLanguage("en");
  Geocode.setRegion("TR");
  const setAddress = (data) => {
    return data.map((d, index) => {
      if ((d.states == null || d.district == null) && data.latitude !== null) {
        Geocode.fromLatLng(d.latitude, d.longitude).then(
          (response) => {
            console.log(response);

            for (
              var i = 0;
              i < response.results[0].address_components.length;
              i++
            ) {
              for (
                var b = 0;
                b < response.results[0].address_components[i].types.length;
                b++
              ) {
                if (
                  response.results[0].address_components[i].types[b] ===
                  "administrative_area_level_2"
                ) {
                  var city = response.results[0].address_components[i];
                  d.formattedAddress = response.results[0].formatted_address;
                  d.district = city.long_name;
                  //console.log(d);
                  break;
                }
              }
            }

            for (
              var i = 0;
              i < response.results[0].address_components.length;
              i++
            ) {
              for (
                var b = 0;
                b < response.results[0].address_components[i].types.length;
                b++
              ) {
                if (
                  response.results[0].address_components[i].types[b] ===
                  "administrative_area_level_1"
                ) {
                  var state = response.results[0].address_components[i];
                  d.states = state.long_name;
                  //console.log(d);
                  break;
                }
              }
            }
          },
          (error) => {
            console.error(error);
          }
        );
      }
      return d;
    });
  };
  const setOpenAddress = (d) => {
    if (d.states == null || d.district == null) {
      Geocode.fromLatLng(d.latitude, d.longitude).then(
        (response) => {
          console.log(response);
          for (
            var i = 0;
            i < response.results[0].address_components.length;
            i++
          ) {
            for (
              var b = 0;
              b < response.results[0].address_components[i].types.length;
              b++
            ) {
              if (
                response.results[0].address_components[i].types[b] ===
                "administrative_area_level_2"
              ) {
                var city = response.results[0].address_components[i];
                d.formattedAddress = response.results[0].formatted_address;
                d.district = city.long_name;
                //console.log(d);
                break;
              }
            }
          }

          for (
            var i = 0;
            i < response.results[0].address_components.length;
            i++
          ) {
            for (
              var b = 0;
              b < response.results[0].address_components[i].types.length;
              b++
            ) {
              if (
                response.results[0].address_components[i].types[b] ===
                "administrative_area_level_1"
              ) {
                var state = response.results[0].address_components[i];
                d.states = state.long_name;
                //console.log(d);
                break;
              }
            }
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
    return d;
  };
  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [longitude, latitude]
  );
  useEffect(() => {
    const doWork = () => {
      console.log("EVERY ???");
      if (user !== null && localStorage.getItem("token")) {
        console.log(center);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setLocation(position.coords.latitude, position.coords.longitude)
              .then((userData) => {
                console.log(userData);
                setUpdatedUser(setOpenAddress(user));
              })
              .catch((err) => console.log(err));
            fetchTrucks()
              .then((data) => {
                setTrucks(data);
                //console.log(data);
                setTrucks(setAddress(data));
                setIsLoading(false);
              })
              .catch((error) => {
                toast.error("Hata !", {
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

            fetchCities()
              .then((data) => {
                const sortedList = data.sort((a, b) => a.name.localeCompare(b.name));
                setCities(sortedList);
                data = data.filter((city) => {
                  return city.urgency >= 3;
                });
                setUrgentCities(data);
                setIsLoading(false);
              })
              .catch((error) => {
                toast.error("Hata !", {
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
            fetchUsers()
              .then((data) => {
                let filtered = data.filter((d) => d.id !== user.id);
                let filteredArr = filtered.filter(
                  (f) => f.role.name !== "TRUCK_DRIVER"
                );
                let filteredDrivers = filtered.filter(
                  (f) => f.role.name === "TRUCK_DRIVER"
                );
                setUsers(setAddress(filteredArr));
              })
              .catch((err) => console.log(err));

            fetchFreeDrivers()
              .then((data) => {
                setDrivers(data);
              })
              .catch((err) => console.log(err));
          },
          (positionError) => {
            console.log(positionError);
          }
        );
      }
    };
    doWork();
    const interval = setInterval(() => {
      doWork();
    }, 1000 * 60);
    return () => {
      clearInterval(interval);
    };
  }, [localStorage.getItem("token")]);
  return isLoaded || isLoading ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100vh" }}
      center={{ lat: latitude, lng: longitude }}
      zoom={10}
      onClick={handleMapLeftClick}
    >
      {markers.map((marker, index) => (
        <MarkerF
          key={index}
          position={{
            lat: marker.lat,
            lng: marker.lng,
          }}
          onClick={(props, _marker) => {
            setSelectedElement(marker);
            setActiveMarker(_marker);
          }}
          onRightClick={() => removeMarker(marker)}
        >
          {selectedElement && marker === selectedElement ? (
            <InfoWindowF
              visible={showInfoWindow}
              marker={activeMarker}
              onCloseClick={() => {
                setSelectedElement(null);
              }}
            >
              <div style={{ padding: 0, color: "black" }}>
                {user.role.name === "ADMIN" && (
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
                              name="content"
                              label="İçerik"
                              id="content"
                              autoComplete="content"
                            />
                          </Grid>

                          <Grid item xs={6} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel id="select-label-city">
                                Varış Şehiri
                              </InputLabel>
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
                              <InputLabel id="select-label-driver">
                                Boş Şöfor
                              </InputLabel>
                              <Select
                                labelId="select-label-driver"
                                id="driverSelect"
                                value={driver}
                                label="Boş Şöfor"
                                onChange={handleChangeDriver}
                              >
                                {drivers.map((driver, index) => (
                                  <MenuItem key={index} value={driver}>
                                    {driver.name + " " + driver.lastName}
                                  </MenuItem>
                                ))}
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
                )}
              </div>
            </InfoWindowF>
          ) : null}
        </MarkerF>
      ))}
      <MarkerF
        position={center}
        icon={{
          url: getImageByRole(user.role.name),
          scaledSize: new window.google.maps.Size(40, 40),
        }}
        onClick={(props, marker) => {
          setSelectedElement(user);
          setActiveMarker(marker);
        }}
      >
        {selectedElement && user === selectedElement ? (
          <InfoWindowF
            visible={showInfoWindow}
            marker={activeMarker}
            onCloseClick={() => {
              setSelectedElement(null);
            }}
          >
            <div style={{ padding: 0, color: "black" }}>
              <h2>Burdasınısız</h2>
              <h3>
                {updatedUser.states}, {updatedUser.district}
              </h3>
              <h4>{user.name + " " + user.lastName}</h4>
              <h5>{"Rol: " + getRole(user.role.name)}</h5>
              {user.role.name === "TRUCK_DRIVER" && (
                <Button variant="outlined" onClick={deliverGoods}>
                  Teslim Et
                </Button>
              )}
            </div>
          </InfoWindowF>
        ) : null}
      </MarkerF>

      {trucks &&
        trucks.map((truck, index) => (
          <MarkerF
            title={truck.licensePlate}
            key={index}
            position={{
              lat: Number(truck.latitude),
              lng: Number(truck.longitude),
            }}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/4047/4047296.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            onClick={(props, marker) => {
              setSelectedElement(truck);
              setActiveMarker(marker);
            }}
          >
            {selectedElement && truck === selectedElement ? (
              <InfoWindowF
                visible={showInfoWindow}
                marker={activeMarker}
                onCloseClick={() => {
                  setSelectedElement(null);
                }}
              >
                <div style={{ padding: 0, color: "black" }}>
                  <h3>
                    {truck.states}, {truck.district}
                  </h3>
                  <h4>
                    Şöfor: {truck.user.name} {truck.user.lastName}
                  </h4>
                  <h4>
                    {truck.licensePlate} plakalı tır {truck.fromCity.name}{" "}
                    şehrinden yola çıktı.
                  </h4>
                  <h4>{truck.destinationCity.name} şehrine gidiyor.</h4>
                  <h5>Tırın durumu "{truck.status}" </h5>
                  <h5>
                    {truck.water + " Litre su, " + truck.food + " kg yiyecek, " + truck.tent + " adet çadır, " + truck.clothing + " kişilik kıyafet taşıyor."}
                    <Link
                      to={`truck/${truck.id}`}
                      state={{
                        truck,
                      }}
                    >
                      daha fazla bilgi için
                    </Link>
                  </h5>
                </div>
              </InfoWindowF>
            ) : null}
          </MarkerF>
        ))}
      {urgentCities &&
        urgentCities.map((city, index) => (
          <MarkerF
            key={index}
            position={{
              lng: Number(city.longitude),
              lat: Number(city.latitude),
            }}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/3391/3391472.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            onClick={(props, marker) => {
              setSelectedElement(city);
              setActiveMarker(marker);
            }}
          >
            {selectedElement && city === selectedElement ? (
              <InfoWindowF
                visible={showInfoWindow}
                marker={activeMarker}
                onCloseClick={() => {
                  setSelectedElement(null);
                }}
              >
                <div style={{ padding: 0, color: "black" }}>
                  <h3>{city.name}</h3>
                  <h4>
                    {"ACİLİYET SEVİYESİ (5-çok, 1-az) : " +
                      city.urgency +
                      " " +
                      getUrgency(city.urgency)}
                  </h4>
                  <h4>{"İHTİYAÇ LİSTESİ: " + city.water + " Litre su, " + city.food + " kg yiyecek, " + city.tent + " adet çadır, " + city.clothing + " kişilik kıyafet taşıyor."}</h4>
                  <h5>{"NÜFUS: " + city.population}</h5>
                </div>
              </InfoWindowF>
            ) : null}
          </MarkerF>
        ))}
      {users &&
        users.map((user, index) => (
          <MarkerF
            key={index}
            position={{
              lng: Number(user.longitude),
              lat: Number(user.latitude),
            }}
            icon={{
              url: getImageByRole(user.role.name),
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            onClick={(props, marker) => {
              setSelectedElement(user);
              setActiveMarker(marker);
            }}
          >
            {selectedElement && user === selectedElement ? (
              <InfoWindowF
                visible={showInfoWindow}
                marker={activeMarker}
                onCloseClick={() => {
                  setSelectedElement(null);
                }}
              >
                <div style={{ padding: 0, color: "black" }}>
                  <h3>
                    {user.states}, {user.district}
                  </h3>
                  <h4>{user.name + " " + user.lastName}</h4>
                  <h5>{"Rol: " + getRole(user.role.name)}</h5>
                </div>
              </InfoWindowF>
            ) : null}
          </MarkerF>
        ))}
    </GoogleMap>
  ) : (
    <LoadingComponent />
  );
};
export default Map;
