import React, {Suspense, useContext, useState} from 'react';
import {
    CircularProgress,
    Paper, DialogTitle, DialogContent, TextField, DialogActions, Dialog
} from "@mui/material";
import ModelCavas from "./ModelCavas";
import {BigNumber, ethers} from "ethers";
import Typography from "@mui/material/Typography";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Button, CardActionArea, CardActions} from '@mui/material';
import Stack from "@mui/material/Stack";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";
import DetailContext from "./DetailContext";


export default function SellingNftTable(props) {
    const navigate = useNavigate();
    const detailCtx = useContext(DetailContext);

    const navDetail = (nft) => {
        // detailCtx.setContext({
        //     token: nft['uri'],
        //     tokenId: nft['_tokenId']
        // });
        props.handleClose();
        navigate(`/detail/${nft['_tokenId']}`);
    }

    const [open, setOpen] = useState(null);
    const [price, setPrice] = useState(0);
    const handleCloseDialog = () => {
        setOpen(null);
        setPrice(0);
    }

    async function changePrice(nft) {
        console.log(nft);
        var time = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        await window.mktContract.changePrice(nft[0], ethers.utils.parseUnits(price, 'ether'), time)
            .then(() => {
                setOpen(false);
                alert("Price changed!");
            })
            .catch((error) => {
                setOpen(false);
                alert(error.reason)
            });
    }

    async function endAuction(nft) {
        console.log("Auction end and Refund!");
        var time = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        await window.mktContract.refund(nft["_tradeId"], time)
            .then(() => {
                setOpen(false);
                alert("Auction ended");
            })
            .catch((error) => {
                setOpen(false);
                alert(error.reason)
            });
    }

    return (
        <>
            <Stack direction={"row"} spacing={1} component={Paper}>
                {Array.from(props.sellingNfts).map((nft) => (
                    <Card component={Paper}>
                        <CardActionArea onClick={() => navDetail(nft)}>
                            <Suspense fallback={<CircularProgress/>}>
                                <ModelCavas key={nft['uri']}
                                            model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${nft['uri']}`}/>
                            </Suspense>
                        </CardActionArea>
                        <CardContent sx={{display: 'flex', justifyContent: 'center'}}>
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
                                    End Auction
                                </Button>}

                        </CardActions>
                    </Card>
                ))}
            </Stack>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Change price</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus required fullWidth
                        margin="dense"
                        label="Price(MATIC)"
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
