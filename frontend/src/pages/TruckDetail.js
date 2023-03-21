import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const TruckDetail = () => {

  const location = useLocation();
  const { truck } = location.state;
  console.log(truck);
  useEffect(() => {
      console.log("Hello");
  }, []);
  return(
    <div>
        <p>{truck.user.name}</p>
        <p>{truck.states}</p>
        <p>{truck.district}</p>
        <p>{truck.formattedAddress}</p>
    </div>
  );
};

export default TruckDetail;
