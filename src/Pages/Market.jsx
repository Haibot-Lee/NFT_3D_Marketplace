import React, {Suspense, useContext, useEffect, useRef, useState} from 'react';

import Stack from "@mui/material/Stack";

import UserContext from "../Components/UserContext";
import {useNavigate} from "react-router-dom";
import AllNftTable from "../Components/AllNftTable"
import Typography from "@mui/material/Typography";
import web3Modal from "../Components/Web3Config";
import {ethers} from "ethers";
import MarketContract from "../contracts/MarketPlace.json";
import NftContract from "../contracts/NFT.json";

export default function Market() {
    const [allNfts, setAllNfts] = useState([]);
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState(0);

    async function init() {
        // // connect wallet
        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        // sign contract
        const signer = provider.getSigner();
        console.log("Signer: " + signer);

        // get address
        const addr = await signer.getAddress();
        console.log("Address: " + addr);
        setAddress(addr);

        // get balance
        const bal = await provider.getBalance(addr);
        setBalance(ethers.utils.formatEther(bal));
        console.log("Balance: " + ethers.utils.formatEther(bal));

        userCtx.setContext({
            address: addr,
            balance: ethers.utils.formatEther(bal),
        })

        // init contract
        // market
        const mktContract = new ethers.Contract(process.env.REACT_APP_MARKETPLACE, MarketContract.abi, signer);
        console.log(mktContract);
        window.mktContract = mktContract;

        // nft
        const nftContract = new ethers.Contract(process.env.REACT_APP_NFT, NftContract.abi, signer);
        console.log(nftContract);
        window.nftContract = nftContract;

        console.log("Finished initialized");
    }

    async function getMarketTokens() {
        setAllNfts([]);
        var res = await window.mktContract.getAllTokens();
        console.log("selling Tokens" + JSON.stringify(res))
        setAllNfts(res)
    }

    useEffect(() => {
        init();
    }, [])
    useEffect(() => {
        getMarketTokens()
    }, [address, userCtx])

    return (
        <Stack spacing={5}>
            <Typography variant={"h5"} color={"text.primary"}>Selling Models</Typography>
            <AllNftTable sellingNfts={allNfts}/>
        </Stack>
    );
}
