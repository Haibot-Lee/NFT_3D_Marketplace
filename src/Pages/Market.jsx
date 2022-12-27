import React, {Suspense, useContext, useEffect, useRef, useState} from 'react';

import Stack from "@mui/material/Stack";

import UserContext from "../Components/UserContext";
import {useNavigate} from "react-router-dom";
import AllNftTable from "../Components/AllNftTable"
import Typography from "@mui/material/Typography";

export default function Market() {
    const [allNfts, setAllNfts] = useState([]);
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();

    async function getMarketTokens() {
        setAllNfts([]);
        var res = await window.mktContract.getAllTokens();
        console.log("selling Tokens" + JSON.stringify(res))
        setAllNfts(res)
    }

    useEffect(() => {
        if (!userCtx.address || userCtx.address === "") navigate('/');
        else getMarketTokens()
    }, [])

    return (
        <Stack spacing={5}>
            <Typography variant={"h5"} color={"text.primary"}>Selling Models</Typography>
            <AllNftTable sellingNfts={allNfts}/>
        </Stack>
    );
}
