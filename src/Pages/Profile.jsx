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
    FormGroup,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";


export default function Profile() {
    const theme = useTheme();
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();

    const [myNftList, setMyNftList] = useState([]);
    const [sellingNfts, setSellingNfts] = useState([]);
    const shortenAddr = (addr) => {
        if (addr) return addr.slice(0, 4) + "..." + addr.slice(-4);
    }

    async function getMyTokens() {
        setMyNftList([]);
        var res = await window.mktContract.getMyTokens(userCtx.address);
        console.log("My Token" + JSON.stringify(res))
        setMyNftList(res);
    }

    async function getSellingTokens() {
        setSellingNfts([]);
        var res = await window.mktContract.getSellingTokens(userCtx.address);
        console.log("selling Tokens" + JSON.stringify(res))
        setSellingNfts(res)
    }

    async function sellToken(nft) {
        console.log("sell nft: " + nft)
        if (checked) await window.mktContract.publicToAll(Number(nft[0]), ethers.utils.parseUnits(price, 'ether'), 1, false, 0) //sell
        await window.mktContract.publicToAll(Number(nft[0]), 0, 1, true, timeString.unix()) //bid
        alert("Publish successfully!")
        getMyTokens()
    }

    useEffect(() => {
        if (!userCtx.address || userCtx.address === "") navigate('/');
        else {
            getMyTokens();
            getSellingTokens();
        }
    }, [])

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
                    <Stack>
                        <Typography variant="h6" sx={{mt: 0}} color={theme.palette.text.primary} align="left">
                            <strong>Wallet Address: </strong> {shortenAddr(userCtx?.address)}
                        </Typography>
                        <Typography variant="h6" sx={{mt: 0}} color={theme.palette.text.primary} align={"left"}>
                            <strong>Balance: </strong> {userCtx?.balance} MATIC
                        </Typography>
                    </Stack>
                    <Button variant="outlined"
                            size="small"
                            onClick={() => {
                                getMyTokens();
                                getSellingTokens();
                            }}>Refresh My Models</Button>
                </Stack>
                <Stack direction={"row"} component={Paper} spacing={1}>
                    {Array.from(myNftList).map((nft) => (
                        <Card component={Paper}>
                            <CardActionArea>
                                <Suspense fallback={<CircularProgress/>}>
                                    <ModelCavas key={nft[nft.length - 1]}
                                                model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${nft[nft.length - 1]}`}/>
                                </Suspense>
                            </CardActionArea>
                            <CardActions sx={{display: "flex", justifyContent: "center"}}>
                                <Button variant="contained" size="small" onClick={() => setOpen(nft)}>
                                    Public
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Stack>
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
