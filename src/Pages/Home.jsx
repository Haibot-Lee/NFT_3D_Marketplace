import {ethers} from "ethers";
import React, {useContext} from "react";
import UserContext from '../Components/UserContext';
import NftContract from "../contracts/NFT.json"
import MarketContract from "../contracts/MarketPlace.json"

import {Box, Button, Grid} from '@mui/material';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";
import web3Modal from "../Components/Web3Config";
import p1 from "../p1.jpg";
import {BrowserView, MobileView} from 'react-device-detect';
import InfoPan from "./InfoPan";

export default function Home() {
    const userCtx = useContext(UserContext);
    const theme = useTheme();

    const shortenAddr = (addr) => addr.slice(0, 4) + "..." + addr.slice(-4);

    async function init() {
        if (!window.ethereum.isConnected()) {
            alert("Please follow the guideline and install Metamask first!");
        }
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

    return (
        <Stack spacing={2} sx={{maxWidth: '100%'}}>
            {userCtx?.address &&
                <>
                    <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                        User Address: {shortenAddr(userCtx?.address)}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                        Balance: {userCtx.balance} MATIC
                    </Typography>
                </>}
            <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>
                <Button variant="contained" disabled={userCtx?.address} onClick={() => init()}>
                    Connect to your wallet
                </Button>
                <Button variant="outlined" color="error" disabled={!userCtx?.address} onClick={() => logout()}>
                    Log out</Button>
            </Box>
            <BrowserView>
                <Grid container>
                    <Grid item xs={8} sx={{pl: 2}}>
                        <InfoPan/>
                    </Grid>
                    <Grid item xs={4}>
                        <img src={p1} width="250vw"/>
                    </Grid>
                </Grid>
            </BrowserView>
            <MobileView>
                <Stack sx={{m: 1}}>
                    <InfoPan/>
                    {/*<Box><img src={p1} width="50%"/></Box>*/}
                </Stack>
            </MobileView>
        </Stack>
    );
}

