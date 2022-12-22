import React, {Suspense, useContext, useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {
    Box,
    Button,
    CircularProgress, Grid, Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
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
        if (!userCtx.address || userCtx.address === "") navigate('/');
        else getMyTokens()
    }, [])

    return (
        <Stack spacing={2}>
            <Button variant="outlined"
                    onClick={() => getMyTokens()}>Refresh My Models</Button>
            <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                User Address: {shortenAddr(userCtx?.address)}
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                Balance: {userCtx?.balance} MATIC
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">My NFTs</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{overflow: 'hidden'}}>
                            {Array.from(tokenList).map((token) => (
                                <TableCell component="th" scope="row" sx={{overflow: 'hidden'}}>
                                    <Suspense fallback={<CircularProgress/>}>
                                        <ModelCavas key={token}
                                                    model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${token}`}/>
                                    </Suspense>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow sx={{overflow: 'hidden'}}>
                            {Array.from(tokenList).map((token) => (
                                <TableCell component="th" scope="row" sx={{overflow: 'hidden'}}>
                                    <Button variant="contained" onClick={() => console.log(token)}>
                                        Add to Market
                                    </Button>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}
