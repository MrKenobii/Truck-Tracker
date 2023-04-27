import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
      console.log(user.id);
      console.log(userId);
      if(user.id !== userId){
          navigate("/not-found")
      }
  }, []);
  return (
    <Grid container sx={{ backgroundColor: "#9b5252", height: "100vh" }}>
      {user && (
        <Grid item sm={12}>
          <Box display="flex" justifyContent="center" alignItems="center" >
            <Card
              sx={{
                minWidth: 275,
                mt: 2,
                
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.primary"
                  gutterBottom
                >
                  {user.role.name}
                  <span
                    style={{
                      m: 5,
                      color: user.status === "ONLINE" ? "green" : "red",
                    }}
                  >
                    ●
                  </span>
                  <Box style={{ x: 1, fontSize: 14 }}>
                    {user.status === "ONLINE" ? "çevrimici" : "çevrimdışı"}
                  </Box>
                </Typography>
                <Typography variant="h5" component="div">
                  {user.name + " " + user.lastName}
                </Typography>
                <Typography component="div" variant="p" sx={{ mb: 1.5 }} color="text.primary">
                  {user.city.name}
                </Typography>
                <Typography component="div" variant="p" sx={{ mb: 1.5 }} color="text.primary">
                  {user.email}
                </Typography>
                <Typography variant="body2">{user.phoneNumber}</Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ProfilePage;
