import React, {useState, useContext, useRef} from 'react';
import {FileUpload} from 'react-ipfs-uploader'
import {create} from 'ipfs-http-client';
import * as IPFS from 'ipfs-core'

import Typography from '@mui/material/Typography';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import Stack from "@mui/material/Stack";

// const ipfsClient = create()

export default function InputDialog(props) {

    const [fileUrl, setFileUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(undefined);

    // const file = useRef()

    const getModel = async () => {
        console.log(selectedFile)

        const ipfs = await IPFS.create()
        const addResponse = await ipfs.add(selectedFile)
        console.info(addResponse)

    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>
                Upload your model
            </DialogTitle>
            <DialogContent>
                <form>
                    <input type="file" value={"test"}
                           onChange={(e) => setSelectedFile(e.target.files[0])}/>
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => getModel()}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}
