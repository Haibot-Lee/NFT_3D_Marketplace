import React, {Suspense, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutboxIcon from '@mui/icons-material/Outbox';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {Button, Tooltip} from "@mui/material";
import InputDialog from "./Input";

const drawerWidth = 200;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const MenuList = [
    {text: 'Your Space', icon: <HomeIcon/>, to: 'space'},
    {text: 'Market Space', icon: <ShoppingCartIcon/>, to: 'mkt-space'},
];

export default function Menu() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [openInput, setOpenInput] = useState(false);

    const handleDrawer = () => setOpen(!open);
    const handleInputClose = () => setOpenInput(false);

    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={handleDrawer}>
                    {open ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </IconButton>
            </DrawerHeader>
            <Divider/>
            <List>
                {MenuList.map((item, index) => (
                    <ListItem key={item.text} disablePadding sx={{display: 'block'}}>
                        <ListItemButton sx={{justifyContent: open ? 'initial' : 'center', px: 2.5}}
                                        onClick={() => {
                                            navigate(item.to)
                                        }}>
                            <Tooltip title={item.text} placement="right" arrow>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center'
                                    }}>{item.icon}</ListItemIcon>
                            </Tooltip>
                            <ListItemText primary={item.text} sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem key="Create" disablePadding sx={{display: 'block'}}>
                    <ListItemButton sx={{justifyContent: open ? 'initial' : 'center', px: 2.5}}
                                    onClick={() => {
                                        setOpenInput(true)
                                    }}>
                        <Tooltip title="Create NFT" placement="right" arrow>
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center'
                                }}><OutboxIcon/></ListItemIcon>
                        </Tooltip>
                        <ListItemText primary="Create" sx={{opacity: open ? 1 : 0}}/>
                    </ListItemButton>
                </ListItem>
            </List>
            <InputDialog open={openInput} handleClose={handleInputClose}/>
        </Drawer>
    );
}
