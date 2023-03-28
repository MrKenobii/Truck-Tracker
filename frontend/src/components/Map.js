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

//38.473619157092614, 27.135962991566277
//41.41639660475681, 29.602251748436288
//40.99893685519544, 28.857916572952533
// https://dev.to/lauratoddcodes/using-the-google-maps-api-in-react-31ph
const delay = 5 * 30;
const apiKey = "AIzaSyDVrg8ingS4jIjJVTp7iH3vHOXITV4jDg8";
const Map = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showInfoWindow, setInfoWindowFlag] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [trucks, setTrucks] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  const fetchTrucks = async () => {
    setIsLoading(false);
    let res = await axios.get(`${BASE_URL}/truck`, {
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
    return data.map((truck, index) => {
      if (
        (truck.states == null || truck.district == null) &&
        truck.latitude !== null
      ) {
        Geocode.fromLatLng(truck.latitude, truck.longitude).then(
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
                  truck.formattedAddress =
                    response.results[0].formatted_address;
                  truck.district = city.long_name;
                  //console.log(truck);
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
                  truck.states = state.long_name;
                  //console.log(truck);
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
      return truck;
    });
  };
  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [longitude, latitude]
  );
  useEffect(() => {
    const doWork = () => {
      console.log("EVERY ???");
      if (localStorage.getItem("token")) {
        console.log(center);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            console.log(longitude);
            console.log(latitude);
            fetchTrucks()
              .then((data) => {
                setTrucks(data);
                //console.log(data);
                setTrucks(setAddress(data));
                console.log("--------------------");
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

            fetchCities()
              .then((data) => {
                data = data.filter((city) => {
                  return city.urgency >= 4;
                });
                setCities(data);
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
      // onLoad={onLoad}
      // onUnmount={onUnmount}
    >
      <MarkerF
        position={center}
        icon={{
          url: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
          scaledSize: new window.google.maps.Size(20, 20),
        }}
      />
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
                    Driver: {truck.user.name} {truck.user.lastName}
                  </h4>
                  <h5>
                    {truck.licensePlate} to {truck.destinationCity.name} with
                    status "{truck.status}"
                  </h5>
                  <h5>
                    Carrying {truck.content}.{" "}
                    <Link
                      to={`truck/${truck.id}`}
                      state={{
                        truck,
                      }}
                    >
                      more info
                    </Link>
                  </h5>
                </div>
              </InfoWindowF>
            ) : null}
          </MarkerF>
        ))}
      {cities &&
        cities.map((city, index) => (
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
          >
            {/* <InfoWindowF>
                  <h4>{city.urgency}</h4>
              </InfoWindowF> */}
          </MarkerF>
        ))}
    </GoogleMap>
  ) : (
    <LoadingComponent />
  );
};
export default Map;
