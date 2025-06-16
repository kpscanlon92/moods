import { useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
    useLocation,
} from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Home from './pages/Home';
import Tracker from './pages/Tracker';
import History from './pages/History';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';

function Header({ toggleMenu, getPageTitle }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={toggleMenu} sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div">
                    {getPageTitle()}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

function AppLayout({ user, setUser }) {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/pages/login':
                return 'Login';
            case '/pages/tracker':
                return 'Mood Tracker';
            case '/pages/history':
                return 'Mood History';
            case '/pages/settings':
                return 'Settings';
            default:
                return 'Home';
        }
    };

    const drawer = (
        <Drawer anchor="left" open={menuOpen} onClose={toggleMenu}>
            <Box role="presentation" onClick={toggleMenu} sx={{ width: 250 }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/pages/">
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/pages/tracker">
                            <ListItemText primary="Mood Tracker" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/pages/history">
                            <ListItemText primary="Mood History" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/pages/settings">
                            <ListItemText primary="Settings" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );

    return (
        <>
            <CssBaseline />
            <Header toggleMenu={toggleMenu} getPageTitle={getPageTitle} />
            {drawer}

            <Box component="main" sx={{ p: 3 }}>
                <Routes>
                    <Route path="/pages/login" element={<Login setUser={setUser} />} />
                    {user ? (
                        <>
                            <Route path="/pages/" element={<Home user={user} />} />
                            <Route path="/pages/tracker" element={<Tracker user={user} />} />
                            <Route path="/pages/history" element={<History user={user} />} />
                            <Route path="/pages/settings" element={<Settings user={user}/>} />
                            <Route path="/pages/unauthorized" element={<Unauthorized />} />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to="/pages/login" />} />
                    )}
                </Routes>
            </Box>

            <Box component="footer" sx={{ textAlign: 'center', p: 2, mt: 4 }}>
                &copy; {new Date().getFullYear()} Mood Tracker App
            </Box>
        </>
    );
}

function App() {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <AppLayout user={user} setUser={setUser} />
        </Router>
    );
}

export default App;
