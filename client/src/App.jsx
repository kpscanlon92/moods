import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Tracker from './Tracker';
import History from './History';
import Register from './Register';
import Login from './Login';
import Settings from './Settings';
import Unauthorized from "./Unauthorized";
import './App.css';

function Header({ toggleMenu, menuOpen }) {
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/history':
                return 'Mood History';
            case '/settings':
                return 'Settings';
            default:
                return 'Mood Tracker';
        }
    };

    return (
        <header className="header">
            <div className="header-top">
                <button
                    className="menu-toggle"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    ☰
                </button>
                <h1 className="page-title">{getPageTitle()}</h1>
            </div>
            {menuOpen && (
                <nav className="dropdown-menu">
                    <Link to="/" onClick={toggleMenu}>Mood Tracker</Link>
                    <Link to="/history" onClick={toggleMenu}>Mood History</Link>
                    <Link to="/settings">Settings</Link>
                </nav>
            )}
        </header>
    );
}

function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    return (
        <Router>
            <Header menuOpen={menuOpen} toggleMenu={toggleMenu} />
            <main className="main-content">
                <Routes>
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register setUser={setUser} />} />
                    {user ? (
                        <>
                            <Route path="/" element={<Tracker user={user} />} />
                            <Route path="/history" element={<History user={user} />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/unauthorized" element={<Unauthorized />} />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to="/login" />} />
                    )}
                </Routes>
            </main>
        </Router>
    );
}

export default App;
