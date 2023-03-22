import {ethers} from "ethers";
import React, {useState, useEffect, useContext, Suspense} from "react";
import UserContext from '../Components/UserContext';
import NftContract from "../contracts/NFT.json"
import MarketContract from "../contracts/MarketPlace.json"

import {Box, Button, Grid} from '@mui/material';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";
import web3Modal from "../Components/Web3Config"
import p1 from "../p1.jpg"

export default function Home() {
    const userCtx = useContext(UserContext);
    const theme = useTheme();

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

        // get balance
        const bal = await provider.getBalance(addr);
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
        userCtx.setContext({
            address: "",
            balance: ""
        });
        window.mktContract = null;
        window.nftContract = null;
    }

    //TODO: add guide for user to connect wallet, and how to use the website
    return (
        <Stack spacing={2}>
            {userCtx?.address ?
                <>
                    <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                        User Address: {shortenAddr(userCtx?.address)}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                        Balance: {userCtx.balance} MATIC
                    </Typography>
                </> : ''}

            <Button variant="contained" disabled={userCtx?.address} onClick={() => init()}>
                Connect wallet
            </Button>
            <Button disabled={!userCtx?.address} onClick={() => logout()}>Log out</Button>
            <Grid container>
                <Grid item xs={8} sx={{pl: 2}}>
                    <Typography align={"left"} variant="h6" fontWeight="bold" color={theme.palette.warning.main}>
                        Get Started:
                    </Typography>
                    <Typography sx={{pb: 1}} align={"left"} variant="body1" fontWeight="bold"
                                color={theme.palette.success.dark}>
                        # You are recommended to Chrome browser to use this website.
                    </Typography>
                    <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                        1. Prepare you own wallet, and connect to the website. Get Metamask extension for your chrome
                        browser&nbsp;
                        <a type="button" target='_blank'
                           href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">HERE</a>.
                    </Typography>
                    <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                        2. Add a new network to your wallet. please refer to the information below.
                        Then connect to the website.
                    </Typography>
                    <Box sx={{m: 1, p: 1, border: 1, borderColor: 'white'}}>
                        <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                            Network name: Mumbai
                        </Typography>
                        <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                            New RPC URL: <br/>https://polygon-mumbai.g.alchemy.com/v2/L8tYmA2PaCBL7CVlu0qHwhvuxlAHrKYz
                        </Typography>
                        <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                            Chain ID: 80001
                        </Typography>
                        <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                            Currency Symbol: MATIC
                        </Typography>
                        <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                            Block Explorer URL: <br/>https://mumbai.polygonscan.com/
                        </Typography>
                    </Box>
                    <Typography align={"left"} variant="body1" fontWeight="bold" color={theme.palette.text.primary}>
                        3. Get MATIC for your wallet from &nbsp;
                        <a type="button" target='_blank' href="https://mumbaifaucet.com/">HERE</a>
                        &nbsp; to make transactions.
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <img src={p1} width="250vw"/>
                </Grid>
            </Grid>
        </Stack>
    );
}

