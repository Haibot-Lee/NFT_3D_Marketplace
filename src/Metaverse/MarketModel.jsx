import 'aframe';
import {Entity, Scene} from 'aframe-react';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import Prototypes from 'prop-types'
import platform from './assets/platform2.glb'

import React, {useContext, useState} from 'react';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import {useTheme} from "@mui/material/styles";
import {ethers} from "ethers";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function MarketModel({nftItem, x, y, z, scale, ry}) {
    scale = scale ? scale : 1.5

    var token = nftItem?.nft['uri'];

    const loader = new GLTFLoader();
    loader.load(platform, (d) => {
        const entity = document.getElementById(`platform-${x}-${y}-${z}`);
        entity.object3D.add(d.scene);
    })

    if (token) {
        loader.load(`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${token}`, (d) => {
            const entity = document.getElementById(token);
            entity.object3D.add(d.scene);
        })
    }

    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCollide = () => console.log('collided!');

    return (
        <>
            <a-entity id={`platform-${x}-${y}-${z}`} position={`${x} ${y + 0.1} ${z}`}/>

            {token ?
                <>
                    <Entity id={token}
                            events={{click: handleClickOpen, collided: [handleCollide]}}
                            position={`${x} ${y + 0.2} ${z}`}
                            scale={`${scale} ${scale} ${scale}`}
                            rotation={`0 ${ry} 0`}/>
                    <Entity events={{click: handleClickOpen, collided: [handleCollide]}}
                            primitive={'a-cylinder'} color={"orange"}
                            position={{x: x, y: y - 0.2, z: z}} scale={'1.1 0.5 1.1'}/>
                    <Entity text={{
                        value: (nftItem.nft["auction"] ?
                            "For auction | End at: " + new Date(Number(nftItem.auction["biddingTime"] * 1000)).toLocaleString() +
                            "\n\nHighest bid: " + ethers.utils.formatUnits(nftItem.nft[4], 'ether') + " MATIC"
                            :
                            "For sell\n\n" +
                            "Price: " + ethers.utils.formatUnits(nftItem.nft[4], 'ether') + " MATIC"),
                        color: 'red',
                        align: 'center'
                    }}
                            position={`${x - Math.sin((ry) * Math.PI / 180) * 1.6 - Math.cos((ry) * Math.PI / 180)} ${y + 4.5} ${z + Math.sin((ry) * Math.PI / 180) * 1.2 - Math.cos((ry) * Math.PI / 180) * 1.6}`}
                            scale={`${scale * 3} ${scale * 3} ${scale * 3}`}
                            rotation={`0 ${ry + 5} 0`}/>
                </> : ''
            }

        </>
    )
}

MarketModel.Prototypes = {
    x: Prototypes.number,
    y: Prototypes.number,
    z: Prototypes.number
}

export default MarketModel;