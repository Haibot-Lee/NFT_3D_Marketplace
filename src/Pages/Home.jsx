import {ethers} from "ethers";
import Web3Modal from "web3modal";
import React, {useState, useEffect, useContext} from "react";
import UserContext from '../Components/UserContext';
import {useNavigate} from "react-router-dom";
import NftContract from "../contracts/NFT.json"
import MarketContract from "../contracts/MarketPlace.json"

import {Button} from '@mui/material';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";
import web3Modal from "../Components/Web3Config"


export default function Home() {
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();
    const theme = useTheme();

    const [address, setAddress] = useState(userCtx.address);
    const [balance, setBalance] = useState(userCtx.balance);

    const shortenAddr = (addr) => addr.slice(0, 4) + "..." + addr.slice(-4);

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

    function logout() {
        setAddress("");
        setBalance("");
        userCtx.setContext({
            address: "",
            balance: ""
        });
        window.mktContract = null;
        window.nftContract = null;
    }

    // useEffect(() => {
    //     init();
    // }, []);

    return (
        <Stack spacing={2}>
            {(address && address !== "") ?
                <>
                    <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                        User Address: {shortenAddr(userCtx.address)}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                        Balance: {userCtx.balance} MATIC
                    </Typography>
                </> : ''}

            <Button variant="contained" disabled={address && address !== ""} onClick={() => init()}>
                Connect wallet
            </Button>
            <Button disabled={address === ""} onClick={() => logout()}>Log out</Button>
        </Stack>
    );
}

