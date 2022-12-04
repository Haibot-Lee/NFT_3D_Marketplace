import React, {useState, useContext, useRef, useEffect} from 'react';
import {FileUpload} from 'react-ipfs-uploader'
import {create} from 'ipfs-http-client';
import * as IPFS from 'ipfs-core'

import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';
import Stack from "@mui/material/Stack";
import Typography from '@mui/material/Typography';


export default function InputDialog(props) {

    const [isReading, setIsReading] = useState(false);
    const [fileContent, setFileContent] = useState(null);

    const uploadToIpfs = async () => {
        if (fileContent) {
            const ipfs = await IPFS.create()
            const addResponse = await ipfs.add(fileContent)
            console.info(addResponse)
        }
    }

    const handleFileReader = async (e) => {
        console.log("reading")
        setIsReading(true);
        try {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log(e.target.result)
                setFileContent(e.target.result)
                setIsReading(false);
                console.log("finish reading")
            }
            reader.readAsText(file)
        } catch (error) {
            console.log(error)
        }
    };


    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>Upload your model</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <form>
                        <input type="file" onChange={handleFileReader}/>
                    </form>
                    <Typography variant="h6" fontWeight="bold" sx={{mt:0}}>Preview: </Typography>
                    {isReading ? <CircularProgress/> : fileContent}
                </Stack>

            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => uploadToIpfs()}
                        disabled={!fileContent || isReading}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}
