import 'aframe';
import {Entity, Scene} from 'aframe-react';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import Prototypes from 'prop-types'
import platform from './assets/platform.glb'

import React, {useContext, useEffect, useState} from 'react';
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

function MyModel({token, x, y, z, scale, ry}) {
    scale = scale ? scale : 1.5

    const loader = new GLTFLoader();
    loader.load(platform, (d) => {
        const entity = document.getElementById(`platform-${x}-${y}-${z}`);
        entity.object3D.add(d.scene);
    })

    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCollide = () => console.log('collided!');

    function setModel(ipfs_token) {
        if (ipfs_token) {
            loader.load(`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${ipfs_token}`, (d) => {
                const entity = document.getElementById(`${token}-${x}-${y}-${z}`);
                entity.object3D.clear();
                entity.object3D.add(d.scene);
            })
        } else {
            const entity = document.getElementById(`${token}-${x}-${y}-${z}`);
            entity.object3D.clear();
        }
    }

    const changeModel = (newToken) => {
        setModel(newToken);
        setOpen(false);
    }

    useEffect(() => {
        setModel(token)
    }, [token])

    return (
        <>
            <Entity id={`platform-${x}-${y}-${z}`} position={`${x} ${y + 0.3} ${z}`} scale={'0.3 0.5 0.3'}/>
            <Entity events={{click: handleClickOpen, collided: [handleCollide]}}
                    primitive={'a-cylinder'} color={"orange"}
                    position={{x: x, y: y, z: z}} scale={'0.8 0.5 0.8'}/>
            <Entity id={`${token}-${x}-${y}-${z}`}
                    position={`${x} ${y + 0.4} ${z}`} scale={`${scale} ${scale} ${scale}`}
                    rotation={`0 ${ry} 0`}/>
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
                            Change Display Models
                        </Typography>
                        <Button color="inherit" variant="outlined" onClick={() => changeModel(null)}>
                            Clear Model
                        </Button>
                    </Toolbar>
                </AppBar>

                <ChangeModelTable changeModel={changeModel}/>
            </Dialog>

        </>
    )
}

MyModel.Prototypes = {
    x: Prototypes.number,
    y: Prototypes.number,
    z: Prototypes.number
}

export default MyModel;