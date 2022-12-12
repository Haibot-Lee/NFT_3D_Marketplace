import React, {useState, useContext, useRef, useEffect, Suspense} from 'react';
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
import {OrbitControls, useGLTF} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {useTheme} from "@mui/material/styles";


const authorization = "Basic " + btoa(process.env.REACT_APP_PROJECT_ID + ":" + process.env.REACT_APP_PROJECT_SECRET);
const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
        authorization
    }
})

function useUpdateModel(filename) {
    useGLTF.preload(`/${filename}`)
    const gltf = useGLTF(`/${filename}`);
    return gltf.scene
}

export default function InputDialog(props) {
    const theme = useTheme();

    const [isLoadinging, setIsLoadinging] = useState(false);
    const [file, setFile] = useState(null);

    const group = useRef()
    const model = useUpdateModel(file ? file.name : 'modelA.glb')

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

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>
                <Typography variant="h5" fontWeight="bold" sx={{mt: 0}}>Upload your model</Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <form>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
                    </form>
                    {file ?
                        <>
                            {isLoadinging ?
                                <Stack direction='row' spacing={2}>
                                    <CircularProgress size={25} color='warning'/>
                                    <Typography variant="h6" fontWeight="bold" sx={{mt: 0}}>Uploading...</Typography>
                                </Stack>
                                :
                                <Typography variant="h6" fontWeight="bold" sx={{mt: 0}}>Preview: </Typography>
                            }
                            <Suspense fallback={null}>
                                <Canvas
                                    camera={{position: [2, 0, 12], fov: 10}}
                                    style={{width: '30vw', height: '70vh'}}
                                >
                                    <ambientLight intensity={1.25}/>
                                    <ambientLight intensity={0.1}/>
                                    <directionalLight intensity={1}/>
                                    <Suspense fallback={null}>
                                        <group ref={group} position={[0.025, -0.9, 0]} dispose={null}>
                                            <primitive object={model}/>
                                        </group>
                                    </Suspense>
                                    <OrbitControls/>
                                </Canvas>
                            </Suspense>
                        </> :
                        <Typography variant="h6" fontWeight="bold" sx={{mt: 0}}>Please select a model</Typography>
                    }
                </Stack>

            </DialogContent>
            <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant="outlined" onClick={() => uploadToIpfs()}
                        disabled={!file || isLoadinging}>Upload</Button>
            </DialogActions>
        </Dialog>
    );
}
