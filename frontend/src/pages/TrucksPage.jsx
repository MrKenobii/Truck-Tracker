import { useEffect } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TrucksTable from "../components/TrucksTable"

const TrucksPage = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        if(user.role.name !==  "ADMIN") navigate("/not-found");
    }, []);
    return (
        <div>
            <TrucksTable />
        </div>
    )
}

export default TrucksPage
