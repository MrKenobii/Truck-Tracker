import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CitiesTable from "../components/CitiesTable"
import CitiesUpdatedTable from "../components/CitiesUpdatedTable";

const CitiesPage = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        if(user.role.name !==  "ADMIN") navigate("/not-found");
    }, []);
    return (
        <div>
            {/* <CitiesTable /> */}
            <CitiesUpdatedTable />
        </div>
    )
}

export default CitiesPage
