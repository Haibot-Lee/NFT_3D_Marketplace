import React, {Suspense} from 'react';
import {useParams} from "react-router-dom";

import {CircularProgress, Grid} from "@mui/material";
import ModelCavas from "../Components/ModelCavas"


export default function Detail(props) {
    let params = useParams();

    return (
        <Grid container>
            <Grid item xs={6}>
                <Suspense fallback={<CircularProgress/>}>
                    <ModelCavas key={props.token}
                                height={'80vh'}
                                width={'50vw'}
                                model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${params.token}`}/>
                </Suspense>
            </Grid>
            <Grid item xs={6}>
            </Grid>
        </Grid>
    );
}
