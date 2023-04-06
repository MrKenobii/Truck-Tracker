import React, { useCallback, useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Geocode from "react-geocode";
import { data, states } from "./makeData";
import axios from "axios";
import { BASE_URL } from "../constants/urls";

const apiKey = "AIzaSyDVrg8ingS4jIjJVTp7iH3vHOXITV4jDg8";
Geocode.setApiKey(apiKey);
Geocode.setLanguage("en");
Geocode.setRegion("TR");

const UsersUpdatedTable = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [addr, setAddr] = useState({});

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

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
    if ((d.states == null || d.district == null) && data.latitude !== null) {
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
    return data;
  };

  const handleDeleteRow = useCallback(
    (row) => {
      //   if (
      //     !confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
      //   ) {
      //     return;
      //   }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

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
        header: "Ad",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "lastName",
        header: "Soyad",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "email",
        header: "E-mail",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "email",
        }),
      },
      {
        accessorKey: "city",
        header: "Şehir",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "status",
        header: "DURUM",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "password",
        header: "Şifre",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "phoneNumber",
        header: "Tel. no",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "accountStatus",
        header: "Hesap Durumu",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "latitude",
        header: "Enlem",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "longitude",
        header: "Boylam",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "formattedAddress",
        enableEditing: false,
        header: "Açık Address",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "district",
        enableEditing: false,
        header: "İlçe",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );
  useEffect(() => {
    const getUsers = async (token) => {
      return await axios.get(`${BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };
    const token = localStorage.getItem("token");
    console.log(token);
    getUsers(token)
      .then((data) => {
        //console.log(data.data);
        const response = data.data.map((res) => {
          let city = res.city.name;
          let role = res.role.name;
          let accountStatus = res.enabled
            ? "AKTİFLEŞTİRİLMİŞ"
            : "AKTİFLEŞTİRİLMEMİŞ";
            
          //let fullAddress = `${getAddressStates(res)}, ${getAddressCity(res)}`;
           
          
          
          return { ...res, city, role, accountStatus  };
        });
        console.log(response);
        //setTableData(setAddress(response));
        setAddress(response).map((data) => {
            console.log(data.formattedAddress);
        });
        
        setTableData(response);
        console.log("------------------");
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
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Yeni kullanıcı yarat
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Yeni Kullanıcı Yarat</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>İptal</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
        Yeni kullanıcı yarat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;
export default UsersUpdatedTable;
