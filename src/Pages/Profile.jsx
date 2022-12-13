import React, {Suspense, useContext, useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {Button, CircularProgress} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import UserContext from "../Components/UserContext";
import Divider from "@mui/material/Divider";
import ModelCavas from "../Components/ModelCavas";
import {useNavigate} from "react-router-dom";


export default function Profile() {
    const theme = useTheme();
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();

    const [tokenList, setTokenList] = useState(new Set());
    const shortenAddr = (addr) => {
        if (addr) return addr.slice(0, 4) + "..." + addr.slice(-4);
    }

    async function getMyTokens() {
        setTokenList(new Set());
        var res = await window.mktContract.getMyTokens(userCtx.address);
        console.log(JSON.stringify(res))
        for (const item of res) {
            console.log(JSON.stringify(item));
            setTokenList(current => new Set([...current, item[item.length - 1]]))
        }
    }

    useEffect(() => {
        if (!userCtx.address || userCtx.address == "") navigate('/');
        else getMyTokens()
    }, [])

    return (
        <Stack spacing={2}>
            <Button variant="outlined"
                    onClick={() => getMyTokens()}>Test</Button>
            <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                User Address: {shortenAddr(userCtx?.address)}
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                Balance: {userCtx?.balance} MATIC
            </Typography>
            <Stack>
                <Stack direction={'row'} divider={<Divider orientation="vertical" flexItem/>} spacing={2}>
                    {Array.from(tokenList).map((token) => (
                        <Suspense fallback={<CircularProgress/>}>
                            <ModelCavas key={token} model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${token}`}/>
                        </Suspense>
                    ))}
                </Stack>
            </Stack>
        </Stack>
    );
}
