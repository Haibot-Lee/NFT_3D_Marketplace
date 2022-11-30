import React, {Suspense, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';

import ModelF from '../Components/ModelF';
import {Button, Grid, TextField} from "@mui/material";
import Stack from "@mui/material/Stack";


export default function Market() {
    const [InputContent, setInputContent] = useState("");

    const getModel = async () => {
        console.log(InputContent);
        fetch(`https://ipfs.io/ipfs/${InputContent}`)
            .then(resp => resp.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = "tmp_model.glb";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => alert("Error to fetch model!"));
    }

    return (
        <Grid container>
            <Grid item>
                <Stack>
                    <TextField
                        type="text"
                        value={InputContent}
                        variant="outlined"
                        onChange={(e) => setInputContent(e.target.value)}
                    />
                </Stack>
                <Button variant="outlined" onClick={() => getModel()}>Submit</Button>
            </Grid>
            <Grid item>
                <Canvas
                    camera={{position: [2, 0, 12], fov: 10}}
                    style={{
                        // background: "white",
                        width: '30vw',
                        height: '100vh',
                    }}
                >
                    <ambientLight intensity={1.25}/>
                    <ambientLight intensity={0.1}/>
                    <directionalLight intensity={1}/>
                    <Suspense fallback={null}>
                        <ModelF position={[0.025, -0.9, 0]}/>
                    </Suspense>
                    <OrbitControls/>
                </Canvas>
            </Grid>

        </Grid>
    );
}
