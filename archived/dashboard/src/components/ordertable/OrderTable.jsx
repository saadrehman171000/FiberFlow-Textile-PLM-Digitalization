import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { userColumns, useUserRows }  from '../../orderTableSource';
import { Link } from "react-router-dom";

import "./ordertable.scss";

const OrderTable = () => {
  const userRows = useUserRows();
  const [data, setData] = useState(userRows);
  useEffect(() => {
    if (userRows) {
        const rows = Object.values(userRows);
        setData(rows);
    }
}, [userRows]);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/order/${params.row.orderId}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="ordertable">
      <div className="datatableTitle">
        Add New Order
        <Link to="/order/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default OrderTable;
