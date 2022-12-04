import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
    const group = useRef()
    const gltf = useGLTF('/modelF.glb'); // public下的images
    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={gltf.scene} />
        </group>
    )
}

useGLTF.preload('/modelF.glb');
