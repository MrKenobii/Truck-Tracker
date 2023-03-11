import {useState, useEffect, useMemo} from "react";
import {GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';


//38.473619157092614, 27.135962991566277
//41.41639660475681, 29.602251748436288
//40.99893685519544, 28.857916572952533
// https://dev.to/lauratoddcodes/using-the-google-maps-api-in-react-31ph
const Map = () => {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDVrg8ingS4jIjJVTp7iH3vHOXITV4jDg8"
    });
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const center = useMemo(() => ({ lat: latitude, lng: longitude }), [longitude, latitude]);
    useEffect(() => {
        console.log(center);
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            console.log(longitude);
            console.log(latitude);
        }, (positionError) => {
            console.log(positionError);
        });
    }, [])
    return (
        isLoaded ? (
            <GoogleMap
                mapContainerStyle={{width: "100%", height: "100vh"}}
                center={{ lat: latitude, lng: longitude}}
                zoom={10}
                // onLoad={onLoad}
                // onUnmount={onUnmount}
            >

                <MarkerF position={center} icon={{ url: "https://cdn-icons-png.flaticon.com/512/25/25694.png", scaledSize: new window.google.maps.Size(20, 20)} }  />
            </GoogleMap>
        ) : <></>
    )
}
export default Map;