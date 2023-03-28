import { useEffect } from "react";
import Map from "../components/Map";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token)
        if(token === null){
            console.log("no token Found");
            navigate("/login");
        }
    }, []);
  return (
    <>
      <Map />
    </>
  );
};

export default HomePage;
