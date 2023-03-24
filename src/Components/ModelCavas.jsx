import React, {Suspense, useEffect, useRef} from 'react'
import {OrbitControls, useAnimations, useGLTF} from '@react-three/drei'
import {Canvas} from "@react-three/fiber";

function Model(props) {
    const group = useRef()
    const gltf = useGLTF(props.model);
    const {actions} = useAnimations(gltf.animations, group);

    useEffect(() => {
        if (gltf.animations.length > 0 && actions['Armature|mixamo.com|Layer0']) {
            actions['Armature|mixamo.com|Layer0'].play();
        }
    });

    return (
        <group ref={group} position={[0.025, -0.9, 0]} dispose={null}>
            <group name="Scene">
                <group name="Armature">
                    <primitive object={gltf.scene}/>
                </group>
            </group>
        </group>
    )
}

export default function ModelCavas(props) {
    return (
        <Canvas
            camera={{position: [2, 0, 12], fov: 10}}
            style={{height: props.height ? props.height : '30vh', width: props.width ? props.width : 'auto'}}
        >
            <ambientLight intensity={1.25}/>
            <ambientLight intensity={0.1}/>
            <directionalLight intensity={1}/>
            <Suspense fallback={null}>
                <Model model={props.model}/>
            </Suspense>
            <OrbitControls/>
        </Canvas>
    )
}
