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

import Home from './components/Home';
import Tracker from './components/Tracker';
import History from './components/History';
import Login from './components/Login';
import Settings from './components/Settings';
import Unauthorized from './components/Unauthorized';

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
            case '/components/login':
                return 'Login';
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

    const drawer = (
        <Drawer anchor="left" open={menuOpen} onClose={toggleMenu}>
            <Box role="presentation" onClick={toggleMenu} sx={{ width: 250 }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/components/">
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/components/tracker">
                            <ListItemText primary="Mood Tracker" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/components/history">
                            <ListItemText primary="Mood History" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/components/settings">
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
                    <Route path="/components/login" element={<Login setUser={setUser} />} />
                    {user ? (
                        <>
                            <Route path="/components/" element={<Home user={user} />} />
                            <Route path="/components/tracker" element={<Tracker user={user} />} />
                            <Route path="/components/history" element={<History user={user} />} />
                            <Route path="/components/settings" element={<Settings user={user}/>} />
                            <Route path="/components/unauthorized" element={<Unauthorized />} />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to="/components/login" />} />
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