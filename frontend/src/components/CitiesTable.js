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

const columns = [
  { id: "id", label: "ID", minWidth: 150 },
  { id: "name", label: "İsim", minWidth: 170 },
  { id: "longitude", label: "Boylam", minWidth: 170 },
  { id: "latitude", label: "Enlem", minWidth: 170 },
  { id: "population", label: "Nüfus", minWidth: 170 },
  { id: "urgency", label: "Aciliyet Seviyesi", minWidth: 170 },
];

const CitiesTable = () => {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    const getCities = async (token) => {
      return await axios.get("http://localhost:8080/api/v1/city", {
        headers: { Authorization: `Bearer ${token}` },
      });
    };
    const token = localStorage.getItem("token");
    console.log(token);
    getCities(token)
      .then((data) => {
        console.log(data.data);
        const sortedList = data.data.sort((a, b) => a.name.localeCompare(b.name));
        setRows(sortedList);
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
                  key={index}
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
                        <TableCell key={index} align="right">
                          {/* {column.format && typeof value === "number"
                            ? column.format(value)
                            : value} */}
                          {value}
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

export default CitiesTable;
