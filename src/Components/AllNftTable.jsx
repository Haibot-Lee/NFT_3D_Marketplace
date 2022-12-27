import React, {Suspense, useRef} from 'react';
import {
    Avatar,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box, CardActionArea, CardActions
} from "@mui/material";
import ModelCavas from "./ModelCavas";
import {useTheme} from "@mui/material/styles";
import {BigNumber, ethers} from "ethers";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {format} from "date-fns";

function MoreVertIcon() {
    return null;
}

export default function SellingNftTable(props) {
    const theme = useTheme();

    async function buyNft(nft) {
        var time = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        await window.mktContract.buy(Number(nft[0]), time, 1);
        alert("Buy Successfully!")
    }

    async function makeABid(nft) {
        console.log(nft);
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableRow sx={{overflow: 'hidden'}}>
                        {Array.from(props.sellingNfts).map((nft) => (
                            <TableCell sx={{overflow: 'hidden'}} align={"center"}>
                                <Card component={Paper}>
                                    <CardActionArea>
                                        <Suspense fallback={<CircularProgress/>}>
                                            <ModelCavas key={nft[nft.length - 2]}
                                                        height={'60vh'}
                                                        model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${nft[nft.length - 2]}`}/>
                                        </Suspense>
                                    </CardActionArea>
                                    <CardContent>
                                        <Typography color={"text.primary"}>
                                            {nft[7] ? "" : "Price: " + ethers.utils.formatUnits(nft[4], 'ether') + " MATIC"}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{display: "flex", justifyContent: "center"}}>
                                        <Button variant="contained" onClick={() => {
                                            nft[7] ? makeABid(nft) : buyNft(nft)
                                        }}>
                                            {nft[7] ? "Bid" : "Buy"}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}