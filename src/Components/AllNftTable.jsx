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
import {useNavigate} from "react-router-dom";

export default function AllNftTable(props) {
    const theme = useTheme();
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();

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
        await window.mktContract.buy(Number(nft[0]), time, {value: nft[4]})
            .then(() => {
                handleCloseDialog();
                alert("Buy Successfully!")
            })
            .catch((error) => {
                handleCloseDialog();
                alert(error.reason)
            });

    }

    async function makeABid(nft) {
        var bidInfo = await window.mktContract.getAuction(nft["_tradeId"]);
        console.log(bidInfo)

        if (Number(bidInfo.biddingTime) < Math.floor((Date.now()) / 1000)) {
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

    async function getBiddingItem(nft) {
        var bidInfo = await window.mktContract.getAuction(nft["_tradeId"]);
        console.log(bidInfo);
        if (userCtx.address === bidInfo["highestBidder"]) {
            var time = format(new Date(), "yyyy-MM-dd HH:mm:ss");
            console.log("Get bidding item");
            await window.mktContract.auctionEnd(nft["_tradeId"], time, {value: nft[4]});
            alert("Auction ended with" + ethers.utils.formatUnits(nft[4], 'ether') + "MATIC. Please check in your profile!");
        } else {
            alert("You are not the highest bidder, please change to the correct account or refresh to update account")
        }
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        <TableRow sx={{overflow: 'hidden'}}>
                            {Array.from(props.sellingNfts).map((item) => (
                                <TableCell sx={{overflow: 'hidden'}} align={"center"}>
                                    <Card component={Paper}>
                                        <CardActionArea onClick={() => navigate(`/detail/${item.nft['uri']}`)}>
                                            <Suspense fallback={<CircularProgress/>}>
                                                <ModelCavas key={item.nft[6]}
                                                            height={'60vh'}
                                                            model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${item.nft['uri']}`}/>
                                            </Suspense>
                                        </CardActionArea>
                                        <CardContent>
                                            <Typography color={"text.primary"}>
                                                {(item.nft["auction"] ? "Highest bid: " : "Price: ") + ethers.utils.formatUnits(item.nft[4], 'ether') + " MATIC"}
                                            </Typography>
                                            <Typography color={"text.primary"}>
                                                {item.nft["auction"] ? "Auction end at: " + new Date(Number(item.auction["biddingTime"] * 1000)).toLocaleString() : ""}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{display: "flex", justifyContent: "center"}}>
                                            <Button variant="contained"
                                                    disabled={item.nft["auction"] && Date.now() > Number(item.auction["biddingTime"]) * 1000}
                                                    onClick={() => {
                                                        item.nft["auction"] ? setOpen(item.nft) : buyNft(item.nft)
                                                    }}>
                                                {item.nft["auction"] ? "Bid" : "Buy"}
                                            </Button>
                                            {item.nft["auction"] && Date.now() > Number(item.auction["biddingTime"]) * 1000 && item.auction["highestBidder"] === userCtx.address ?
                                                <Button variant="contained" onClick={() => getBiddingItem(item.nft)}>
                                                    pay for your bid
                                                </Button> : ""
                                            }
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