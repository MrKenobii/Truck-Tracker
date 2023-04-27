
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/");
    }
    return (
        <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Typography variant="h1" component="p">
              404
            </Typography>
            <Typography variant="h6" component="p">
              Aradığınız sayfa bulunamadı.
            </Typography>
            <Button variant="contained" onClick={handleClick}>Ana menüye dön</Button>
          </Grid>
          <Grid xs={6}>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
              alt=""
              width={500} height={250}
            />
          </Grid>
          </Grid>
      </Container>
    </Box>
    )
}

export default NotFoundPage
