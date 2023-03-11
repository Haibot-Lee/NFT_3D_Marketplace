import React, {useContext, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import {useTheme} from "@mui/material/styles";
import Market from "../Pages/Market";
import Profile from "../Pages/Profile";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function InSpaceDialog(props) {

    const theme = useTheme();

    return (
        <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={props.handleClose}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h5" fontWeight={"bold"}
                                color={theme.palette.text.primary} align={"left"}>
                        {props.page}
                    </Typography>
                </Toolbar>
            </AppBar>

            {props.page === 'Market' ? <Market/> : ''}
            {props.page === 'Profile' ? <Profile/> : ''}
        </Dialog>
    )
}