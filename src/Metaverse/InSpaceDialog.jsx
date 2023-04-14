import React, {useContext, useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import {useTheme} from "@mui/material/styles";
import Market from "../Pages/Market";
import Profile from "../Pages/Profile";
import web3Modal from "../Components/Web3Config";
import {ethers} from "ethers";
import MarketContract from "../contracts/MarketPlace.json";
import NftContract from "../contracts/NFT.json";
import UserContext from "../Components/UserContext";
import {Button} from "@mui/material";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function InSpaceDialog(props) {
    const userCtx = useContext(UserContext);

    const theme = useTheme();

    async function init() {
        if (!window?.ethereum?.isConnected()) {
            alert("Please follow the guideline and install Metamask first!");
            return;
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

    useEffect(() => {
        if (window?.ethereum?.isConnected()) init();
    }, [])

    return (
        <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={props.handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h5" fontWeight={"bold"}
                                color={theme.palette.text.primary} align={"left"}>
                        {props.page}
                    </Typography>
                    <Button autoFocus color="primary" variant="outlined" onClick={() => init()}>
                        Refresh
                    </Button>
                </Toolbar>
            </AppBar>

            {props.page === 'Market' && <Market handleClose={props.handleClose}/>}
            {props.page === 'Profile' && <Profile handleClose={props.handleClose}/>}
        </Dialog>
    )
}
