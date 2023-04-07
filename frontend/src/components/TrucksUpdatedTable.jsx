import { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import Geocode from "react-geocode";
import axios from "axios";
import { BASE_URL } from "../constants/urls";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
Geocode.setApiKey(apiKey);
Geocode.setLanguage("en");
Geocode.setRegion("TR");

const TrucksUpdatedTable = () => {
  
  const [tableData, setTableData] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const setAddress = (data) => {
     data.map((d, index) => {
      if ((d.states == null || d.district == null) && data.latitude !== null) {
       return Geocode.fromLatLng(d.latitude, d.longitude).then(
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
            return d;
          },
          (error) => {
            console.error(error);
          }
        );
      }
    });
    return data;
  };
  const setAddress2 = (d) => {
    if ((d.states == null || d.district == null) && d.latitude !== null) {
      return Geocode.fromLatLng(d.latitude, d.longitude).then(
        (response) => {
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
          //console.log(d.formattedAddress);
        //   return {
        //     formattedAddress: d.formattedAddress,
        //     district: d.district,
        //   };
        return d;
        },
        (error) => {
          console.error(error);
        }
      );
    }
    return d;
  };


  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "water",
        header: "SU (Litre) ",
        size: 140,
      },
      {
        accessorKey: "food",
        header: "Yiyecek (KG)",
        size: 140,
      },
      {
        accessorKey: "tent",
        header: "Çadır (Adet",
      },
      {
        accessorKey: "clothing",
        header: "Kıyafet (Kişi Başı)",
      },
      {
        accessorKey: "driver",
        header: "Şöför",
      },
      {
        accessorKey: "destinationCity",
        header: "Hedef Şehir",
      },
      {
        accessorKey: "fromCity",
        header: "Ayrılan Şehir",
      },
      {
        accessorKey: "licensePlate",
        header: "Plaka",
      },
      {
        accessorKey: "latitude",
        header: "Enlem",
      },
      {
        accessorKey: "longitude",
        header: "Boylam",
      },
      {
        accessorKey: "status",
        enableEditing: false,
        header: "Durum",
      },
      {
        accessorKey: "isEscorted",
        enableEditing: false,
        header: "Polis Yardımı Var mı",
      },
      {
        accessorKey: "isArrived",
        enableEditing: false,
        header: "Varıldı mı",

      },
    ],
    []
  );
  useEffect(() => {
    const getTrucks = async (token) => {
      return await axios.get(`${BASE_URL}/truck`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };
    if(user && localStorage.getItem("token")){
      if(user.role.name === "ADMIN"){
        const token = localStorage.getItem("token");
        getTrucks(token)
          .then((data) => {
            const response = data.data.map((res) => {
              let fromCity = res.fromCity.name;
              let destinationCity = res.destinationCity.name;
              let driver = res.user.name + " " + res.user.lastName;
              let isArrived = res.arrived ? "EVET" : "HAYIR";
              let isEscorted = res.escorted ? "EVET" : "HAYIR";
              delete res.fromCity;
              delete res.destinationCity;
              delete res.user
    
              return { ...res, fromCity, destinationCity, driver, isArrived, isEscorted };
            });
            setTableData(response);
          })
          .catch((error) => console.log(error));

      } else {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
      />
      
    </>
  );
};

export default TrucksUpdatedTable;
