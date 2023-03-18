import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";

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

];
export default routes;