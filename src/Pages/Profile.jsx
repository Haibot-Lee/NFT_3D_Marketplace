import React, {Suspense, useContext, useEffect, useState} from 'react';
import {format} from "date-fns";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {
    Box,
    Button, CardActionArea, CardActions, Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Paper,
    TextField
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import UserContext from "../Components/UserContext";
import Divider from "@mui/material/Divider";
import ModelCavas from "../Components/ModelCavas";
import {useNavigate} from "react-router-dom";
import dayjs, {Dayjs} from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {BigNumber, ethers} from "ethers";
import SellingNftTable from "../Components/SellingNftTable";
import MyNftTable from "../Components/MyNftTable";
import web3Modal from "../Components/Web3Config";
import MarketContract from "../contracts/MarketPlace.json";
import NftContract from "../contracts/NFT.json";


export default function Profile() {
    const theme = useTheme();
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState(0);

    const [myNftList, setMyNftList] = useState([]);
    const [sellingNfts, setSellingNfts] = useState([]);
    const shortenAddr = (addr) => {
        if (addr && addr !== "") return addr.slice(0, 4) + "..." + addr.slice(-4);
    }

    async function getMyTokens() {
        setMyNftList([]);
        var res = await window.mktContract.getMyTokens(address);
        console.log("My Token" + JSON.stringify(res))
        setMyNftList(res);
    }

    async function getSellingTokens() {
        setSellingNfts([]);
        var res = await window.mktContract.getSellingTokens(address);
        console.log("selling Tokens" + JSON.stringify(res))
        setSellingNfts(res)
    }

    function update() {
        getMyTokens();
        getSellingTokens();
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

    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        update();
        console.log("Update token list")
    }, [address, userCtx])

    async function sellToken(nft) {
        console.log("sell nft: " + nft)
        if (checked) await window.mktContract.publicToAll(Number(nft[0]), ethers.utils.parseUnits(price, 'ether'), 1, false, 0, {sender: userCtx.address}) //sell
        await window.mktContract.publicToAll(Number(nft[0]), 0, 1, true, timeString.unix(), {sender: userCtx.address}) //bid
        alert("Publish successfully!")
        getMyTokens()
    }

    const [open, setOpen] = useState(null);
    const [checked, setChecked] = React.useState(false);
    const [price, setPrice] = useState(0);
    const [timeString, setTimeString] = React.useState(dayjs(new Date()));

    const handleCheck = (event) => {
        setChecked(event.target.checked);
    };

    const handleCloseDialog = () => {
        setOpen(null);
        setChecked(false);
        setPrice(0);
        setTimeString(dayjs(new Date()));
    }


    return (
        <>
            <Stack spacing={2}>
                <Stack direction={"row"}>
                    <Button variant="outlined"
                            size="small"
                            onClick={() => init()}>Refresh My Models</Button>
                </Stack>
                <Typography variant="h5" fontWeight={"bold"} color={theme.palette.text.primary} align={"left"}>
                    Private Model:
                </Typography>
                <MyNftTable myNftList={myNftList}/>
                <Divider/>
                <Typography variant="h5" fontWeight={"bold"} color={theme.palette.text.primary} align={"left"}>
                    Public Model:
                </Typography>
                <SellingNftTable sellingNfts={sellingNfts}/>
            </Stack>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Public to NFT Marketplace</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Publish your NFT model to the Marketplace
                    </DialogContentText>
                    <Divider/>
                    <Stack spacing={1} sx={{mt: 1}}>
                        <FormControlLabel control={<Checkbox checked={checked} onChange={handleCheck}/>}
                                          label="Sell this NFT?"/>
                        {checked ?
                            <TextField
                                autoFocus required fullWidth
                                margin="dense"
                                label="Price"
                                type="number"
                                variant="outlined"
                                val={price}
                                onChange={(e) => setPrice(e.target.value)}
                            /> :
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="Action end time"
                                    value={timeString}
                                    onChange={(newValue) => setTimeString(newValue)}
                                />
                            </LocalizationProvider>
                        }
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => sellToken(open)}>Publish</Button>
                </DialogActions>
            </Dialog>
        </>

    );
}
