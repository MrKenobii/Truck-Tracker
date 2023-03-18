import { useState, useEffect, useMemo } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import { toast } from "react-toastify";

//38.473619157092614, 27.135962991566277
//41.41639660475681, 29.602251748436288
//40.99893685519544, 28.857916572952533
// https://dev.to/lauratoddcodes/using-the-google-maps-api-in-react-31ph
const Map = () => {
  const fetchTrucks = async () => {
    let res = await axios.get("http://localhost:8080/api/v1/truck", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    return res.data;
  };
  const fetchCities = async () => {
    let res = await axios.get("http://localhost:8080/api/v1/city", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    return res.data;
  };
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDVrg8ingS4jIjJVTp7iH3vHOXITV4jDg8",
  });
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [trucks, setTrucks] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [longitude, latitude]
  );
  useEffect(() => {
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
            console.log(data);
            setTrucks(data);
            setIsLoading(true);
            toast.success("Trucks came!", {
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
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
  }, []);
  return isLoaded ? (
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
            key={index}
            position={{
              lat: Number(truck.latitude),
              lng: Number(truck.longitude),
            }}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/4047/4047296.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        ))}
      {cities &&
        cities.map((city, index) => (
          <MarkerF
            key={index}
            position={{
              lng: Number(city.latitude),
              lat: Number(city.longitude),
            }}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/3391/3391472.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        ))}
    </GoogleMap>
  ) : (
    <></>
  );
};
export default Map;
