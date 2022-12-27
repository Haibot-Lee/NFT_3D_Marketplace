import React, {Suspense, useRef} from 'react'
import {OrbitControls, useGLTF} from '@react-three/drei'
import {Canvas} from "@react-three/fiber";
import {Box, CircularProgress} from "@mui/material";

export default function Model(props) {
    const group = useRef()
    const gltf = useGLTF(props.model);

    return (
        <Canvas
            camera={{position: [2, 0, 12], fov: 10}}
            style={{height: props.height ? props.height : '30vh'}}
        >
            <ambientLight intensity={1.25}/>
            <ambientLight intensity={0.1}/>
            <directionalLight intensity={1}/>
            <Suspense fallback={null}>
                <group ref={group} position={[0.025, -0.9, 0]} dispose={null}>
                    <primitive object={gltf.scene}/>
                </group>
            </Suspense>
            <OrbitControls/>
        </Canvas>
    )
}
