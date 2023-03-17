import React, {Suspense, useContext, useEffect, useState} from 'react';
import UserContext from "../Components/UserContext";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {ethers} from "ethers";
import {
    Button,
    CardActionArea, CardActions, Chip,
    CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow, TextField
} from "@mui/material";
import Card from "@mui/material/Card";
import ModelCavas from "../Components/ModelCavas";
import CardContent from "@mui/material/CardContent";
import {format} from "date-fns";
import DetailContext from "../Components/DetailContext";

export default function Market(props) {
    const [allNfts, setAllNfts] = useState([]);
    const userCtx = useContext(UserContext);
    const detailCtx = useContext(DetailContext);
    const navigate = useNavigate();

    const navDetail = (nft) => {
        detailCtx.setContext({
            token: nft['uri'],
            tokenId: nft['_tokenId']
        });
        props.handleClose();
        navigate('/detail');
    }

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
        await window.mktContract.bid(Number(nft[0]), Math.floor((new Date()).valueOf() / 1000), time, ethers.utils.parseUnits(bidPrice, 'ether'))
            .then(() => {
                handleCloseDialog();
                alert("Bid Successfully!")
            })
            .catch((error) => {
                handleCloseDialog();
                alert(error.reason)
            });
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

    async function getMarketTokens() {
        setAllNfts([]);
        var allTokens = await window.mktContract.getAllTokens();
        var res = []
        for (var i = 0; i < allTokens.length; i++) {
            var auctionInfo = await window.mktContract.getAuction(allTokens[i]["_tradeId"]);
            res.push({nft: allTokens[i], auction: auctionInfo})
        }
        setAllNfts(res)
    }

    useEffect(() => {
        getMarketTokens();
        console.log("Update Market Token");
    }, [userCtx])

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        <TableRow sx={{overflow: 'hidden'}}>
                            {Array.from(allNfts).map((item) => (
                                <TableCell sx={{overflow: 'hidden'}} align={"center"}>
                                    <Card component={Paper}>
                                        <CardActionArea onClick={() => navDetail(item.nft)}>
                                            <Suspense fallback={<CircularProgress/>}>
                                                <ModelCavas key={item.nft[6]}
                                                            height={'70vh'}
                                                            model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${item.nft['uri']}`}/>
                                            </Suspense>
                                        </CardActionArea>
                                        <CardContent>
                                            <Chip size="small" color="warning"
                                                  label={(item.nft["auction"] ? "For auction | End at: " + new Date(Number(item.auction["biddingTime"] * 1000)).toLocaleString() : "For sell")}/>
                                            <Typography color={"text.primary"} sx={{pt: 1}}>
                                                <strong>
                                                    {(item.nft["auction"] ? "Highest bid: " : "Price: ")}
                                                </strong>
                                                {ethers.utils.formatUnits(item.nft[4], 'ether') + " MATIC"}
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
