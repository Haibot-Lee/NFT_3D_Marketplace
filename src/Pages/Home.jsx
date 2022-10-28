import React, {Suspense, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import {Grid} from "@mui/material";

import Model from '../Components/Model';

export default function Home() {

    return (
        <Grid container>
            <Grid item xs={8}>
            </Grid>
            <Grid item xs={4}>
                <Canvas
                    camera={{position: [2, 0, 12], fov: 10}}
                    style={{
                        // background: "white",
                        width: '33vw',
                        height: '100vh',
                    }}
                >
                    <ambientLight intensity={1.25}/>
                    <ambientLight intensity={0.1}/>
                    <directionalLight intensity={1}/>
                    <Suspense fallback={null}>
                        <Model position={[0.025, -0.9, 0]}/>
                    </Suspense>
                    <OrbitControls/>
                </Canvas>
            </Grid>
        </Grid>
    );
}
