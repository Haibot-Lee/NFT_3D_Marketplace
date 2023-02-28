import React, {Suspense, useContext, useEffect, useState} from 'react';
import Stack from "@mui/material/Stack";
import {
    Box,
    Button, CardActionArea, CardActions, Checkbox,
    CircularProgress,
    Paper,
    TextField
} from "@mui/material";
import UserContext from "../Components/UserContext";
import Divider from "@mui/material/Divider";
import ModelCavas from "../Components/ModelCavas";
import {useNavigate} from "react-router-dom";
import Card from "@mui/material/Card";


export default function MyNftTable(props) {
    const userCtx = useContext(UserContext);
    const navigate = useNavigate();

    const [myNftList, setMyNftList] = useState([]);
    const [open, setOpen] = useState(null);

    async function getMyTokens() {
        var res = await window.mktContract.getMyTokens(userCtx.address);
        setMyNftList(res);
        console.log("My Token" + JSON.stringify(res))
    }

    useEffect(() => {
        getMyTokens();
    }, [])

    return (
        <Stack direction={"row"} component={Paper} spacing={2} sx={{p: 1}}>
            {Array.from(myNftList).map((nft) => (
                <Card component={Paper}>
                    <CardActionArea>
                        <Suspense fallback={<CircularProgress/>}>
                            <ModelCavas key={nft['uri']}
                                        height={'70vh'}
                                        model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${nft['uri']}`}/>
                        </Suspense>
                    </CardActionArea>
                    <CardActions sx={{display: "flex", justifyContent: "center"}}>
                        <Button variant="contained" size="small" onClick={() => setOpen(nft)}>
                            change to this
                        </Button>
                    </CardActions>
                </Card>
            ))}
        </Stack>
    );
}
