import React, {Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';

import Model from '../Components/Model';

export default function MainPage() {
    return (
        <Canvas
            camera={{position: [2, 0, 12.25], fov: 15}}
            style={{
                backgroundColor: '#111a21',
                width: '100vw',
                height: '100vh',
            }}
        >
            <ambientLight intensity={1.25}/>
            <ambientLight intensity={0.1}/>
            <directionalLight intensity={10}/>
            <Suspense fallback={null}>
                <Model position={[0.025, -0.9, 0]}/>
            </Suspense>
            <OrbitControls/>
        </Canvas>
    );
}
