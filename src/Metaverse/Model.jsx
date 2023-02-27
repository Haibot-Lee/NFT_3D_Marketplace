import 'aframe';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import Prototypes from 'prop-types'

function Model({token, x, y, z, scale}) {
    const loader = new GLTFLoader();
    loader.load(`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${token}`, (d) => {
        const entity = document.getElementById(token);
        entity.object3D.add(d.scene);
    })

    scale = scale ? scale : 1.5
    return (
        <a-entity id={`${token}`} position={`${x} ${y + 0.3} ${z}`} scale={`${scale} ${scale} ${scale}`}></a-entity>
    )
}

Model.Prototypes = {
    x: Prototypes.number,
    y: Prototypes.number,
    z: Prototypes.number
}

export default Model;