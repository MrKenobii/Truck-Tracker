import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import TruckDetail from "../pages/TruckDetail";

export const routesGen = {
    home: "/",
    login: "/login",
    singin: "/signup"
  };
  const routes = [
    {
        index: true,
        element: <HomePage/>,
        state: "home"
    },
    {
        path: "/login",
        element: <LoginPage />,
        state: "login"
    },
    {
        path: "/signup",
        element: <SignUpPage />,
        state: "sigup"
    },
    {
        path: "/truck/:id",
        element: <TruckDetail truck />,
        state: "sigup"
    },

];
export default routes;