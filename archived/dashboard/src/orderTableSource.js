import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from './index';

export const userColumns = [
  { field: "id", headerName: "ID", width: 40 },
  { field: "name", headerName: "Order Name", width: 100 },
  {
    field: "orderId",
    headerName: "Order Id",
    width: 90,
  },
  {
    field: "customerName",
    headerName: "Customer Name",
    width: 120,
  },
  {
    field: "phases",
    headerName: "Phases",
    width: 100,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

export const useUserRows = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const ordersRef = ref(getDatabase(app), 'orders');
    onValue(ordersRef, (snapshot) => {
        const orderData = snapshot.val();
        if (orderData) {
            const userRows = Object.keys(orderData).map((id, index) => {
                const order = orderData[id];
                
                return {
                    id:index+1,
                    name: order.orderName,
                    status: index % 2 === 0 ? "active" : "passive",
                    orderId: id,
                    customerName: order.clientName,
                    phases: order.totalPhases,
                };
            });

            setData(userRows);
        }
    });
}, []);

  
  return data;
};
