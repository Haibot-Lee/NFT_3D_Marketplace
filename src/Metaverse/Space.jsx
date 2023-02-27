import React, {Suspense} from 'react';
import sky from '../bg.jpeg'
import gallery from '../models/space.glb'

import 'aframe';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'


export default function Space(props) {
    const loader = new GLTFLoader();
    loader.load(gallery, (d) => {
        const entity = document.getElementById("gallery");
        entity.object3D.add(d.scene);

    });

    return (
        <a-scene>
            <a-assets>
                <img id="sky" src={sky}/>
            </a-assets>

            <a-sky
                color="#FFFFFF"
                material={"src: sky"}
                rotation="0 0 0"
            >

            </a-sky>
            <a-entity id="gallery" position="0 0 0"></a-entity>
        </a-scene>
    );
}
