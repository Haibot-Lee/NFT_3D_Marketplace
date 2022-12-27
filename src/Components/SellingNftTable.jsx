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
    Box
} from "@mui/material";
import ModelCavas from "./ModelCavas";
import {useTheme} from "@mui/material/styles";
import {BigNumber, ethers} from "ethers";
import Typography from "@mui/material/Typography";

function MoreVertIcon() {
    return null;
}

export default function SellingNftTable(props) {
    const theme = useTheme();

    async function buyNft(nft) {
        console.log(nft)
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableRow sx={{overflow: 'hidden'}}>
                        {Array.from(props.sellingNfts).map((nft) => (
                            <TableCell sx={{overflow: 'hidden'}} align={"center"}>
                                <Suspense fallback={<CircularProgress/>}>
                                    <ModelCavas key={nft[nft.length - 2]}
                                                model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${nft[nft.length - 2]}`}/>
                                </Suspense>
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow sx={{overflow: 'hidden'}}>
                        {Array.from(props.sellingNfts).map((nft) => (
                            <TableCell align={"center"}>
                                <Typography color={"text.primary"}>
                                    {nft[7] ? "" : "Price: " + ethers.utils.formatUnits(nft[4], 'ether') + " MATIC"}
                                </Typography>
                                <Box sx={{justifyContent: "space-between"}}>
                                    <Button variant="outlined">Details</Button>
                                    <Button variant="contained" onClick={() => buyNft(nft)}>
                                        {nft[7] ? "Bid" : "Buy"}
                                    </Button>
                                </Box>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}