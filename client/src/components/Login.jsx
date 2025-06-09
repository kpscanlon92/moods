import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');

        const endpoint = isRegistering ? 'register' : 'login';

        try {
            const res = await axios.post(`http://localhost:4000/api/auth/${endpoint}`, { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/');
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
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Please wait…' : isRegistering ? 'Register' : 'Login'}
                </button>
                {msg && <p style={{ color: 'red', marginTop: '1rem' }}>{msg}</p>}
            </form>

            <p style={{ marginTop: '1rem' }}>
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setMsg('');
                    }}
                    style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                >
                    {isRegistering ? 'Login' : 'Register'}
                </button>
            </p>
        </div>
    );
}

export default Login;