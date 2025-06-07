import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Tracker from './Tracker';
import History from './History';
import './App.css';

function Header({ toggleMenu, menuOpen }) {
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/history':
                return 'Mood History';
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
                </nav>
            )}
        </header>
    );
}

function App() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    return (
        <Router>
            <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Tracker />} />
                    <Route path="/history" element={<History />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
