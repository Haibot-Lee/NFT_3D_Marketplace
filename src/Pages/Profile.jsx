// @ts-ignore
import React, {Suspense, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';

import Model from '../Components/Model';


export default function Profile() {
    return (
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
                <Model position={[0.025, -0.9, 0]}/>
            </Suspense>
            <OrbitControls/>
        </Canvas>
    );
}
