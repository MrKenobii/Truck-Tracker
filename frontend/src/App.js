import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { ToastContainer } from "react-toastify";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import routes from "./routes/routes";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";
import { socket, SocketContext } from "./context/socket";

const App = () => {
  const theme = createTheme({
    status: {
      danger: blue[500],
    },
  });
  return (
    <SocketContext.Provider value={socket}>
      <ThemeProvider theme={theme}>
        {/* config toastify */}
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
          theme={theme}
        />
        {/* mui reset css */}
        <CssBaseline />

        {/* app routes */}
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* <Route path="/" element={<HomePage />} /> */}
            {routes.map((route, index) =>
              route.index ? (
                <Route index key={index} element={route.element} />
              ) : (
                <Route path={route.path} key={index} element={route.element} />
              )
            )}
            <Route path="/home" element={<Navigate to={"/"} />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        {/* app routes */}
      </ThemeProvider>
    </SocketContext.Provider>
  );
};

export default App;
