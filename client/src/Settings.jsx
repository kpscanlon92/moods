import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Settings.module.css';

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
                navigate('/unauthorized');
                return;
            }

            try {
                const res = await axios.get('http://localhost:4000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                localStorage.removeItem('token');
                navigate('/unauthorized');
            }
        };

        fetchUser();
    }, [navigate, token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match.');
            return;
        }

        try {
            await axios.post(
                'http://localhost:4000/api/auth/change-password',
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
            await axios.post(
                'http://localhost:4000/api/auth/change-email',
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
            await axios.delete('http://localhost:4000/api/auth/delete', {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.removeItem('token');
            navigate('/signup');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete account.');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Settings</h2>
            {user ? (
                <>
                <div className={styles.section}>
                    <p><strong>Logged in as:</strong> {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>

                <div className={styles.section}>
                    <h3>Change Email</h3>
                    <form onSubmit={handleChangeEmail}>
                        <label>
                            New Email:
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit">Update Email</button>
                    </form>
                    {emailChangeMsg && <p>{emailChangeMsg}</p>}
                </div>

                <div className={styles.section}>
                    <h3>Change Password</h3>
                    <form onSubmit={handleChangePassword}>
                        <label>
                            Current Password:
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            New Password:
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Confirm New Password:
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit">Update Password</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>

                <div className={styles.section}>
                    <h3>Delete Account</h3>
                    <button onClick={handleDeleteAccount} style={{backgroundColor: 'red', color: 'white'}}>
                        Delete My Account
                    </button>
                </div>
            </>
            ) : (<p>Loading user info...</p>)}
        </div>
    );
}

export default Settings;