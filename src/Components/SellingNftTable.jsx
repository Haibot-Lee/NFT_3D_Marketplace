import React, {Suspense, useRef, useState} from 'react';
import {
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Box, DialogTitle, DialogContent, TextField, DialogActions, Dialog, Alert
} from "@mui/material";
import ModelCavas from "./ModelCavas";
import {useTheme} from "@mui/material/styles";
import {BigNumber, ethers} from "ethers";
import Typography from "@mui/material/Typography";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Button, CardActionArea, CardActions} from '@mui/material';
import Stack from "@mui/material/Stack";
import {format} from "date-fns";


export default function SellingNftTable(props) {
    const theme = useTheme();

    const [open, setOpen] = useState(null);
    const [price, setPrice] = useState(0);
    const handleCloseDialog = () => {
        setOpen(null);
        setPrice(0);
    }

    async function changePrice(nft) {
        console.log(nft);
        var time = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        await window.mktContract.changePrice(nft[0], ethers.utils.parseUnits(price, 'ether'), time);
        alert("Price changed!")
    }

    async function endAuction(nft) {
        //TODO: bug here!
        console.log(nft);
        var auctionInfo=await window.mktContract.getAuction(nft[4]);
        console.log(auctionInfo);

        // var time = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        // if (ethers.utils.formatUnits(nft[4], 'ether') == 0) {
        //     console.log("Refund");
        //     await window.mktContract.refund(nft[4], time);
        //     alert("Auction ended");
        // } else {
        //     console.log("Get bid");
        //     await window.mktContract.auctionEnd(nft[4], time, {value: nft[4]});
        //     alert("Auction ended with" + ethers.utils.formatUnits(nft[4], 'ether') + "MATIC");
        // }
    }

    return (
        <>
            <Stack direction={"row"} spacing={1} component={Paper}>
                {Array.from(props.sellingNfts).map((nft) => (
                    <Card component={Paper}>
                        <CardActionArea>
                            <Suspense fallback={<CircularProgress/>}>
                                <ModelCavas key={nft[nft.length - 2]}
                                            model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${nft[nft.length - 2]}`}/>
                            </Suspense>
                        </CardActionArea>
                        <CardContent>
                            <Typography color={"text.primary"}>
                                {(nft[7] ? "Highest bid: " : "Price: ") + ethers.utils.formatUnits(nft[4], 'ether') + " MATIC"}
                            </Typography>
                        </CardContent>
                        <CardActions sx={{display: "flex", justifyContent: "center"}}>
                            {!nft[7] ?
                                <Button variant="contained" size={"small"} onClick={() => setOpen(nft)}>
                                    Change Price
                                </Button> :
                                <Button variant="contained" size={"small"} onClick={() => endAuction(nft)}>
                                    Auction End
                                </Button>}

                        </CardActions>
                    </Card>
                ))}
            </Stack>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Make a bid</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus required fullWidth
                        margin="dense"
                        label="Price"
                        type="number"
                        variant="outlined"
                        val={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => changePrice(open)}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>

    );
}