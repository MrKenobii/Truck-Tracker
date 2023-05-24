import { useState, useEffect, useMemo, useContext } from "react";
import { useLocation } from "react-router-dom";
import Geocode from "react-geocode";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  InfoWindowF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { BASE_URL } from "../constants/urls";
import LoadingComponent from "./LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import CreateTruck from "./CreateTruck";
import { SocketContext } from "../context/socket";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Map = () => {
  const { user } = useSelector((state) => state.user);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showInfoWindow, setInfoWindowFlag] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [markLatitude, setMarkLatitude] = useState(null);
  const [markLongitude, setMarkLongitude] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [cities, setCities] = useState([]);
  const [urgentCities, setUrgentCities] = useState([]);
  const [usersTruck, setUsersTruck] = useState(null);
  const [isDelivered, setIsDelivered] = useState(false);
  const [isTookOff, setIsTookOff] = useState(false);
  const [isEscorted, setIsEscorted] = useState(false);
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [updatedUser, setUpdatedUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);

  const socket = useContext(SocketContext);

  const handleMapLeftClick = (e) => {
    if (user.role.name === "ADMIN") {
      setMarkLongitude(e.latLng.lng());
      setMarkLatitude(e.latLng.lat());
      setMarkers((current) => [
        ...current,
        {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      ]);
    }
  };
  const gatherUnits = (obj) => {
    const filteredUsers = users.filter((u) => u.role.name === "POLICE");
    socket.emit("gatherUnits", {
      senderName: user,
      recievers: filteredUsers.length > 0 ? filteredUsers : users,
      content: `${
        user.name + " " + user.lastName
      } tarafından acil karakola çağrılıyorsunuz.`,
      emergencyLevel: 5,
    });
  };
  const sendHelpToCity = (city) => {
    socket.emit("sendToCops", {
      senderName: user,
      recievers: users,
      content: `Koordinatları (${city.latitude}, ${city.longitude}) olan, ${city.formattedAddress} konumundaki, ${city.name} şehrinin toplanma alanına polis yardımı gerekmektedir.`,
      emergencyLevel: 5,
    });
  }
  const canDeliver = () => {
    if (usersTruck) {
      console.log(usersTruck);
      console.log({
        lat: Math.abs(
          usersTruck?.latitude - usersTruck.destinationCity?.latitude
        ),
        lng: Math.abs(
          usersTruck?.longitude - usersTruck.destinationCity?.longitude
        ),
      });
      if (
        Math.abs(usersTruck?.latitude - usersTruck?.destinationCity?.latitude) <
          0.999 &&
        Math.abs(
          usersTruck?.longitude - usersTruck?.destinationCity?.longitude
        ) < 0.999
      ) {
        return true;
      } else return false;
    } else return false;
  };
  const callCops = (obj) => {
    console.log(obj);
    if (obj.hasOwnProperty("licensePlate")) {
      var closestStation;
      var minVal;
      let policeStationUsers = users.filter(u => u.role.name === "POLICE_STATION");
      for(let i = 0; i < policeStationUsers.length; i++){
        let result = Math.sqrt(Math.pow((Number(policeStationUsers[i].latitude) - Number(obj.latitude)), 2) + Math.pow((Number(policeStationUsers[i].longitude) - Number(obj.longitude)), 2));
        if(minVal){
          if(result < minVal){
            minVal = result;
            closestStation = policeStationUsers[i];
          }
        } else {
          
          minVal = result;
          closestStation = policeStationUsers[i];
        }
        if(minVal == 0) break;
      }
      if(minVal && closestStation){
        let admins = users.filter(u => u.role.name === "ADMIN");
        socket.emit("sendToCops", {
          senderName: user,
          recievers: [closestStation, ...admins],
          content: `Koordinatları (${obj.latitude + ", " + obj.longitude}) olan, ${obj.formattedAddress} konumundaki '${obj.licensePlate}' plakalı tıra polis yardımı gerekmektedir.`,
          emergencyLevel: 5,
        });

      } else {
        socket.emit("sendToCops", {
          senderName: user,
          recievers: users,
          content: `Koordinatları (${obj.latitude + ", " + obj.longitude}) olan, ${obj.formattedAddress} konumundaki '${obj.licensePlate}' plakalı tıra polis yardımı gerekmektedir.`,
          emergencyLevel: 5,
        });
      }
    } else {
      var closestStation;
      var minVal;
      let policeStationUsers = users.filter(u => u.role.name === "POLICE_STATION");
      for(let i = 0; i < policeStationUsers.length; i++){
        let result = Math.sqrt(Math.pow((Number(policeStationUsers[i].latitude) - Number(obj.latitude)), 2) + Math.pow((Number(policeStationUsers[i].longitude) - Number(obj.longitude)), 2));
        if(minVal){
          if(result < minVal){
            minVal = result;
            closestStation = policeStationUsers[i];
          }
        } else {
          
          minVal = result;
          closestStation = policeStationUsers[i];
        }
        if(minVal == 0) break;
      }
      if(minVal && closestStation){
        let admins = users.filter(u => u.role.name === "ADMIN");

        socket.emit("sendToCops", {
          senderName: user,
          recievers: [closestStation, ...admins],
          content: `Koordinatları (${obj.latitude + ", " + obj.longitude}) olan, ${obj.formattedAddress} konumundaki '${usersTruck.licensePlate}' plakalı tıra polis yardımı gerekmektedir.`,
          emergencyLevel: 5,
        });
      } else {
        socket.emit("sendToCops", {
          senderName: user,
          recievers: users,
          content: `Koordinatları (${obj.latitude + ", " + obj.longitude}) olan, ${obj.formattedAddress} konumundaki '${usersTruck.licensePlate}' plakalı tıra polis yardımı gerekmektedir.`,
          emergencyLevel: 5,
        });
      }
      
    }
  };
  const removeMarker = (marker) => {
    const newMarkers = markers.filter(
      (m) => m.lat !== marker.lat && m.lng !== marker.lng
    );
    setMarkers(newMarkers);
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
  const deliverGoods = () => {
    axios
      .put(`${BASE_URL}/truck/${usersTruck.id}/deliver`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.status === 200) {
          setIsDelivered(true);
          const newUsers = users.filter(
            (u) => u.role.name === "ADMIN" || u.role.name === "POLICE"
          );
          socket.emit("sendNotification", {
            senderName: user,
            recievers: newUsers,
            content: `${res.data.licensePlate} plakalı tır mallarını ${usersTruck.destinationCity.name} şehrine başarıyla teslim etti.`,
            emergencyLevel: 5,
          });
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
        } else {
          toast.error(`Birşeyler ters gitti!`, {
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
      .catch((er) => console.log(er));
  };
  const takeOff = async () => {
    let res = await axios.put(`${BASE_URL}/truck/${usersTruck.id}/take-off`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    if (res.status === 200) {
      console.log(res.data);
      setIsTookOff(true);
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
    } else {
      console.log("error");
    }
  };
  const escortTruck = async (truck) => {
    console.log(truck);
    let res = await axios.put(
      `${BASE_URL}/truck/${truck.id}/escort/user/${user.id}`,
      {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      }
    );
    if (res.status === 200) {
      console.log(res.data);
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
    } else {
      console.log("error");
    }
  };
  const setTruckLocation = async (lat, lng, truck) => {
    return await axios.put(
      `${BASE_URL}/truck/${truck.id}/location`,
      {
        longitude: lng,
        latitude: lat,
      },
      {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      }
    );
  };
  const setTruckOfUser = () => {
    setUsersTruck(trucks.find((t) => t.user.id === user.id));
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
            // console.log(response);

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
                //setTrucks(data);
                if (user.role.name === "TRUCK_DRIVER") {
                  const truck = data.find((t) => {
                    return t.user.id === user.id;
                  });
                  console.log({
                    truckLat: truck.latitude,
                    truckLng: truck.longitude,
                    truckDestLat: truck.destinationCity.latitude,
                    truckDestLng: truck.destinationCity.longitude,
                  });
                  const directionsService =
                    new window.google.maps.DirectionsService();
                  const directionsRenderer =
                    new window.google.maps.DirectionsRenderer();
                  var current = new window.google.maps.LatLng(
                    truck.latitude,
                    truck.longitude
                  );
                  if (truck.arrived) {
                    var dest = new window.google.maps.LatLng(
                      truck.fromCity.latitude,
                      truck.fromCity.longitude
                    );
                  } else {
                    var dest = new window.google.maps.LatLng(
                      truck.destinationCity.latitude,
                      truck.destinationCity.longitude
                    );
                  }
                  var request = {
                    origin: current,
                    destination: dest,
                    travelMode: "DRIVING",
                  };
                  directionsService.route(request, function (response, status) {
                    if (status == "OK") {
                      setDirections(response);
                      directionsRenderer.setDirections(response);
                    }
                  });
                  console.log(truck);
                  setUsersTruck(truck);
                  console.log(truck);
                  setIsDelivered(truck.arrived);
                  setIsTookOff(truck.tookOff);
                  setIsEscorted(truck.escorted);
                  setTruckLocation(
                    position.coords.latitude,
                    position.coords.longitude,
                    truck
                  )
                    .then((tRes) => {
                      if (tRes.status === 200) {
                        console.log(tRes.data);
                        const newArr = data.filter((t) => t.id !== truck.id);
                        setTrucks(setAddress(newArr));
                      }
                    })
                    .catch((err) => console.log(err));
                } else {
                  setTrucks(setAddress(data));
                }

                // console.log(data);
                // setTrucks(setAddress(data));
                setIsLoading(false);
              })
              .catch((error) => {
                
                console.log(error);
              });

            fetchCities()
              .then((data) => {
                const sortedList = data.sort((a, b) =>
                  a.name.localeCompare(b.name)
                );
                setCities(sortedList);
                data = data.filter((city) => {
                  return city.urgency >= 3;
                });
                
                setUrgentCities(setAddress(data));
                setIsLoading(false);
              })
              .catch((error) => {
                
                console.log(error);
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
    setIsLoading(true);
    doWork();
    setIsLoading(false);
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
      center={{
        lat: markLatitude ? markLatitude : latitude,
        lng: markLongitude ? markLongitude : longitude,
      }}
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
                  <CreateTruck
                    marker={marker}
                    urgentCities={urgentCities}
                    cities={cities}
                    drivers={drivers}
                  />
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
              <h2>Burdasınız</h2>
              <h3>
                {updatedUser.states}, {updatedUser.district}
              </h3>
              <h4>{user.name + " " + user.lastName}</h4>
              <h5>{"Rol: " + getRole(user.role.name)}</h5>
              {user.role.name === "POLICE_STATION" && (
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  onClick={() => gatherUnits(user)}
                >
                  Birimleri Topla
                </Button>
              )}
              {user.role.name === "TRUCK_DRIVER" && (
                <>
                  <DirectionsRenderer directions={directions} />
                  {!isTookOff ? (
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      onClick={takeOff}
                    >
                      Yola Çık
                    </Button>
                  ) : isDelivered ? (
                    <Card
                      sx={{
                        height: "%50",
                        minWidth: 275,
                        backgroundColor: "#1876D1",
                        color: "white",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          component="p"
                          sx={{ fontSize: 12 }}
                        >
                          Malları teslim ettiniz
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : !canDeliver() ? (
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      onClick={deliverGoods}
                    >
                      Teslim Et
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        disabled
                      >
                        Teslim Et
                      </Button>
                      <p>Varış noktasına yaklaşıldığında aktif olur</p>
                    </>
                  )}
                </>
              )}
              {user.role.name === "TRUCK_DRIVER" && !usersTruck.escorted && (
                <Button
                  type="button"
                  fullWidth
                  color="error"
                  variant="contained"
                  onClick={() => callCops(user)}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Polisleri çağır
                </Button>
              )}
            </div>
          </InfoWindowF>
        ) : null}
      </MarkerF>

      {trucks &&
        trucks
          .filter((t) => !t.arrived)
          .map((truck, index) => (
            <div key={index}>
              {truck.user.id !== user.id && (
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
                    console.log(props.latLng.lat());
                    console.log(props.latLng.lng());
                    setMarkLatitude(props.latLng.lat());
                    setMarkLongitude(props.latLng.lng());
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
                          {truck.water +
                            " Litre su, " +
                            truck.food +
                            " kg yiyecek, " +
                            truck.tent +
                            " adet çadır, " +
                            truck.clothing +
                            " kişilik kıyafet taşıyor."}
                        </h5>
                        {(user.role.name === "ADMIN" ||
                          user.role.name === "POLICE_STATION") &&
                          !truck.escorted && (
                            <Button
                              type="button"
                              fullWidth
                              variant="contained"
                              onClick={() => callCops(truck)}
                              sx={{ mt: 3, mb: 2 }}
                            >
                              Polisleri yönlendir
                            </Button>
                          )}
                        {(user.role.name === "ADMIN" ||
                          user.role.name === "POLICE_STATION") &&
                          truck.escorted && (
                            <Card
                              sx={{
                                height: "%50",
                                minWidth: 275,
                                backgroundColor: "#1876D1",
                                color: "white",
                              }}
                            >
                              <CardContent>
                                <Typography
                                  variant="h6"
                                  component="div"
                                  sx={{ fontSize: 12 }}
                                >
                                  Polis eşlik ediyor
                                </Typography>
                              </CardContent>
                            </Card>
                          )}
                        {!(
                          user.role.name === "ADMIN" ||
                          user.role.name === "POLICE_STATION"
                        ) &&
                          truck.escorted && (
                            <Card
                              sx={{
                                height: "%50",
                                minWidth: 275,
                                backgroundColor: "#1876D1",
                                color: "white",
                              }}
                            >
                              <CardContent>
                                <Typography
                                  variant="h6"
                                  component="div"
                                  sx={{ fontSize: 15 }}
                                >
                                  Polis eşlik ediyor
                                </Typography>
                              </CardContent>
                            </Card>
                          )}
                        {!(
                          user.role.name === "ADMIN" ||
                          user.role.name === "POLICE_STATION"
                        ) &&
                          !truck.escorted && (
                            <Card
                              sx={{
                                height: "%50",
                                minWidth: 275,
                                backgroundColor: "#1876D1",
                                color: "white",
                              }}
                            >
                              <CardContent>
                                <Typography
                                  variant="h6"
                                  component="div"
                                  sx={{ fontSize: 15 }}
                                >
                                  Tıra eşlik edilmiyor
                                </Typography>
                              </CardContent>
                              {user.role.name === "POLICE" && (
                                <CardActions>
                                  <Button
                                    variant="contained"
                                    color="warning"
                                    size="small"
                                    onClick={() => escortTruck(truck)}
                                  >
                                    Tıra eşlik et!
                                  </Button>
                                </CardActions>
                              )}
                            </Card>
                          )}
                      </div>
                    </InfoWindowF>
                  ) : null}
                </MarkerF>
              )}
            </div>
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
              setMarkLatitude(props.latLng.lat());
              setMarkLongitude(props.latLng.lng());
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
                  <h4>
                    {"İHTİYAÇ LİSTESİ: " +
                      city.water +
                      " Litre su, " +
                      city.food +
                      " kg yiyecek, " +
                      city.tent +
                      " adet çadır, " +
                      city.clothing +
                      " kişilik kıyafet ihtiyacı var."}
                  </h4>
                  <h5>{"NÜFUS: " + city.population}</h5>
                  {(user.role.name === "ADMIN" ||
                    (user.role.name === "POLICE_STATION" && user.city.name === city.name)) && (
                      <Button
                      type="button"
                      variant="contained"
                      onClick={() => sendHelpToCity(city)}
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Polisleri yönlendir
                    </Button>
                    )}
                </div>
              </InfoWindowF>
            ) : null}
          </MarkerF>
        ))}
      {user.role.name === "ADMIN" &&
        users &&
        users
          .filter((u) => u.role.name !== "NORMAL" && u.role.name !== "ADMIN")
          .map((user, index) => (
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
                setMarkLatitude(props.latLng.lat());
                setMarkLongitude(props.latLng.lng());
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
      {(user.role.name === "TRUCK_DRIVER" ||
        user.role.name === "POLICE" ||
        user.role.name === "POLICE_STATION") &&
        users &&
        users
          .filter((u) => u.role.name === "POLICE_STATION")
          .map((user, index) => (
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
                setMarkLatitude(props.latLng.lat());
                setMarkLongitude(props.latLng.lng());
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
