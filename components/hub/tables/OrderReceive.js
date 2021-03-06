import React, { useEffect, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Input, Button, message, Space } from "antd";
import SelectHub from "../SelectHub";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { getHubDetails, receiveOrder } from "../../../pages/api";
import { LoadingOutlined } from "@ant-design/icons";

const App = (props) => {
  const { hubId } = props;
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [tableData, setTableData] = useState([]);
  const handleGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);

    /* fetch data here to populate tables */
    // getHubDetails(hubId)
    //   .then((res) => {
    //     const { data = {}, message = "" } = res.data;
    //     console.log("data", data);

    //     const orders_to_be_received = data.orders_to_be_received;
    //     setTableData(orders_to_be_received);
    //     // params.api.applyTransaction({ add: orders_to_be_received });
    //   })
    //   .catch((err) => console.log("err", err));
  };

  const refreshControl = () => {
    const hide = message.loading("loading hub data.");
    getHubDetails(hubId)
      .then((res) => {
        const { data = {}, message = "" } = res.data;
        console.log("data", data);
        const orders_to_be_received = data.orders_to_be_received;
        setTableData(orders_to_be_received);
        hide();
      })
      .catch((err) => {
        console.log("err", err);
        hide();
      });
  };

  useEffect(() => {
    refreshControl();
  }, [hubId]);

  const columnDefs = [
    // {
    //   headerName: "Next destination",
    //   field: "next_destination",
    //   width: 150,
    //   checkboxSelection: true,
    //   headerCheckboxSelection: true,
    // },
    {
      headerName: "Order number",
      field: "order_number",
      width: 150,
      sortable: true,
      // filter: "agTextColumnFilter",
    },
    {
      headerName: "Order status",
      field: "order_status",
      width: 150,
      filter: "agSetColumnFilter",
    },

    {
      headerName: "seller name",
      field: "seller_name",
      width: 150,
      sortable: true,
    },
    {
      headerName: "Society name",
      field: "society_name",
      width: 150,
      // filter: "agTextColumnFilter",
    },
    {
      headerName: "origin name",
      field: "origin_name",
    },
    {
      headerName: "Vehicle numbers",
      field: "vehicle_numbers",
      widht: "150",
    },
    {
      headerName: "weight",
      field: "weight",
      width: "150",
    },

    {
      headerName: "Partner id",
      field: "partner_id",
      width: "150",
    },
    {
      headerName: "partner name",
      field: "partner_name",
      width: "150",
    },
    {
      headerName: "",
      field: "action",
      cellRenderer: "RowButton",
      cellRendererParams: {
        hubId,
        refreshControl,
      },
      filter: false,
      floatingFilter: false,
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    flex: 1,
    floatingFilter: true,
    resizable: true,
    tooltipField: "Order_Id",
  };

  // will get row data, from here
  const onSelectionChanged = (event) => {
    console.log(event.api.getSelectedRows());
  };

  // add a condition for a row to be selectable
  const isRowSelectable = (node) => {
    // make it false or true
    // console.log("nod data", node.data);   // get row data
    return true;
  };

  const onFilterTextChange = (event) => {
    console.log(event.target.value);
    gridApi.setQuickFilter(event.target.value);
  };

  const onFirstDataRendered = (params) => {
    params.api.getToolPanelInstance("filters").expandFilters();
  };

  return (
    <>
      <div style={{ paddingLeft: "30px", paddingTop: "15px" }}>
        <h1>Orders to receive</h1>
      </div>
      <div style={{ color: "black", width: "500px", paddingLeft: "30px" }}>
        <Input
          type="search"
          placeholder="search an order"
          onChange={onFilterTextChange}
          allowClear
          style={{ display: "flex", flex: 1 }}
        />
      </div>
      <div
        style={{
          display: "flex",
          // minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
          padding: "30px",
        }}
      >
        <div className="ag-theme-alpine" style={{ height: 450, width: "100%" }}>
          <AgGridReact
            rowData={tableData}
            columnDefs={columnDefs}
            onGridReady={handleGridReady}
            postSort={() => console.log("sorting complete")}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
            onSelectionChanged={onSelectionChanged}
            rowMultiSelectWithClick="false"
            animateRows="true"
            enableRangeSelection="true"
            sideBar={true}
            enableBrowserTooltips={true}
            frameworkComponents={{ RowButton }}
          />
        </div>
      </div>
    </>
  );
};

export default App;

const RowButton = (props) => {
  const { refreshControl = () => {}, hubId = "" } = props;
  const { order_status } = props.node.data;
  const [loading, setLoading] = useState(false);

  const markOrderReceive = async (payload) => {
    try {
      const data = await receiveOrder(payload);
      console.log("receivei order data", data);
      setLoading(false);
      message.success("Order marked received");
      refreshControl();
    } catch (err) {
      console.log(err);
      setLoading(false);
      message.error("order not marked received");
    }
  };

  if (
    order_status.trim() !== "New" &&
    order_status.trim() !== "Seller Received Order"
  )
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          style={{ textAlign: "center" }}
          onClick={() => {
            console.log("shshs");
            let rowData = props.node.data;
            const { order_number } = rowData;
            const payload = {
              order_number,
              hub_id: +hubId,
            };
            console.log("payload", payload);
            setLoading(true);
            markOrderReceive(payload);
          }}
        >
          receive
          {loading ? <LoadingOutlined /> : <></>}
        </Button>
      </div>
    );
  else return <></>;
};

const statusList = [
  "NEW",
  "SELLER_RECEIVED",
  "IN_TRANSIT",
  "RECEIVED_AT_HUB",
  "OFD",
  "DELIVERED",
];

const filterParams = {
  values: statusList,
  suppressSorting: true,
};
