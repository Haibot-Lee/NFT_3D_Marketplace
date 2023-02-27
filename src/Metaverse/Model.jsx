import 'aframe';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import Prototypes from 'prop-types'
import platform from './assets/platform.glb'

function Model({token, x, y, z, scale, ry}) {
    const loader = new GLTFLoader();
    loader.load(platform, (d) => {
        const entity = document.getElementById(`platform-${x}-${y}-${z}`);
        entity.object3D.add(d.scene);
    })
    // document.getElementById(`platform-${x}-${y}-${z}`).addEventListener('click', function (evt) {
    //     console.log('This 2D element was clicked!');
    // });
    // document.querySelector('a-entity').addEventListener('collide', function (evt) {
    //     console.log('This A-Frame entity collided with another entity!');
    // });

    if (token) {
        loader.load(`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${token}`, (d) => {
            const entity = document.getElementById(token);
            entity.object3D.add(d.scene);
        })
    }

    scale = scale ? scale : 1.5
    return (
        <>
            <a-entity id={`platform-${x}-${y}-${z}`} position={`${x} ${y + 0.3} ${z}`} scale={'0.5 0.5 0.5'}/>
            {token ?
                <a-entity id={`${token}`} position={`${x} ${y + 0.3} ${z}`} scale={`${scale} ${scale} ${scale}`}
                          rotation={`0 ${ry} 0`}/> : ''}

        </>
    )
}

Model.Prototypes = {
    x: Prototypes.number,
    y: Prototypes.number,
    z: Prototypes.number
}

export default Model;