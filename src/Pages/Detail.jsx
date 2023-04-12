import React, {Suspense, useContext, useEffect, useState} from 'react';

import {CircularProgress, Grid} from "@mui/material";
import ModelCavas from "../Components/ModelCavas"
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {ethers} from "ethers";
import DetailContext from "../Components/DetailContext";
import {useParams} from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";

const columns = [
    {id: '_recordId', label: 'RecordId', format: (value) => Number(value)},
    {id: '_tokenId', label: 'TokenId', format: (value) => Number(value)},
    {id: 'seller', label: 'Seller', format: (addr) => addr.slice(0, 4) + "..." + addr.slice(-4)},
    {id: 'buyer', label: 'Buyer', format: (addr) => addr.slice(0, 4) + "..." + addr.slice(-4)},
    {id: 'price', label: 'Price(MATIC)', format: (value) => ethers.utils.formatUnits(value, 'ether')},
    {id: 'time', label: 'Time'},
    {id: 'des', label: 'Description'},
];

export default function Detail(props) {
    const detailCtx = useContext(DetailContext);
    const theme = useTheme();
    let params = useParams();

    const [token, setToken] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);

    async function getModel() {
        setToken(null)
        const nft = await window.mktContract.getTokenByTokenId(params?.id);
        setToken(nft);
        console.log(JSON.stringify(nft));
    }

    async function getHistory() {
        setRows([])
        const history = await window.mktContract.getHistory(params?.id);
        setRows(history);
        console.log(JSON.stringify(history));
    }

    useEffect(() => {
        if (params?.id) {
            getModel();
            getHistory();
            console.log("Update Detail Token");
        }
    }, [params]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    return (
        <Grid container sx={{pl: 1, pr: 1}}>
            <Grid item xs={6}>
                {token &&
                    <Suspense fallback={<CircularProgress/>}>
                        <ModelCavas key={props.token}
                                    height={'90vh'}
                                    width={'50vw'}
                                    model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${token["uri"]}`}/>
                    </Suspense>}

            </Grid>
            <Grid item xs={6}>
                {token &&
                    <Stack sx={{p: 1}}>
                        <Typography variant="h6" color={theme.palette.warning.light} align={"left"}>
                            <strong>Creator: </strong>{token["creator"]}
                        </Typography>
                        <Typography variant="h6" color={theme.palette.warning.light} align={"left"}>
                            <strong>Royalty: </strong>{Number(token["royaltyAmount"]) + "%"}
                        </Typography>
                    </Stack>}
                <Paper sx={{overflow: 'hidden'}}>
                    <TableContainer height={'90vh'}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{minWidth: column.minWidth}}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow hover key={row.code}>
                                                {columns.map((column) => {
                                                    return (
                                                        <TableCell key={column.id}>
                                                            {column.format ? column.format(row[column.id]) : row[column.id]}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 30]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
}
