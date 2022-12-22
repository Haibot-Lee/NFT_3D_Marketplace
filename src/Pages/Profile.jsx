import React, {Suspense, useContext, useEffect, useState} from 'react';
import {format} from "date-fns";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {
    Box,
    Button, Checkbox,
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


export default function Profile() {
    const theme = useTheme();
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();

    const [myNftList, setMyNftList] = useState([]);
    const shortenAddr = (addr) => {
        if (addr) return addr.slice(0, 4) + "..." + addr.slice(-4);
    }

    async function getMyTokens() {
        setMyNftList([]);
        var res = await window.mktContract.getMyTokens(userCtx.address);
        console.log(JSON.stringify(res))
        setMyNftList(res);
    }

    async function sellToken(nft) {
        console.log("sell nft: " + nft)
        if (checked) await window.mktContract.publicToAll(nft[0], ethers.utils.parseUnits(price, 18), 1, false, 0) //sell
        await window.mktContract.publicToAll(nft[0], 0, 1, true, timeString.format("YYYY-MM-DD HH:mm:ss")) //bid
        getMyTokens()
    }

    useEffect(() => {
        if (!userCtx.address || userCtx.address === "") navigate('/');
        else getMyTokens()
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
                <Button variant="outlined"
                        onClick={() => getMyTokens()}>Refresh My Models</Button>
                <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                    User Address: {shortenAddr(userCtx?.address)}
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{mt: 0}} color={theme.palette.text.primary}>
                    Balance: {userCtx?.balance} MATIC
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">My NFTs</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow sx={{overflow: 'hidden'}}>
                                {Array.from(myNftList).map((nft) => (
                                    <TableCell component="th" scope="row" sx={{overflow: 'hidden'}}>
                                        <Suspense fallback={<CircularProgress/>}>
                                            <ModelCavas key={nft[nft.length - 1]}
                                                        model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${nft[nft.length - 1]}`}/>
                                        </Suspense>
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow sx={{overflow: 'hidden'}}>
                                {Array.from(myNftList).map((nft) => (
                                    <TableCell sx={{overflow: 'hidden'}} align={"center"}>
                                        <Button variant="contained" onClick={() => setOpen(nft)}>
                                            Public
                                        </Button>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Public to NFT Marketplace</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Public your NFT model to the Marketplace
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
                    <Button onClick={() => sellToken(open)}>Public</Button>
                </DialogActions>
            </Dialog>
        </>

    );
}
