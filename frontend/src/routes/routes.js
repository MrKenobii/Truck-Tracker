import CitiesPage from "../pages/CitiesPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import TruckDetail from "../pages/TruckDetail";
import TrucksPage from "../pages/TrucksPage";
import UsersPage from "../pages/UsersPage";

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
        state: "signup"
    },
    {
        path: "/truck/:id",
        element: <TruckDetail truck />,
        state: "truckDetail"
    },
    {
        path: "/trucks",
        element: <TrucksPage trucks />,
        state: "trucks"
    },
    {
        path: "/cities",
        element: <CitiesPage cities />,
        state: "cities"
    },
    {
        path: "/users",
        element: <UsersPage users />,
        state: "users"
    },

];
export default routes;