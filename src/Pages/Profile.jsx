import React, {useContext, useState} from 'react';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {Button} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import UserContext from "../Components/UserContext";


export default function Profile() {
    const theme = useTheme();
    const userCtx = useContext(UserContext);
    const shortenAddr = (addr) => addr.slice(0, 4) + "..." + addr.slice(-4);

    return (
        <Stack spacing={2}>
            <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                User Address: {shortenAddr(userCtx.address)}
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                Balance: {userCtx.balance} MATIC
            </Typography>
        </Stack>
    );
}
