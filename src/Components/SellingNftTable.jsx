import React, {Suspense, useRef} from 'react';
import {
    Avatar,
    Button, Card, CardActions, CardContent, CardHeader,
    CircularProgress, Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import ModelCavas from "./ModelCavas";
import IconButton from "@mui/material/IconButton";
import {useTheme} from "@mui/material/styles";
import {BigNumber} from "ethers";
import Typography from "@mui/material/Typography";

function MoreVertIcon() {
    return null;
}

export default function SellingNftTable(props) {
    const theme = useTheme();

    return (
        // <Grid container spacing={2}>
        //     {Array.from(props.sellingNfts).map((nft, index) => (
        //         <Grid item xs={3}>
        //             <Card sx={{width: '30vw'}}>
        //                 <CardHeader
        //                     avatar={
        //                         <Avatar sx={{bgcolor: theme.palette.warning.dark}}>
        //                             {index}
        //                         </Avatar>
        //                     }
        //                     title={"Price: " + Number(nft[4]._hex)}
        //                     subheader={"null"}
        //                 />
        //                 <CardContent>
        //                     <Suspense fallback={<CircularProgress/>}>
        //                         <ModelCavas key={nft[nft.length - 2]}
        //                                     model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${nft[nft.length - 2]}`}/>
        //                     </Suspense>
        //                 </CardContent>
        //                 <CardActions>
        //                     <Button variant="contained" onClick={() => console.log(nft)}>
        //                         ...
        //                     </Button>
        //                 </CardActions>
        //             </Card>
        //         </Grid>
        //     ))}
        // </Grid>
        <>
            <Typography variant={"h5"} color={"text.primary"}>Selling Models</Typography>
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
                                <TableCell sx={{overflow: 'hidden'}} align={"center"}>
                                    <Typography color={"text.primary"}>
                                        {"Price: " + Number(nft[4]._hex) + " MATIC"}
                                    </Typography>
                                    <Button variant="contained" onClick={() => console.log(nft)}>
                                        Buy
                                    </Button>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}