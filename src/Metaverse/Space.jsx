import React, {Suspense} from 'react';

import sky from './bg.jpeg'
import gallery from './assets/space.glb'
import 'aframe';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import Model from './Model'


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
            <a-sky color="#FFFFFF"
                   material={"src: #sky"}
                   rotation="0 0 0"/>
            <a-entity id="gallery" position="0 0 0"></a-entity>

            <a-box position="5 5 3" rotation="0 45 0" color="#4CC3D9"></a-box>
            <Model token={'QmZSZ5ooNwbqd8MX42nd6eqG3WzmqxLUb3DdYkjHyLCC4K'} x={5} y={0} z={5}/>
        </a-scene>
    );
}
