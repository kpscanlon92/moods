import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Tracker from './components/Tracker';
import History from './components/History';
import Login from './components/Login';
import Settings from './components/Settings';
import Unauthorized from "./components/Unauthorized";
import styles from './styles/App.module.css';

function Header({ toggleMenu, menuOpen }) {
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/components/login':
                return 'Login'
            case '/components/tracker':
                return 'Mood Tracker';
            case '/components/history':
                return 'Mood History';
            case '/components/settings':
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
                    <Link to="/components/" onClick={toggleMenu}>Home</Link>
                    <Link to="/components/tracker" onClick={toggleMenu}>Mood Tracker</Link>
                    <Link to="/components/history" onClick={toggleMenu}>Mood History</Link>
                    <Link to="/components/settings">Settings</Link>
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
                        <Route path="/components/login" element={<Login setUser={setUser}/>}/>
                        {user ? (
                            <>
                                <Route path="/components/" element={<Home user={user}/>}/>
                                <Route path="/components/tracker" element={<Tracker user={user}/>}/>
                                <Route path="/components/history" element={<History user={user}/>}/>
                                <Route path="/components/settings" element={<Settings/>}/>
                                <Route path="/components/unauthorized" element={<Unauthorized/>}/>
                            </>
                        ) : (
                            <Route path="*" element={<Navigate to="/components/login"/>}/>
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
