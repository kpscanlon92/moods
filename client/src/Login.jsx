import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;

        try {
            const res = await axios.post('http://localhost:4000/api/users/login', {
                email,
                password,
            });

            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setUser(user);
            navigate('/');
        } catch (err) {
            if (err.response?.data?.error) {
                setServerError(err.response.data.error);
            } else {
                setServerError('Login failed. Please try again.');
            }
        }
    };

    return (
        <div className="card">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} noValidate>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /><br/>
                {errors.email && <div className="error">{errors.email}</div>}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br/>
                {errors.password && <div className="error">{errors.password}</div>}

                {serverError && <div className="error server">{serverError}</div>}

                <button type="submit">Log In</button>
                <br/>
            </form>

            <p>
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </div>
    );
}

export default Login;