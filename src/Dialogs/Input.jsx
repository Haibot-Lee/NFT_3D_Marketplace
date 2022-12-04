import React, {useState, useContext, useRef, useEffect, Suspense} from 'react';
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
import {OrbitControls} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";

import Model from "../Components/Model";


const authorization = "Basic " + btoa(process.env.REACT_APP_PROJECT_ID + ":" + process.env.REACT_APP_PROJECT_SECRET);
const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
        authorization
    }
})

export default function InputDialog(props) {

    const [isLoadinging, setIsLoadinging] = useState(false);

    const [file, setFile] = useState(null);

    const uploadToIpfs = async () => {
        if (file) {
            setIsLoadinging(true);
            const response = await ipfs.add(file);
            console.log(response);
            const token = response.path
            console.log(token)
            setIsLoadinging(false);
        }
    }

    const genPreview = () => {
        setIsLoadinging(true);

        setIsLoadinging(false);
    }


    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>Upload your model</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <form>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
                    </form>
                    <Typography variant="h6" fontWeight="bold" sx={{mt: 0}}>Preview: </Typography>
                    {isLoadinging ? <CircularProgress/> :
                        <Canvas
                            camera={{position: [2, 0, 12], fov: 10}}
                            style={{width: '33vw', height: '70vh'}}
                        >
                            <ambientLight intensity={1.25}/>
                            <ambientLight intensity={0.1}/>
                            <directionalLight intensity={1}/>
                            <Suspense fallback={null}>
                                <Model position={[0.025, -0.9, 0]}/>
                            </Suspense>
                            <OrbitControls/>
                        </Canvas>
                    }
                </Stack>

            </DialogContent>
            <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant="outlined" onClick={() => genPreview()}
                        disabled={!file}>Generate Preview</Button>
                <Button variant="outlined" onClick={() => uploadToIpfs()}
                        disabled={!file || isLoadinging}>Upload</Button>
            </DialogActions>
        </Dialog>
    );
}
