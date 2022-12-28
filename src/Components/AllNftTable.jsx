import React, {Suspense, useContext, useRef, useState} from 'react';
import {
    Avatar,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    CardActionArea,
    CardActions,
    DialogTitle,
    DialogContent,
    DialogContentText,
    FormControlLabel,
    Checkbox,
    TextField, DialogActions, Dialog
} from "@mui/material";
import ModelCavas from "./ModelCavas";
import {useTheme} from "@mui/material/styles";
import {BigNumber, ethers} from "ethers";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {format} from "date-fns";
import UserContext from "./UserContext";

export default function SellingNftTable(props) {
    const theme = useTheme();
    const userCtx = useContext(UserContext);

    const [open, setOpen] = useState(null);
    const [bidPrice, setBidPrice] = useState(0);
    const handleCloseDialog = () => {
        setOpen(null);
        setBidPrice(0);
    }

    async function buyNft(nft) {
        if (userCtx?.balance < ethers.utils.formatUnits(nft[4], 'ether')) {
            alert("Not enough balance!")
            return
        }
        var time = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        await window.mktContract.buy(Number(nft[0]), time, 1, {value: nft[4]});
        handleCloseDialog();
        alert("Buy Successfully!")
    }

    async function makeABid(nft) {
        var bidInfo = await window.mktContract.getAuction(Number(nft[0]));
        console.log(bidInfo)

        if (Number(bidInfo.biddingTime) < Math.floor((new Date()).valueOf() / 1000)) {
            alert("Over time!")
            return
        }
        if (userCtx?.balance < bidPrice) {
            alert("Not enough balance!")
            return
        }
        if (bidPrice <= ethers.utils.formatUnits(nft[4], 'ether')) {
            alert("Your price should higher than the highest bid price currently!")
            return
        }

        var time = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        await window.mktContract.bid(Number(nft[0]), Math.floor((new Date()).valueOf() / 1000), time, ethers.utils.parseUnits(bidPrice, 'ether'));
        handleCloseDialog();
        alert("Bid Successfully!")
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        <TableRow sx={{overflow: 'hidden'}}>
                            {Array.from(props.sellingNfts).map((nft) => (
                                <TableCell sx={{overflow: 'hidden'}} align={"center"}>
                                    <Card component={Paper}>
                                        <CardActionArea>
                                            <Suspense fallback={<CircularProgress/>}>
                                                <ModelCavas key={nft[nft.length - 2]}
                                                            height={'60vh'}
                                                            model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${nft[nft.length - 2]}`}/>
                                            </Suspense>
                                        </CardActionArea>
                                        <CardContent>
                                            <Typography color={"text.primary"}>
                                                {(nft[7] ? "Highest bid: " : "Price: ") + ethers.utils.formatUnits(nft[4], 'ether') + " MATIC"}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{display: "flex", justifyContent: "center"}}>
                                            <Button variant="contained" onClick={() => {
                                                nft[7] ? setOpen(nft) : buyNft(nft)
                                            }}>
                                                {nft[7] ? "Bid" : "Buy"}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Make a bid</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus required fullWidth
                        margin="dense"
                        label="Bidding Price"
                        type="number"
                        variant="outlined"
                        val={bidPrice}
                        onChange={(e) => setBidPrice(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => makeABid(open)}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>

    );
}