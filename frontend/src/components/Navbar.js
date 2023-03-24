import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled } from '@mui/material/styles';
import { useDispatch } from "react-redux";
import EmailIcon from "@mui/icons-material/Email";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const navLinks = [
  {
    name: "Users",
    path: "/users",
  },
  {
    name: "Trucks",
    path: "/trucks",
  },
  {
    name: "Cities",
    path: "/cities",
  },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [openNot, setOpenNot] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);

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

  const notificationsClick = () => {
    console.log("Notifications button clicked");
  };
  const messagesClick = () => {
    console.log("Message button clicked");
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
    navigate("/login");
  };
  const fetchUser = async (token) => {
    return await axios.get("http://localhost:8080/api/v1/user/token", {
      headers: { Authorization: "Bearer " + token },
    });
  };
  const fetchUsers = async (token) => {
    return await axios.get("http://localhost:8080/api/v1/user", {
      headers: { Authorization: "Bearer " + token },
    });
  };

  useEffect(() => {
    setSocket(io("http://localhost:8001"));
    const token = localStorage.getItem("token");
    if (token !== null) {
      fetchUser(token)
        .then((userData) => {
          console.log(userData.data);
          setUser(userData.data);
          fetchUsers(token)
            .then((usersData) => {
              console.log(usersData.data);
              console.log(userData.data.id);
              const filteredUsers = usersData.data.filter(
                (u) => u.id !== userData.data.id
              );
              setUsers(filteredUsers);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    socket?.on("getNotification", (data) => {
      console.log(data);
      setNotifications((prev) => [...prev, data]);
      console.log(notifications);
    });
  }, [socket]);

  useEffect(() => {
    socket?.emit("newUser", user);
  }, [socket, user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      fetchUser(token);
    }
  }, [localStorage.getItem("token")]);

  const handleNotification = (type) => {
    socket.emit("sendNotification", {
      senderName: user,
      recievers: users,
      type,
    });
  };

  const handleRead = () => {
    setNotifications([]);
    setOpenNot(false);
  };

  return (
    <AppBar position="static">
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
              {navLinks.map((page, index) => (
                <Link
                  to={page.path}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem key={index} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                </Link>
              ))}
              {localStorage.getItem("token") && (
                <div>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">Notifications</Typography>
                  </MenuItem>
                  <MenuItem>
                    <Typography textAlign="center">Messages</Typography>
                  </MenuItem>
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
            {navLinks.map((page, index) => (
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
            ))}
            {localStorage.getItem("token") && (
              <Box
                sx={{
                  justifyContent: "flex-end",
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                }}
              >
                <Button
                  onClick={() => handleNotification(1)}
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Send
                </Button>
                <IconButton aria-label="notification"  style={{ color: "white", borderRadius: "100%"}}>
                  <StyledBadge badgeContent={notifications.length} color="primary">
                    <NotificationsIcon />
                  </StyledBadge>
                </IconButton>
                <IconButton aria-label="message"  style={{ color: "white"}}>
                  <StyledBadge badgeContent={notifications.length} color="primary">
                    <EmailIcon />
                  </StyledBadge>
                </IconButton>
                
              </Box>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {localStorage.getItem("token") ? (
              <div>
                <Button
                  id="basic-button"
                  color="warning"
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
              <Button color="inherit" onClick={handleClick}>
                Login
              </Button>
            )}
            {/* {user && (
              <>
                <Button
                  onClick={() => handleNotification(1)}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Send
                </Button>
              </>
            )} */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
