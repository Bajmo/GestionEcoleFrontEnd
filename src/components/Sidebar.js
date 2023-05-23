import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupsIcon from '@mui/icons-material/Groups';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

export default function TemporaryDrawer(props) {
    const [state, toggleDrawer] = [props.state, props.toggleDrawer];

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem key={"Classes"} disablePadding>
                    <ListItemButton href={"/"}>
                        <ListItemIcon>
                            <GroupsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Classes" />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"Etudiants"} disablePadding>
                    <ListItemButton href={"/etudiants"}>
                        <ListItemIcon>
                            <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText primary="Étudiants" />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"Cours"} disablePadding>
                    <ListItemButton href={"/cours"}>
                        <ListItemIcon>
                            <MenuBookIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cours" />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"Salles"} disablePadding>
                    <ListItemButton href={"/salles"}>
                        <ListItemIcon>
                            <MeetingRoomIcon />
                        </ListItemIcon>
                        <ListItemText primary="Salles" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <div>
            <React.Fragment>
                <Drawer
                    open={state["left"]}
                    onClose={toggleDrawer("left", false)}
                >
                    {list("left")}
                </Drawer>
            </React.Fragment>
        </div>
    );
}
