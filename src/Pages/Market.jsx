import React, {Suspense, useContext, useEffect, useRef, useState} from 'react';

import {
    Button,
    CircularProgress,
    Grid,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import Stack from "@mui/material/Stack";

import ModelCavas from '../Components/ModelCavas'
import Divider from "@mui/material/Divider";
import {create} from "ipfs-http-client";
import UserContext from "../Components/UserContext";
import {useNavigate} from "react-router-dom";

const authorization = "Basic " + btoa(process.env.REACT_APP_PROJECT_ID + ":" + process.env.REACT_APP_PROJECT_SECRET);
const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
        authorization
    }
})

export default function Market() {
    const [tokenList, setTokenList] = useState([]);
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();

    async function getMarketTokens() {
        setTokenList(new Set());
        var res = await window.mktContract.getSellingTokens(userCtx.address);
        console.log(JSON.stringify(res))
        for (const item of res) {
            console.log(JSON.stringify(item));
            setTokenList(current => new Set([...current, item[item.length - 1]]))
        }
    }

    useEffect(() => {
        if (!userCtx.address || userCtx.address === "") navigate('/');
        else getMarketTokens()
    }, [])

    return (
        <Stack spacing={5}>
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
