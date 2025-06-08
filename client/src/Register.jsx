import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;

        try {
            const res = await axios.post('http://localhost:4000/api/users/register', {
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
                setServerError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="card">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} noValidate>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="error">{errors.email}</div>}<br/>

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="error">{errors.password}</div>}<br/>

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}

                {serverError && <div className="error server">{serverError}</div>}<br/>

                <button type="submit">Sign Up</button>
            </form>

            <p>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default Register;