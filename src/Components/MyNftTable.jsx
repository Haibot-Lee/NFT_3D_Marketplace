import React, {Suspense, useContext, useState} from 'react';
import Stack from "@mui/material/Stack";
import {
    Button, CardActionArea, CardActions, Checkbox, Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Paper,
    TextField
} from "@mui/material";
import Divider from "@mui/material/Divider";
import ModelCavas from "../Components/ModelCavas";
import {useNavigate} from "react-router-dom";
import dayjs from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {BigNumber, ethers} from "ethers";
import Card from "@mui/material/Card";
import DetailContext from "./DetailContext";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import UserContext from "./UserContext";


export default function MyNftTable(props) {
    const detailCtx = useContext(DetailContext);
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();

    const navDetail = (nft) => {
        // detailCtx.setContext({
        //     token: nft['uri'],
        //     tokenId: nft['_tokenId']
        // });
        props.handleClose();
        navigate(`/detail/${nft['_tokenId']}`);
    }

    async function publish(nft) {
        console.log("sell nft: " + nft)
        if (checked) {
            //sell
            await window.mktContract.publicToAll(Number(nft[0]), ethers.utils.parseUnits(price, 'ether'), false, 0)
                .then(() => {
                    alert("Sell this NFT successfully!");
                    handleCloseDialog();
                })
                .catch((error) => {
                    handleCloseDialog();
                    alert(error.reason)
                });

        } else {
            //bid
            await window.mktContract.publicToAll(Number(nft[0]), 0, true, timeString.unix())
                .then(() => {
                    alert("Auction this NFT successfully!");
                    handleCloseDialog();
                })
                .catch((error) => {
                    handleCloseDialog();
                    alert(error.reason)
                });
        }

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
            <Stack direction={"row"} component={Paper} spacing={1}>
                {Array.from(props.myNftList).map((nft) => (
                    <Card component={Paper}>
                        <CardActionArea onClick={() => navDetail(nft)}>
                            <Suspense fallback={<CircularProgress/>}>
                                <ModelCavas key={nft['uri']}
                                            model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${nft['uri']}`}/>
                            </Suspense>
                        </CardActionArea>
                        <CardContent sx={{display: 'flex', justifyContent: 'center'}}>
                            <Stack>
                                <Chip size="small" color="warning"
                                      label={nft["creator"] === userCtx?.address ? "Creator" : "Collector"}/>
                                <Typography color={"text.primary"}>
                                    {"Royalty: " + Number(nft["royaltyAmount"]) + "%"}
                                </Typography>
                            </Stack>
                        </CardContent>
                        <CardActions sx={{display: "flex", justifyContent: "center"}}>
                            <Button variant="contained" size="small" onClick={() => setOpen(nft)}>
                                Public
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Stack>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Publish to NFT Marketplace</DialogTitle>
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
                    <Button onClick={() => publish(open)}>Publish</Button>
                </DialogActions>
            </Dialog>
        </>

    );
}
