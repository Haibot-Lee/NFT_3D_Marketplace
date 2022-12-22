import React, {Suspense, useContext, useEffect, useRef, useState} from 'react';

import Stack from "@mui/material/Stack";

import {create} from "ipfs-http-client";
import UserContext from "../Components/UserContext";
import {useNavigate} from "react-router-dom";
import SellingNftTable from "../Components/SellingNftTable"

const authorization = "Basic " + btoa(process.env.REACT_APP_PROJECT_ID + ":" + process.env.REACT_APP_PROJECT_SECRET);
const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
        authorization
    }
})

export default function Market() {
    const [sellingNfts, setSellingNfts] = useState([]);
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();

    async function getMarketTokens() {
        setSellingNfts([]);
        var res = await window.mktContract.getSellingTokens(userCtx.address);
        console.log(JSON.stringify(res))
        setSellingNfts(res)
        // for (const item of res) {
        //     console.log(JSON.stringify(item));
        //     setTokenList(current => new Set([...current, item[item.length - 1]]))
        // }
    }

    useEffect(() => {
        if (!userCtx.address || userCtx.address === "") navigate('/');
        else getMarketTokens()
    }, [])

    return (
        <Stack spacing={5}>
            <SellingNftTable sellingNfts={sellingNfts}/>
        </Stack>
    );
}
