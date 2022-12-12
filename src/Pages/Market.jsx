import React, {Suspense, useRef, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls, useGLTF} from '@react-three/drei';

import {Button, CircularProgress, Grid, TextField} from "@mui/material";
import Stack from "@mui/material/Stack";

import ModelCavas from '../Components/ModelCavas'
import Divider from "@mui/material/Divider";
import {create} from "ipfs-http-client";

const authorization = "Basic " + btoa(process.env.REACT_APP_PROJECT_ID + ":" + process.env.REACT_APP_PROJECT_SECRET);
const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
        authorization
    }
})

export default function Market() {
    const [InputContent, setInputContent] = useState("");
    const [modelList, setMmodelList] = useState(['Qmd9nsf562XZYJ4JU6iAXafSML7Z4rHG2vgpB9i1xJgvaC', 'QmZSZ5ooNwbqd8MX42nd6eqG3WzmqxLUb3DdYkjHyLCC4K']);

    const getModel = async () => {
        // setMmodelList(current => [...current, InputContent])

    }

    return (
        <Stack spacing={5}>
            <Stack direction={'row'} spacing={2}>
                <TextField
                    type="text"
                    value={InputContent}
                    variant="outlined"
                    onChange={(e) => setInputContent(e.target.value)}
                />
                <Button variant="outlined" onClick={() => getModel()}>Submit</Button>
            </Stack>
            <Stack>
                <Stack direction={'row'} divider={<Divider orientation="vertical" flexItem/>} spacing={2}>
                    {modelList.map((token) => (
                        <Suspense fallback={<CircularProgress/>}>
                            <ModelCavas key={token} model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${token}`}/>
                        </Suspense>
                    ))}
                </Stack>
            </Stack>
        </Stack>
    );
}
