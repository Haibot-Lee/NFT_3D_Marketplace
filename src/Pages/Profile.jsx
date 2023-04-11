import React, {useContext, useEffect, useState} from 'react';

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    TextField
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import UserContext from "../Components/UserContext";
import Divider from "@mui/material/Divider";
import dayjs from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {BigNumber, ethers} from "ethers";
import SellingNftTable from "../Components/SellingNftTable";
import MyNftTable from "../Components/MyNftTable";


export default function Profile(props) {
    const theme = useTheme();
    const userCtx = useContext(UserContext);

    const [myNftList, setMyNftList] = useState([]);
    const [sellingNfts, setSellingNfts] = useState([]);

    async function getMyTokens() {
        setMyNftList([]);
        var res = await window.mktContract.getMyTokens(userCtx.address);
        setMyNftList(res);
    }

    async function getSellingTokens() {
        setSellingNfts([]);
        var res = await window.mktContract.getSellingTokens(userCtx.address);
        setSellingNfts(res)
    }

    function update() {
        getMyTokens();
        getSellingTokens();
    }

    useEffect(() => {
        update();
        console.log("Update Profile Token");
    }, [userCtx])

    async function sellToken(nft) {
        console.log("sell nft: " + nft)
        if (checked) await window.mktContract.publicToAll(Number(nft[0]), ethers.utils.parseUnits(price, 'ether'), false, 0, {sender: userCtx.address}) //sell
        await window.mktContract.publicToAll(Number(nft[0]), 0, true, timeString.unix(), {sender: userCtx.address}) //bid
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
            <Stack spacing={2} sx={{pt: 2}}>
                <Typography variant="h5" fontWeight={"bold"} color={theme.palette.text.primary} align={"left"}
                            sx={{pl: 1}}>
                    Private Model:
                </Typography>
                {myNftList.length === 0 ? <Divider/> : <MyNftTable myNftList={myNftList} handleClose={props.handleClose}/>}
                <Typography variant="h5" fontWeight={"bold"} color={theme.palette.text.primary} align={"left"}
                            sx={{pl: 1}}>
                    Public Model:
                </Typography>
                <SellingNftTable sellingNfts={sellingNfts} handleClose={props.handleClose}/>
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
