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

function MarketModel({nftItem, x, y, z, scale, ry}) {
    scale = scale ? scale : 1.5

    var token = nftItem?.nft['uri'];

    const loader = new GLTFLoader();
    loader.load(platform, (d) => {
        const entity = document.getElementById(`platform-${x}-${y}-${z}`);
        entity.object3D.add(d.scene);
    })

    const userCtx = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [bidPrice, setBidPrice] = useState(0);
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
                            primitive={'a-cylinder'} color={"orange"}
                            position={{x: x, y: y - 0.2, z: z}} scale={'1.1 0.5 1.1'}/>
                    <Entity text={{
                        value: (nftItem.nft["auction"] ?
                            "For auction | End at: " + new Date(Number(nftItem.auction["biddingTime"] * 1000)).toLocaleString() +
                            "\n\nHighest bid: " + ethers.utils.formatUnits(nftItem.nft[4], 'ether') + " MATIC"
                            :
                            "For sell\n\n" +
                            "Price: " + ethers.utils.formatUnits(nftItem.nft[4], 'ether') + " MATIC"),
                        color: 'red',
                        align: 'center'
                    }}
                            position={`${x - Math.sin((ry) * Math.PI / 180) * 1.6 - Math.cos((ry) * Math.PI / 180)} ${y + 4.5} ${z + Math.sin((ry) * Math.PI / 180) * 1.2 - Math.cos((ry) * Math.PI / 180) * 1.6}`}
                            scale={`${scale * 3} ${scale * 3} ${scale * 3}`}
                            rotation={`0 ${ry + 5} 0`}/>
                </> : ''
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {nftItem?.nft["auction"] ? "Make a bid" : "Buy this NFT?"}
                </DialogTitle>
                {nftItem?.nft["auction"] ?
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
                    </DialogContent> : ""}
                <DialogActions>
                    <Button variant="outlined" color={"error"} onClick={handleClose}>Cancel</Button>
                    <Button variant="outlined" onClick={() => {
                        nftItem?.nft["auction"] ? makeABid(nftItem.nft) : buyNft(nftItem.nft)
                    }}>Confirm</Button>
                </DialogActions>
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