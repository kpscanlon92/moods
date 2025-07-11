import { useState } from 'react';
import api from '../utils/api.js';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Box,
    Link
} from '@mui/material';

function Login({ setUser }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (pwd) => {
        const errors = [];
        if (pwd.length < 8) errors.push('Password must be at least 8 characters.');
        if (!/[A-Z]/.test(pwd)) errors.push('Password must include an uppercase letter.');
        if (!/[0-9]/.test(pwd)) errors.push('Password must include a number.');
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');

        if (isRegistering) {
            const validationErrors = validatePassword(password);
            if (password !== confirmPassword) {
                validationErrors.push("Passwords don't match.");
            }
            if (validationErrors.length > 0) {
                setMsg(validationErrors.join(' '));
                setLoading(false);
                return;
            }
        }

        const endpoint = isRegistering ? 'register' : 'login';

        try {
            const res = await api.post(`/api/auth/${endpoint}`, {
                email,
                password,
            });
            localStorage.setItem('token', res.data.token);
            if (isRegistering) {
                setIsRegistering(false);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                setUser(res.data.user);
                navigate('/pages/');
            }
        } catch (err) {
            if (err.response) {
                const status = err.response.status;
                const errorMessage = err.response.data.message;

                if (status === 400 || status === 401) {
                    setMsg(errorMessage || 'Invalid credentials.');
                } else if (status === 409) {
                    setMsg('Account already exists. Try logging in.');
                } else {
                    setMsg('Server error. Please try again later.');
                }
            } else {
                setMsg('Network error. Check your internet connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography variant="h4" gutterBottom>
                    {isRegistering ? 'Register' : 'Login'}
                </Typography>

                {msg && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {msg}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {isRegistering && (
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}

                    {isRegistering && (
                        <Typography variant="caption" color="textSecondary">
                            Password must be at least 8 characters, include an uppercase letter and a number.
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : isRegistering ? 'Register' : 'Login'}
                    </Button>
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <Link
                        component="button"
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setMsg('');
                            setConfirmPassword('');
                        }}
                    >
                        {isRegistering ? 'Login' : 'Register'}
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
}

export default Login;