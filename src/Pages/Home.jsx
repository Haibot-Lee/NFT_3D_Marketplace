import React, {Suspense, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';

import Model from '../Components/Model';
import ModelF from '../Components/ModelF';

import {Grid} from "@mui/material";


export default function Home() {

    return (
        <Grid container>
            <Grid item xs={10}>
                <Canvas
                    camera={{position: [2, 0, 12], fov: 10}}
                    style={{
                        background: "white",
                        width: '30vw',
                        height: '70vh',
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
            <Grid item xs={2}>
                <Canvas
                    camera={{position: [2, 0, 12], fov: 10}}
                    style={{
                        // background: "white",
                        width: '30vw',
                        height: '70vh',
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
