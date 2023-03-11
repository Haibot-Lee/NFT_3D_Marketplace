import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {useContext, useState} from "react";
import UserContext from "../Components/UserContext";
import {Box, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {useLocation} from "react-router-dom";
import InSpaceDialog from "../Metaverse/InSpaceDialog";
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";


export default function ResponsiveAppBar() {
    const userCtx = useContext(UserContext);
    let location = useLocation();

    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(null);
    const handleOpen = (p) => {
        setOpen(true);
        setPage(p);
    };
    const handleClose = () => setOpen(false);

    const shortenAddr = (addr) => {
        if (addr && addr !== "") return addr.slice(0, 4) + "..." + addr.slice(-4);
    }

    return (
        <>
            <AppBar position="fixed">
                <Toolbar variant="dense" sx={{justifyContent: "center"}}>
                    <Box sx={{flexGrow: 1}}/>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <strong>Current Account: </strong> {shortenAddr(userCtx.address)}
                    </Typography>

                    <Typography
                        variant="h6"
                        color={"text.secondary"}
                        sx={{
                            ml: 2,
                            fontFamily: 'monospace'
                        }}>
                        Balance: {userCtx.balance} MATIC
                    </Typography>
                    <Box sx={{flexGrow: 1}}/>

                    {
                        location.pathname === '/mkt-space' ?
                            <Tooltip title="Market">
                                <IconButton onClick={() => handleOpen('Market')}>
                                    <ShoppingCartIcon/>
                                </IconButton>
                            </Tooltip> : ''
                    }
                    {
                        location.pathname === '/space' ?
                            <Tooltip title="Profile">
                                <IconButton onClick={() => handleOpen('Profile')}>
                                    <AccountCircle/>
                                </IconButton>
                            </Tooltip> : ''
                    }
                </Toolbar>
            </AppBar>
            <InSpaceDialog open={open} handleClose={handleClose} page={page}/>
        </>
    );
}

