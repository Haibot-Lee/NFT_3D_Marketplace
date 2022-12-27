import React, {Suspense, useContext, useEffect, useRef, useState} from 'react';

import Stack from "@mui/material/Stack";

import {create} from "ipfs-http-client";
import UserContext from "../Components/UserContext";
import {useNavigate} from "react-router-dom";
import SellingNftTable from "../Components/SellingNftTable"
import Typography from "@mui/material/Typography";

const authorization = "Basic " + btoa(process.env.REACT_APP_PROJECT_ID + ":" + process.env.REACT_APP_PROJECT_SECRET);
const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
        authorization
    }
})

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
            <SellingNftTable sellingNfts={allNfts}/>
        </Stack>
    );
}
