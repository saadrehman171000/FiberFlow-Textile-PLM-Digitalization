import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../index';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './table.scss';

const List = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const picturesRef = ref(getDatabase(app), 'Pictures Data');
        onValue(picturesRef, (snapshot) => {
            const pictureData = snapshot.val();

            if (pictureData) {
                const ordersRef = ref(getDatabase(app), 'orders');
                onValue(ordersRef, (snapshot) => {
                    const orderData = snapshot.val();

                    if (orderData) {
                        const mergedRows = Object.keys(pictureData).map((picId) => {
                            const picture = pictureData[picId];
                            
                            const order = orderData[picture.orderId];
                            
                            return {
                                picId,
                                orderId: picture.orderId,
                                customerName: order ? order.clientName : 'N/A',
                                dateTime: picture.time,
                                status: picture.status,
                            };
                        });

                        setRows(mergedRows);
                    }
                });
            }
        });
    }, []);

    return (
        <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className='tableCell'>Pic-ID</TableCell>
                        <TableCell className='tableCell'>Order-ID</TableCell>
                        <TableCell className='tableCell'>Client Name</TableCell>
                        <TableCell className='tableCell'>Date & Time</TableCell>
                        <TableCell className='tableCell'>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.picId}>
                            <TableCell component="th" scope="row">
                                {row.picId}
                            </TableCell>
                            <TableCell className='tableCell'>{row.orderId}</TableCell>
                            <TableCell className='tableCell'>{row.customerName}</TableCell>
                            <TableCell className='tableCell'>{row.dateTime}</TableCell>
                            <TableCell className='tableCell'>
                                <span className={`status ${row.status}`}>{row.status}</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default List;
