import React, {Suspense, useRef} from 'react';
import {
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Box
} from "@mui/material";
import ModelCavas from "./ModelCavas";
import {useTheme} from "@mui/material/styles";
import {BigNumber, ethers} from "ethers";
import Typography from "@mui/material/Typography";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import {Button, CardActionArea, CardActions} from '@mui/material';
import Stack from "@mui/material/Stack";


export default function SellingNftTable(props) {
    const theme = useTheme();

    async function manageNft(nft) {
        console.log(nft)
    }

    return (
        <Stack direction={"row"} spacing={1} component={Paper}>
            {Array.from(props.sellingNfts).map((nft) => (
                <Card component={Paper}>
                    <CardActionArea>
                        <Suspense fallback={<CircularProgress/>}>
                            <ModelCavas key={nft[nft.length - 2]}
                                        model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${nft[nft.length - 2]}`}/>
                        </Suspense>
                    </CardActionArea>
                    <CardContent>
                        <Typography color={"text.primary"}>
                            {(nft[7] ? "Highest bid: " : "Price: ") + ethers.utils.formatUnits(nft[4], 'ether') + " MATIC"}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{display: "flex", justifyContent: "center"}}>
                        <Button variant="contained" size={"small"} onClick={() => manageNft(nft)}>
                            Manage
                        </Button>
                    </CardActions>
                </Card>
            ))}
        </Stack>
    );
}