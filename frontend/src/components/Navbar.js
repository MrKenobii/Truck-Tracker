import { useEffect, useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import { SocketContext } from "../context/socket";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import EmailIcon from "@mui/icons-material/Email";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/urls";
import axios from "axios";
import LoadingComponent from "./LoadingComponent";
import { setUser } from "../redux/features/userSlice";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const navLinks = [
  {
    name: "Kişiler",
    path: "/users",
  },
  {
    name: "Tırlar",
    path: "/trucks",
  },
  {
    name: "Şehirler",
    path: "/cities",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const { user } = useSelector((state) => state.user);
  console.log(user);
  const [notifications, setNotifications] = useState([]);
  const [openNot, setOpenNot] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  //const [user, setUser] = useState(obj.user);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const stringToColour = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = "#";
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
  };

  const handleClick = (e) => {
    setAnchorElUser(e.currentTarget);
    navigate("/login");
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const open = Boolean(anchorEl);
  const handleClickUser = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("persist:root");
    dispatch(setUser(null));
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      if (user.notifications.length > 0) {
        if (notifications.length > 0) {
          setNotifications((prev) => [...prev, user.notifications]);
        } else {
          setNotifications(user.notifications);
        }
      }
    }
    console.log(notifications);
  }, []);
  useEffect(() => {
    console.log("DEgıstı");
  }, [user]);

  useEffect(() => {
    socket?.on("getNotification", (data) => {
      console.log(data);
      toast.success(
        `${data.senderName.name + " " + data.senderName.lastName} ${
          data.notif.content
        }`,
        {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      console.log(data);
      setNotifications((prev) => [...prev, data]);
      console.log(notifications);
    });
  }, [socket]);

  useEffect(() => {
    socket?.emit("newUser", user);
  }, [socket, user]);

  if (isLoading) {
    return <LoadingComponent />;
  } else {
    return (
      <AppBar position="static" style={{ background: "#2E3B55" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              TIR TAKİP SİSTEMİ
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {user &&
                  user.role &&
                  user.role.name === "ADMIN" &&
                  navLinks.map((page, index) => (
                    <Link
                      to={page.path}
                      style={{ textDecoration: "none", color: "inherit" }}
                      key={index}
                    >
                      <MenuItem key={index} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page.name}</Typography>
                      </MenuItem>
                    </Link>
                  ))}
                {user && localStorage.getItem("token") && (
                  <div>
                    <Link
                      to={`notifications/${user.id}`}
                      state={{ user, notifications }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">
                          Bildirimler{" "}
                          {notifications.length > 0 && notifications.length}
                        </Typography>
                      </MenuItem>
                    </Link>
                    <Link
                      to={`messages/${user.id}`}
                      state={{ user }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <MenuItem>
                        <Typography textAlign="center">
                          Mesajlar{" "}
                          {notifications.length > 0 && notifications.length}
                        </Typography>
                      </MenuItem>
                    </Link>
                  </div>
                )}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              TIR TAKİP SİSTEMİ
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {user &&
                user.role &&
                user.role.name === "ADMIN" &&
                navLinks.map((page, index) => (
                  <Box sx={{ marginY: "10px" }} key={index}>
                    <Link
                      to={page.path}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Button
                        key={index}
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        {page.name}
                      </Button>
                    </Link>
                  </Box>
                ))}
              {user && localStorage.getItem("token") && (
                <Box
                  sx={{
                    justifyContent: "flex-end",
                    flexGrow: 1,
                    display: { xs: "none", md: "flex" },
                  }}
                >
                  <Link
                    to={`notifications/${user.id}`}
                    style={{ margin: "20px 10px" }}
                    state={{ user, notifications }}
                  >
                    <IconButton
                      aria-label="notification"
                      style={{ color: "white", borderRadius: "100%" }}
                    >
                      <StyledBadge
                        badgeContent={notifications.length}
                        color="primary"
                      >
                        <NotificationsIcon />
                      </StyledBadge>
                    </IconButton>
                  </Link>
                  <Link
                    to={`messages/${user.id}`}
                    style={{ margin: "20px 10px" }}
                  >
                    <IconButton aria-label="message" style={{ color: "white" }}>
                      <StyledBadge
                        badgeContent={notifications.length}
                        color="primary"
                      >
                        <EmailIcon />
                      </StyledBadge>
                    </IconButton>
                  </Link>
                </Box>
              )}
            </Box>

            <Box sx={{ flexGrow: 0, marginY: "5px" }}>
              {user && localStorage.getItem("token") ? (
                <div>
                  <Button
                    id="basic-button"
                    style={{
                      backgroundColor: stringToColour(
                        user ? user.name + " " + user.lastName : "profile"
                      ),
                    }}
                    variant="contained"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClickUser}
                  >
                    {user.name + " " + user.lastName}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                  </Menu>
                </div>
              ) : (
                <Button
                  style={{ backgroundColor: "#DA6161", color: "#FFF" }}
                  variant="contained"
                  onClick={handleClick}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }
};

export default Navbar;
