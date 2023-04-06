import { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import Geocode from "react-geocode";
import axios from "axios";
import { BASE_URL } from "../constants/urls";

const apiKey = "AIzaSyDVrg8ingS4jIjJVTp7iH3vHOXITV4jDg8";
Geocode.setApiKey(apiKey);
Geocode.setLanguage("en");
Geocode.setRegion("TR");

const CitiesUpdatedTable = () => {
  const [tableData, setTableData] = useState([]);
  

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
        accessorKey: "name",
        header: "İsim",
        size: 140,
      },
      {
        accessorKey: "population",
        header: "Nüfus",
      },
      {
        accessorKey: "urgency",
        header: "Aciliyet Durumu",
      },
      {
        accessorKey: "latitude",
        header: "Enlem",
      },
      {
        accessorKey: "longitude",
        header: "Boylam",
      },
    ],
    []
  );
  useEffect(() => {
    const getCities = async (token) => {
      return await axios.get(`${BASE_URL}/city`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };
    const token = localStorage.getItem("token");
    console.log(token);
    getCities(token)
      .then((data) => {
        console.log(data.data);
        const sortedList = data.data.sort((a, b) => a.name.localeCompare(b.name));
        setTableData(sortedList);
      })
      .catch((error) => console.log(error));
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
        editingMode="modal"
      />
    </>
  );
};

export default CitiesUpdatedTable;
