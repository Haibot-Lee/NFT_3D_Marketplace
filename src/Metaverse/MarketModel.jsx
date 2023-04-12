import 'aframe';
import {Entity, Scene} from 'aframe-react';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import Prototypes from 'prop-types'
import platform from './assets/platform2.glb'

import React, {useContext, useEffect, useState} from 'react';
import {ethers} from "ethers";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {format} from "date-fns";
import UserContext from "../Components/UserContext";

function MyDialogContent({nftItem, handleClose}) {
    const userCtx = useContext(UserContext);
    const [bidPrice, setBidPrice] = useState(0);

    async function buyNft(nft) {
        if (userCtx?.balance < ethers.utils.formatUnits(nft[4], 'ether')) {
            alert("Not enough balance!")
            return
        }
        var time = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        await window.mktContract.buy(Number(nft[0]), time, {value: nft[4]})
            .then(() => {
                handleClose();
                alert("Buy Successfully!")
            })
            .catch((error) => {
                handleClose();
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
                handleClose();
                alert("Bid Successfully!")
            })
            .catch((error) => {
                handleClose();
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

    if (nftItem?.nft["auction"]) {
        if (Date.now() > Number(nftItem.auction["biddingTime"]) * 1000) {
            return (
                <>
                    <DialogTitle>Auction ended</DialogTitle>
                    <DialogContent>
                        {nftItem.auction["highestBidder"] === userCtx.address ? "You are the highest bidder!" : "You are not the highest bidder!"}
                    </DialogContent>
                    <DialogActions sx={{justifyContent: 'space-between'}}>
                        <Button variant="outlined" color={"error"} onClick={handleClose}>Close</Button>
                        <Button variant="outlined"
                                disabled={nftItem.auction["highestBidder"] !== userCtx.address}
                                onClick={() => getBiddingItem(nftItem.nft)}>pay for your bid</Button>
                    </DialogActions>
                </>
            )
        } else {
            return (
                <>
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
                    <DialogActions sx={{justifyContent: 'space-between'}}>
                        <Button variant="outlined" color={"error"} onClick={handleClose}>Cancel</Button>
                        <Button variant="outlined" onClick={() => makeABid(nftItem.nft)}>Confirm</Button>
                    </DialogActions>
                </>
            )
        }
    } else {
        return (
            <>
                <DialogTitle>Buy this NFT?</DialogTitle>
                <DialogContent>
                    {'Pay ' + ethers.utils.formatUnits(nftItem.nft[4], 'ether') + ' MATIC for this NFT!'}
                </DialogContent>
                <DialogActions sx={{justifyContent: 'space-between'}}>
                    <Button variant="outlined" color={"error"} onClick={handleClose}>Cancel</Button>
                    <Button variant="outlined" onClick={() => buyNft(nftItem.nft)}>Confirm</Button>
                </DialogActions>
            </>
        )

    }
}

function MarketModel({nftItem, x, y, z, scale, ry}) {
    scale = scale ? scale : 1.5

    var token = nftItem?.nft['uri'];

    const loader = new GLTFLoader();
    loader.load(platform, (d) => {
        const entity = document.getElementById(`platform-${x}-${y}-${z}`);
        entity.object3D.add(d.scene);
    })

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCollide = () => console.log('collided!');

    useEffect(() => {
        if (token) {
            loader.load(`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${token}`, (d) => {
                const entity = document.getElementById(token);
                entity.object3D.add(d.scene);
            })
        }
    }, [token])

    return (
        <>
            <a-entity id={`platform-${x}-${y}-${z}`} position={`${x} ${y + 0.1} ${z}`}/>

            {token ?
                <>
                    <Entity id={token}
                            events={{click: handleClickOpen, collided: [handleCollide]}}
                            position={`${x} ${y + 0.2} ${z}`}
                            scale={`${scale} ${scale} ${scale}`}
                            rotation={`0 ${ry} 0`}/>
                    <Entity events={{click: handleClickOpen, collided: [handleCollide]}}
                            primitive={'a-cylinder'} opacity={0}
                            position={{x: x, y: y + 1.8, z: z}} scale={`${0.55 * scale} ${1.9 * scale} ${0.55 * scale}`}/>
                    <Entity text={{
                        value: ((nftItem.nft["auction"] ?
                                "For auction | End at: " + new Date(Number(nftItem.auction["biddingTime"] * 1000)).toLocaleString() +
                                "\n\nHighest bid: " + ethers.utils.formatUnits(nftItem.nft["price"], 'ether') + " MATIC"
                                :
                                "For sell\n\n" +
                                "Price: " + ethers.utils.formatUnits(nftItem.nft["price"], 'ether') + " MATIC"))
                            + "\nRoyalty: " + Number(nftItem.nft["royaltyAmount"]) + "%",
                        color: 'red',
                        align: 'center'
                    }}
                            position={`${x - Math.sin((ry) * Math.PI / 180) * 1.6 - Math.cos((ry) * Math.PI / 180)} ${y + 4.5} ${z + Math.sin((ry) * Math.PI / 180) * 1.2 - Math.cos((ry) * Math.PI / 180) * 1.6}`}
                            scale={`${scale * 3} ${scale * 3} ${scale * 3}`}
                            rotation={`0 ${ry + 5} 0`}/>
                </> : ''
            }

            <Dialog open={open} onClose={handleClose}>
                <MyDialogContent nftItem={nftItem} handleClose={handleClose}/>
            </Dialog>

        </>
    )
}

MarketModel.Prototypes = {
    x: Prototypes.number,
    y: Prototypes.number,
    z: Prototypes.number
}

export default MarketModel;