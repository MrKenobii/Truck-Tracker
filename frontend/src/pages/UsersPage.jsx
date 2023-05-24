import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UsersTable from "../components/UsersTable"
import UsersUpdatedTable from "../components/UsersUpdatedTable";

const UsersPage = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        if(user.role.name !==  "ADMIN") navigate("/not-found");
    }, []);
    return (
        <div>
            <UsersUpdatedTable />
        </div>
    )
}

export default UsersPage
