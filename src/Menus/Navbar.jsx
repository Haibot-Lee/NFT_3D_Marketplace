import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {useContext} from "react";
import UserContext from "../Components/UserContext";
import RefreshIcon from '@mui/icons-material/Refresh';
import {Box, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";

export default function ResponsiveAppBar() {
    const userCtx = useContext(UserContext);

    const shortenAddr = (addr) => {
        if (addr && addr !== "") return addr.slice(0, 4) + "..." + addr.slice(-4);
    }

    return (
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

                <Tooltip title="Refresh">
                    <IconButton onClick={() => window.location.reload()}>
                        <RefreshIcon/>
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}

