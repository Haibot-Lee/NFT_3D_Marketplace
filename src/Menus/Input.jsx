import React, {useState, Suspense} from 'react';
import {create} from 'ipfs-http-client';
import {format} from "date-fns";

import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Slider
} from '@mui/material';
import Stack from "@mui/material/Stack";
import Typography from '@mui/material/Typography';
import ModelCavas from '../Components/ModelCavas'


const authorization = "Basic " + btoa(process.env.REACT_APP_PROJECT_ID + ":" + process.env.REACT_APP_PROJECT_SECRET);
const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
        authorization
    }
})

export default function InputDialog(props) {
    const [isLoadinging, setIsLoadinging] = useState(false);
    const [token, setToken] = useState(null);

    const [royalty, setRoyalty] = useState(10);

    const uploadToIpfs = async (file) => {
        setIsLoadinging(true);
        const response = await ipfs.add(file);
        console.log(response);
        const model_token = response.path
        console.log(model_token);
        setToken(model_token)
        setIsLoadinging(false);
    }

    async function mintNFT() {
        if (token) {
            setIsLoadinging(true);
            var date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
            await window.nftContract.mint(token);
            var tokenId = await window.nftContract.getNumber();
            await window.mktContract.listToken(process.env.REACT_APP_NFT, Number(tokenId), token, date, royalty);
            closeDialog();
            alert("NFT created successfully!");
            setIsLoadinging(false);
        } else {
            alert("No model selected!")
        }
    }

    const closeDialog = () => {
        setToken(null);
        setIsLoadinging(false);
        props.handleClose();
    }

    return (
        <Dialog open={props.open} onClose={closeDialog}>
            <DialogTitle>
                <Typography variant="h5" fontWeight="bold" sx={{mt: 0}}>Mint your NFT</Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <form>
                        <input type="file" onChange={(e) => uploadToIpfs(e.target.files[0])}/>
                    </form>
                    {isLoadinging ?
                        <Stack direction='row' spacing={2}>
                            <CircularProgress size={25} color='warning'/>
                            <Typography variant="h6" fontWeight="bold" sx={{mt: 0}}>Uploading...</Typography>
                        </Stack>
                        :
                        <Typography variant="h6" fontWeight="bold"
                                    sx={{mt: 0}}>Preview: {token ? '' : 'Please select a model!'}</Typography>
                    }
                    {token ?
                        <>
                            <Suspense fallback={<CircularProgress/>}>
                                <ModelCavas
                                    model={token ? `${process.env.REACT_APP_ACCESS_LINK}/ipfs/${token}` : ''}
                                    height={"70vh"} width={'30vw'}/>
                            </Suspense>
                            <Stack direction='row' spacing={2}>
                                <Typography gutterBottom>
                                    Royalty(%)
                                </Typography>
                                <Slider
                                    defaultValue={royalty}
                                    value={royalty}
                                    onChange={(e) => setRoyalty(e.target.value === '' ? 0 : Number(e.target.value))}
                                    valueLabelDisplay="auto"
                                    color="success"
                                    marks min={0} max={100} step={10}
                                />
                            </Stack>
                        </>
                        : ''
                    }

                </Stack>

            </DialogContent>
            <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant="outlined" onClick={() => mintNFT()}
                        disabled={!token || isLoadinging}>Mint</Button>
            </DialogActions>
        </Dialog>
    );
}
