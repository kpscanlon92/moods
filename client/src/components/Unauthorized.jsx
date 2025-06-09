import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';

function Unauthorized() {
    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Unauthorized
                </Typography>
                <Typography variant="body1" gutterBottom>
                    You must be logged in to access this page.
                </Typography>
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/components/login"
                    >
                        Go to Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default Unauthorized;