import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TemporaryDrawer from './Sidebar';

export default function ButtonAppBar() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    return (
        <Box sx={{ flexGrow: 1 }}>  
            <AppBar position="static" style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer("left", true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Anas Mourad - Contrôle JEE
                    </Typography>
                </Toolbar>
            </AppBar>
            <TemporaryDrawer state={state} toggleDrawer={toggleDrawer} />
        </Box>
    );
}
