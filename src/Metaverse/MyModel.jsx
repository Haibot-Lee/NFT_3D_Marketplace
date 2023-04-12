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
import {DialogContent, DialogTitle, TextField} from "@mui/material";
import {NumericFormat, NumericFormatProps} from "react-number-format";
import Stack from "@mui/material/Stack";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const NumericFormatCustom = React.forwardRef(
    function NumericFormatCustom(props, ref) {
        const {onChange, ...other} = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value
                        }
                    });
                }}
                thousandSeparator
                valueIsNumericString
            />
        );
    }
);

function MyModel({token, x, y, z, scale, ry}) {

    const [ipfsToken, setIpfsToken] = useState(token);

    const [px, setPx] = useState(x);
    const [py, setPy] = useState(y);
    const [pz, setPz] = useState(z);
    const [sc, setSc] = useState(scale ? scale : 1.5);
    const [pry, setPry] = useState(ry);

    const loader = new GLTFLoader();
    loader.load(platform, (d) => {
        const entity = document.getElementById(`platform-${x}-${y}-${z}`);
        entity.object3D.add(d.scene);
    })

    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setOpen2(true);
    }
    const handleCollide = () => console.log('collided!');

    function setModel(ipfs_token) {
        if (ipfs_token) {
            setIpfsToken(ipfs_token);
            loader.load(`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${ipfs_token}`, (d) => {
                const entity = document.getElementById(`${token}-${x}-${y}-${z}`);
                entity.object3D.clear();
                entity.object3D.add(d.scene);
            })
        } else {
            setIpfsToken(null);
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
                    primitive={'a-cylinder'} opacity={ipfsToken ? 0 : 0.2} color={'#651fff'}
                    position={{x: px, y: py + 1.8, z: pz}} scale={`${0.55 * sc} ${1.8 * sc} ${0.55 * sc}`}/>
            <Entity id={`${token}-${x}-${y}-${z}`}
                    position={`${px} ${py + 0.4} ${pz}`} scale={`${sc} ${sc} ${sc}`}
                    rotation={`0 ${pry} 0`}/>

            <Dialog fullScreen open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => setOpen(false)}>
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant="h5" fontWeight={"bold"}
                                    color={theme.palette.text.primary} align={"left"}>
                            Change Display Model
                        </Typography>
                        <Button color="inherit" variant="outlined" onClick={handleClose}>
                            Change Position
                        </Button>
                        <Button color="error" variant="outlined" onClick={() => changeModel(null)} sx={{ml: 1}}>
                            Clear Model
                        </Button>
                    </Toolbar>
                </AppBar>

                <ChangeModelTable changeModel={changeModel}/>
            </Dialog>
            <Dialog open={open2} onClose={() => setOpen2(false)}>
                <DialogTitle>
                    Change Position
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={1}>
                        <TextField
                            label="Scale"
                            value={sc}
                            onChange={(e) => setSc(e.target.value)}
                            name="numberformat"
                            InputProps={{
                                inputComponent: NumericFormatCustom,
                            }}
                            variant="standard"
                        />
                        <Stack direction={"row"} spacing={0.5}>
                            <TextField
                                label="x"
                                value={px}
                                onChange={(e) => setPx(e.target.value)}
                                name="numberformat"
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                }}
                                variant="standard"
                                sx={{maxWidth: 50}}
                            />
                            <TextField
                                label="z"
                                value={pz}
                                onChange={(e) => setPz(e.target.value)}
                                name="numberformat"
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                }}
                                variant="standard"
                                sx={{maxWidth: 50}}
                            />
                            <TextField
                                label="y"
                                value={py}
                                onChange={(e) => setPy(e.target.value)}
                                name="numberformat"
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                }}
                                variant="standard"
                                sx={{maxWidth: 50}}
                            />
                        </Stack>
                        <TextField
                            label="Rotation"
                            value={pry}
                            onChange={(e) => setPry(e.target.value)}
                            name="numberformat"
                            InputProps={{
                                inputComponent: NumericFormatCustom,
                            }}
                            variant="standard"
                        />
                    </Stack>
                </DialogContent>
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