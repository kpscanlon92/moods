import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Stack,
} from '@mui/material';

export default function Home() {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to your Mood Tracker
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Choose where you’d like to go:
            </Typography>

            <Stack spacing={2} sx={{ mt: 4 }}>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/components/tracker"
                >
                    Track Your Mood
                </Button>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/components/history"
                >
                    Mood History
                </Button>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/components/settings"
                >
                    Settings
                </Button>
            </Stack>
        </Container>
    );
}