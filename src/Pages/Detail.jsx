import React, {Suspense, useContext, useEffect} from 'react';
import {useParams} from "react-router-dom";

import {CircularProgress, Grid} from "@mui/material";
import ModelCavas from "../Components/ModelCavas"
import UserContext from "../Components/UserContext";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {ethers} from "ethers";

const columns = [
    {id: '_recordId', label: 'RecordId', format: (value) => Number(value)},
    {id: '_tokenId', label: 'TokenId', format: (value) => Number(value)},
    {id: 'seller', label: 'Seller', format: (addr) => addr.slice(0, 4) + "..." + addr.slice(-4)},
    {id: 'buyer', label: 'Buyer', format: (addr) => addr.slice(0, 4) + "..." + addr.slice(-4)},
    {id: 'price', label: 'Price(MATIC)', format: (value) => ethers.utils.formatUnits(value, 'ether')},
    {id: 'time', label: 'Time'},
    {id: 'des', label: 'Description'},
];

const rows = [];

export default function Detail(props) {
    let params = useParams();
    const userCtx = useContext(UserContext);

    async function getHistory() {
        const history = await window.mktContract.getHistory(1);
        setRows(history);
        console.log(JSON.stringify(history));
    }

    useEffect(() => {
        getHistory();
    }, []);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Grid container sx={{pl: 1, pr: 1}}>
            <Grid item xs={6}>
                <Suspense fallback={<CircularProgress/>}>
                    <ModelCavas key={props.token}
                                height={'90vh'}
                                width={'50vw'}
                                model={`${process.env.REACT_APP_ACCESS_LINK}/ipfs/${params.token}`}/>
                </Suspense>
            </Grid>
            <Grid item xs={6}>
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
                        rowsPerPageOptions={[10, 25, 100]}
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
