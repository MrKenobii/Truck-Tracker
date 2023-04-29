import React, { useCallback, useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Geocode from "react-geocode";
import axios from "axios";
import { BASE_URL } from "../constants/urls";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DialogContentText from '@mui/material/DialogContentText';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
Geocode.setApiKey(apiKey);
Geocode.setLanguage("en");
Geocode.setRegion("TR");

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

const fetchCities = async () => {
  let res = await axios.get(`${BASE_URL}/city`);
  return res.data;
};
const fetchRoles = async () => {
  let res = await axios.get(`${BASE_URL}/role`);
  return res.data;
};



const UsersUpdatedTable = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [selectedDeletedValue, setSelectedDeletedValue] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const handleClickDeleteOpen = (row) => {
    console.log(row.original);
    setDeleteOpen(true);
    setSelectedDeletedValue(row);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setSelectedDeletedValue(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      console.log(values);
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
  
  const handleDeleteRow = useCallback(
    (row) => {
      const deleteUser = async (user) => {
        let res = await axios.delete(`${BASE_URL}/user/${user.id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (res.status === 200) {
          return res.data;
        } else {
          toast.error("Silme işlemi başarısız", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      };
      deleteUser(row.original).then((deleteRes) => {
        console.log(deleteRes);
        toast.info(
          `${row.original.name} ${row.original.lastName} adlı kullanıcı başarıyla silindi`,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
        tableData.splice(row.index, 1);
        setTableData([...tableData]);
        setDeleteOpen(false);
        setSelectedDeletedValue(null);
      });
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
  const getRole = (role) => {
    if (role === "POLICE") return "POLİS";
    else if (role === "POLICE_STATION") return "KARAKOL";
    else if (role === "GOVERNMENT") return "HÜKÜMET";
    else if (role === "TRUCK_DRIVER") return "TIR ŞÖFORÜ";
    else if (role === "ADMIN") return "YÖNETİCİ";
    else if (role === "NORMAL") return "NORMAL KULLANICI";
    else return "";
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
        accessorKey: "accountActivationToken",
        header: "E-Mail Aktivasyon Kodu",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "smsActivationToken",
        header: "Sms Aktivasyon Kodu",
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
        accessorKey: "role",
        header: "Rol",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      // {
      //   accessorKey: "formattedAddress",
      //   enableEditing: false,
      //   header: "Açık Address",
      //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
      //     ...getCommonEditTextFieldProps(cell),
      //   }),
      // },
      // {
      //   accessorKey: "district",
      //   enableEditing: false,
      //   header: "İlçe",
      //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
      //     ...getCommonEditTextFieldProps(cell),
      //   }),
      // },
    ],
    [getCommonEditTextFieldProps]
  );
  useEffect(() => {
    const getUsers = async (token) => {
      return await axios.get(`${BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };
    if (user && localStorage.getItem("token")) {
      if (user.role.name !== "ADMIN") {
        navigate("/");
      } else {
        const token = localStorage.getItem("token");
        console.log(token);
        getUsers(token)
          .then((data) => {
            //console.log(data.data);
            const response = data.data.map((res) => {
              let city = res.city.name;
              let role = getRole(res.role.name);
              let accountStatus = res.enabled
                ? "AKTİFLEŞTİRİLMİŞ"
                : "AKTİFLEŞTİRİLMEMİŞ";

              //let fullAddress = `${getAddressStates(res)}, ${getAddressCity(res)}`;

              return { ...res, city, role, accountStatus };
            });
            console.log(response);
            //setTableData(setAddress(response));

            setTableData(response.filter((r) => r.id !== user.id));
            console.log("------------------");
          })
          .catch((error) => console.log(error));
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
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            {/* <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip> */}
            <Tooltip arrow placement="right" title="Delete">
              {/* <IconButton color="error" onClick={() => handleDeleteRow(row)}> */}
              <IconButton color="error" onClick={() => handleClickDeleteOpen(row)}>
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
      <Dialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedDeletedValue && selectedDeletedValue.original && (
            <p>{selectedDeletedValue.original.name + " " + selectedDeletedValue.original.lastName + " adlı kullanıcıyı silmek istiyor musunuz?"}</p>
          )}
        </DialogTitle>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => handleDeleteRow(selectedDeletedValue)}>Sil</Button>
          <Button variant="outlined" color="info" onClick={handleDeleteClose} autoFocus>
            İptal
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );
  const handleChangeCity = (event) => {
    setCity(event.target.value);
    console.log(event.target.value);
  };
  const handleChangeRole = (event) => {
    setRole(event.target.value);
    console.log(event.target.value);
  };
  const handleSubmit = () => {
    //put your validation logic here
    const saveUser = async (user) => {
      return await axios.post(`${BASE_URL}/auth/register`, user, {});
    };
    const payload = {
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
      firstName: values.name,
      lastName: values.lastName,
      city,
      role
    };
    console.log(payload);
    saveUser(payload).then((res) => {
      console.log(res.data);
      if(res.status === 200){
        toast.success(`${payload.firstName + " " + payload.lastName} adlı kullanıcının hesabı başarıyla oluşturuldu.`, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error(`Bir şeyler terst gitti`, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }

    });
    onSubmit(values);
    onClose();
  };
  useEffect(() => {
    fetchCities()
      .then((data) => {
        setIsLoading(true);
        const sortedList = data.sort((a, b) => a.name.localeCompare(b.name));
        setCities(sortedList);
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
    fetchRoles()
      .then((data) => {
        setIsLoading(true);
        data = data.filter((r) => {
          return r.name !== "ADMIN";
        });
        setRoles(data);
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
  }, []);

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
              <>
                {column.accessorKey !== "id" &&
                  column.accessorKey !== "status" &&
                  column.accessorKey !== "latitude" &&
                  column.accessorKey !== "longitude" &&
                  column.accessorKey !== "accountStatus" &&
                  column.accessorKey !== "smsActivationToken" &&
                  column.accessorKey !== "accountActivationToken" &&
                  column.accessorKey !== "city" && 
                  column.accessorKey !== "role" && (
                    <TextField
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  )}
                {column.accessorKey === "city" && (
                  <FormControl fullWidth>
                    <InputLabel id="select-label-city">Şehir</InputLabel>
                    <Select
                      labelId="select-label-city"
                      id="select-city"
                      value={city}
                      label="Şehir"
                      onChange={handleChangeCity}
                    >
                      {cities.map((city, index) => (
                        <MenuItem key={index} value={city.name}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {column.accessorKey === "role" && (
                  <FormControl fullWidth>
                    <InputLabel id="select-label-role">Rol</InputLabel>
                    <Select
                      labelId="select-label-role"
                      id="select-role"
                      value={role}
                      label="Rol"
                      onChange={handleChangeRole}
                    >
                      {roles.map((role, index) => (
                        <MenuItem key={index} value={role.name}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </>
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
export default UsersUpdatedTable;
