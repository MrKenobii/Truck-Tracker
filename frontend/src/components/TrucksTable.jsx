import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { BASE_URL } from "../constants/urls";

const columns = [
  { id: "id", label: "ID", minWidth: 170 },
  { id: "water", label: "SU (Litre)", minWidth: 170 },
  { id: "food", label: "Yiyecek (KG)", minWidth: 170 },
  { id: "tent", label: "Çadır (Adet)", minWidth: 170 },
  { id: "clothing", label: "Kıyafet (Kişi Başı)", minWidth: 170 },
  { id: "driver", label: "Şöfor İsmi", minWidth: 170 },
  { id: "destinationCity", label: "Hedef Şehir", minWidth: 170 },
  { id: "fromCity", label: "Ayrılan Şehir", minWidth: 170 },
  { id: "latitude", label: "Enlem", minWidth: 170 },
  { id: "longitude", label: "Boylam", minWidth: 170 },
  { id: "licensePlate", label: "Plaka", minWidth: 170 },
  { id: "status", label: "Durumu", minWidth: 170 },
  { id: "escorted", label: "Polis Yardımı Var mı", minWidth: 170 },
  { id: "arrived", label: "Varıldı mı", minWidth: 170 },
];

const TrucksTable = () => {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const checkBoolean = ( val ) => {
        if(typeof val === "boolean") return true;
        else return false;
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    const getTrucks = async (token) => {
      return await axios.get(`${BASE_URL}/truck`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };
    const token = localStorage.getItem("token");
    getTrucks(token)
      .then((data) => {
        const response = data.data.map((res) => {
          let fromCity = res.fromCity.name;
          let destinationCity = res.destinationCity.name;
          let driver = res.user.name;

          delete res.fromCity;
          delete res.destinationCity;
          delete res.user

          return { ...res, fromCity, destinationCity, driver };
        });
        setRows(response);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.id + "" + index}
                  align="right"
                  style={{ minWidth: 170 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column, index) => {
                        const value = row[column.id];
                      return (
                          
                        <TableCell key={column.id + " " + index} align="right">
                          {/* {column.format && typeof value === "number"
                            ? column.format(value)
                            : value} */}
                          {checkBoolean(value) ? ( value === true ? "EVET" : "HAYIR") : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TrucksTable;
