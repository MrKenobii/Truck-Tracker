import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const TruckDetail = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);
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
