import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Home from './Home';
import Tracker from './Tracker';
import History from './History';
import Login from './Login';
import Settings from './Settings';
import Unauthorized from "./Unauthorized";
import styles from './App.module.css';

function Header({ toggleMenu, menuOpen }) {
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/login':
                return 'Login'
            case '/tracker':
                return 'Mood Tracker';
            case '/history':
                return 'Mood History';
            case '/settings':
                return 'Settings';
            default:
                return 'Home';
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerTop}>
                <button
                    className={styles.menuToggle}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    ☰
                </button>
                <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
            </div>
            {menuOpen && (
                <nav className={styles.dropdownMenu}>
                    <Link to="/" onClick={toggleMenu}>Home</Link>
                    <Link to="/tracker" onClick={toggleMenu}>Mood Tracker</Link>
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
            <div className={styles.appContainer}>
                <Header menuOpen={menuOpen} toggleMenu={toggleMenu}/>
                <main className={styles.mainContent}>
                    <Routes>
                        <Route path="/login" element={<Login setUser={setUser}/>}/>
                        {user ? (
                            <>
                                <Route path="/" element={<Home user={user}/>}/>
                                <Route path="/tracker" element={<Tracker user={user}/>}/>
                                <Route path="/history" element={<History user={user}/>}/>
                                <Route path="/settings" element={<Settings/>}/>
                                <Route path="/unauthorized" element={<Unauthorized/>}/>
                            </>
                        ) : (
                            <Route path="*" element={<Navigate to="/login"/>}/>
                        )}
                    </Routes>
                </main>
                <footer className={styles.footer}>
                    &copy; {new Date().getFullYear()} Mood Tracker App
                </footer>
            </div>
        </Router>
    );
}

export default App;
