import { useEffect } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TrucksTable from "../components/TrucksTable"
import TrucksUpdatedTable from "../components/TrucksUpdatedTable";

const TrucksPage = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        if(user.role.name !==  "ADMIN") navigate("/not-found");
    }, []);
    return (
        <div>
            {/* <TrucksTable /> */}
            <TrucksUpdatedTable />
        </div>
    )
}

export default TrucksPage
