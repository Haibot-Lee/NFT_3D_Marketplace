import React, {Suspense, useState} from 'react';

import {CircularProgress, Grid} from "@mui/material";
import ModelCavas from "../Components/ModelCavas"


export default function Detail(props) {
    return (
        <Grid container>
            <Grid item xs={6}>
                <Suspense fallback={<CircularProgress/>}>
                    <ModelCavas key={props.token}
                                height={'80vh'}
                                model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${props.token}`}/>
                </Suspense>
            </Grid>
            <Grid item xs={6}>
            </Grid>
        </Grid>
    );
}
