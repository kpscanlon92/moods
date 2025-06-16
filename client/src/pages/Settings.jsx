import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api.js';

import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    Divider,
    Stack,
} from '@mui/material';

function Settings() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [newEmail, setNewEmail] = useState('');
    const [emailChangeMsg, setEmailChangeMsg] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                navigate('/pages/unauthorized');
                return;
            }

            try {
                const res = await api.get('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                localStorage.removeItem('token');
                navigate('/pages/unauthorized');
            }
        };

        fetchUser();
    }, [navigate, token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/pages/login');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match.');
            return;
        }

        try {
            await api.post(
                '/api/auth/change-password',
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Password updated successfully.');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to change password.');
        }
    };

    const handleChangeEmail = async (e) => {
        e.preventDefault();
        if (user.email === newEmail) {
            setEmailChangeMsg('New email cannot be the same as old email.');
            return;
        }

        try {
            await api.post(
                '/api/auth/change-email',
                { email: newEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEmailChangeMsg('Email updated successfully.');
            setNewEmail('');
            setUser((prevUser) => ({ ...prevUser, email: newEmail }));
        } catch (err) {
            setEmailChangeMsg(err.response?.data?.message || 'Failed to update email.');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action is permanent.')) return;

        try {
            await api.delete('/api/auth/delete', {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.removeItem('token');
            navigate('/api/auth/register');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete account.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>

            {user ? (
                <>
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Logged in as: <strong>{user.email}</strong>
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box component="form" onSubmit={handleChangeEmail} mb={4}>
                        <Typography variant="h6" gutterBottom>
                            Change Email
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="New Email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                            />
                            <Button type="submit" variant="contained">
                                Update Email
                            </Button>
                            {emailChangeMsg && <Alert severity={emailChangeMsg.includes('success') ? 'success' : 'error'}>{emailChangeMsg}</Alert>}
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box component="form" onSubmit={handleChangePassword} mb={4}>
                        <Typography variant="h6" gutterBottom>
                            Change Password
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Current Password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <TextField
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <Button type="submit" variant="contained">
                                Update Password
                            </Button>
                            {message && <Alert severity={message.includes('success') ? 'success' : 'error'}>{message}</Alert>}
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box mb={4}>
                        <Stack spacing={2}>
                            <Button variant="outlined" onClick={handleLogout}>
                                Logout
                            </Button>
                            <Button variant="contained" color="error" onClick={handleDeleteAccount}>
                                Delete My Account
                            </Button>
                        </Stack>
                    </Box>
                </>
            ) : (
                <Typography>Loading user info...</Typography>
            )}
        </Container>
    );
}

export default Settings;
