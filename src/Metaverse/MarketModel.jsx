import 'aframe';
import {Entity, Scene} from 'aframe-react';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import Prototypes from 'prop-types'
import platform from './assets/platform2.glb'

import React, {useContext, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import ChangeModelTable from "./ChangeModelTable";
import {useTheme} from "@mui/material/styles";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function MarketModel({nftItem, x, y, z, scale, ry}) {
    var token = nftItem?.nft['uri']
    scale = scale ? scale : 1.5

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

    const changeModel = (newToken) => {
        //TODO: with add model bug
        loader.load(`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${newToken}`, (d) => {
            const entity = document.getElementById(`box-${x}-${y}-${z}`);
            entity.object3D.clear();
            entity.object3D.add(d.scene);
            entity.setAttribute('position', `${x} ${y + 0.4} ${z}`);
            console("pos changed!!!!!!!!!!")
        })
    }

    return (
        <>
            <a-entity id={`platform-${x}-${y}-${z}`} position={`${x} ${y + 0.1} ${z}`}/>

            {token ?
                <Entity id={token}
                        events={{click: handleClickOpen, collided: [handleCollide]}}
                        position={`${x} ${y + 0.2} ${z}`} scale={`${scale} ${scale} ${scale}`}
                        rotation={`0 ${ry} 0`}/> : ''
            }

            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant="h5" fontWeight={"bold"}
                                    color={theme.palette.text.primary} align={"left"}>
                            Your Models
                        </Typography>
                    </Toolbar>
                </AppBar>

                <ChangeModelTable changeModel={changeModel} onClose={handleClose}/>
            </Dialog>

        </>
    )
}

MarketModel.Prototypes = {
    x: Prototypes.number,
    y: Prototypes.number,
    z: Prototypes.number
}

export default MarketModel;