import ActivateAccount from "../pages/ActivateAccount";
import AdminDashboard from "../pages/AdminDashboard";
import CitiesPage from "../pages/CitiesPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MessagesPage from "../pages/MessagesPage";
import NotificationsPage from "../pages/NotificationsPage";
import ProfilePage from "../pages/ProfilePage";
import SignUpPage from "../pages/SignUpPage";
import TruckDetail from "../pages/TruckDetail";
import TrucksPage from "../pages/TrucksPage";
import UpdatePasswordPage from "../pages/UpdatePasswordPage";
import UsersPage from "../pages/UsersPage";


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
    {
        path: "/notifications/:id",
        element: <NotificationsPage user notifications socket />,
        state: "notifications"
    },
    {
        path: "/messages/:id",
        element: <MessagesPage user messages socket />,
        state: "messages"
    },
    {
        path: "/profile/:userId",
        element: <ProfilePage user />,
        state: "profile-page"
    },
    {
        path: "/forgot-password",
        element: <ForgotPasswordPage user />,
        state: "forgot-password"
    },
    {
        path: "/update-password/:userId",
        element: <UpdatePasswordPage />,
        state: "update-password"
    },
    {
        path: "/activate-account/:userId",
        element: <ActivateAccount />,
        state: "activate-account"
    },
    {
        path: "/admin-dashboard/:userId",
        element: <AdminDashboard />,
        state: "activate-account"
    },

];
export default routes;