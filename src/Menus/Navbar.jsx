import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {useContext, useState} from "react";
import UserContext from "../Components/UserContext";
import {Box, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {useLocation} from "react-router-dom";
import InSpaceDialog from "../Metaverse/InSpaceDialog";
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RefreshIcon from '@mui/icons-material/Refresh';
import web3Modal from "../Components/Web3Config";
import {ethers} from "ethers";
import MarketContract from "../contracts/MarketPlace.json";
import NftContract from "../contracts/NFT.json";


export default function ResponsiveAppBar() {
    const userCtx = useContext(UserContext);
    let location = useLocation();

    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(null);
    const handleOpen = (p) => {
        setOpen(true);
        setPage(p);
    };
    const handleClose = () => setOpen(false);

    const shortenAddr = (addr) => {
        if (addr && addr !== "") return addr.slice(0, 4) + "..." + addr.slice(-4);
    }

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

    return (
        <>
            <AppBar position="fixed">
                <Toolbar variant="dense" sx={{justifyContent: "center"}}>
                    <Box sx={{flexGrow: 1}}/>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <strong>Current Account: </strong> {shortenAddr(userCtx.address)}
                    </Typography>

                    <Typography
                        variant="h6"
                        color={"text.secondary"}
                        sx={{
                            ml: 2,
                            fontFamily: 'monospace'
                        }}>
                        Balance: {userCtx.balance} MATIC
                    </Typography>
                    <Box sx={{flexGrow: 1}}/>

                    {
                        location.pathname === '/mkt-space' ?
                            <Tooltip title="Market">
                                <IconButton onClick={() => handleOpen('Market')}>
                                    <ShoppingCartIcon/>
                                </IconButton>
                            </Tooltip> : ''
                    }
                    {
                        location.pathname === '/space' ?
                            <Tooltip title="Profile">
                                <IconButton onClick={() => handleOpen('Profile')}>
                                    <AccountCircle/>
                                </IconButton>
                            </Tooltip> : ''
                    }

                    <Tooltip title="Refresh">
                        <IconButton onClick={() => init()}>
                            <RefreshIcon/>
                        </IconButton>
                    </Tooltip>

                </Toolbar>
            </AppBar>
            <InSpaceDialog open={open} handleClose={handleClose} page={page}/>
        </>
    );
}

