import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Timeline, Collapse, Button, message } from "antd";
import {
  CaretRightOutlined,
  ShopOutlined,
  AlignLeftOutlined,
  ClockCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
// import { trackingHistory } from '../api/mock_responses/trackingHistory';
import { getTrackingHistory, getOrderDetails } from "../api/";
import { useRouter, withRouter } from "next/router";

const TrackingDetails = (props) => {
  const [fetching, setFetching] = useState(true);
  const [err, setErr] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [ready, setReady] = useState(false);

  const { Panel } = Collapse;
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      setReady(false);
      return;
    }
    setReady(true);
  }, [router.isReady]);

  useEffect(() => {
    if (router.isReady && fetching) {
      getTrackingHistory(router.query.orderID)
        .then((res) => {
          console.log("Tracking History", res);
          setFetching(false);
          setTrackingHistory(res.data.data.reverse());
          setErr(null);
        })
        .catch((err) => {
          console.log("err", err);
          setFetching(false);
          setErr(err);
        });
    }
  }, [fetching, setFetching, router.isReady]);

  useEffect(() => {
    if (router.isReady && fetching) {
      getOrderDetails(router.query.orderID)
        .then((res) => {
          console.log("Order Details", res);
          setFetching(false);
          setOrderDetails(res.data.data);
          setErr(null);
        })
        .catch((err) => {
          console.log("err", err);
          setFetching(false);
          setErr(err);
        });
    }
  }, [fetching, setFetching, router.isReady]);

  const refreshData = () => {
    const hide = message.loading("refresh data");
    getOrderDetails(router.query.orderID)
      .then((res) => {
        console.log("Order Details", res);
        setOrderDetails(res.data.data);
        setErr(null);
        hide();
      })
      .catch((err) => {
        console.log("err", err);
        setErr(err);
        hide();
      });
  };

  const convertToReadable = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div style={{ backgroundColor: "white", height: "100%" }}>
      <div
        style={{
          paddingTop: "25px",
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingBottom: "25px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginLeft: "10px", marginRight: "10px" }}>
            <AlignLeftOutlined
              style={{
                color: "black",
                marginRight: "12px",
                fontSize: "20px",
                marginBottom: "8px",
                paddingLeft: "25px",
              }}
            />
          </div>
          <h2 style={{ color: "#000000" }}>
            Order #{orderDetails.order_number}
            <Button style={{ marginLeft: "15px" }} onClick={refreshData}>
              refresh
            </Button>
          </h2>
        </div>
        <div>
          <Collapse
            bordered={true}
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{
              marginTop: "10px",
              backgroundColor: "#34A0CE",
              marginBottom: "20px",
            }}
          >
            <Panel
              header="Order Details"
              key="1"
              className="site-collapse-custom-panel"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingRight: "12px",
                  paddingLeft: "10px",
                  paddingTop: "10px",
                  paddingBottom: "6px",
                }}
              >
                <p style={{ fontWeight: "bold" }}>
                  #{orderDetails.order_number}
                </p>
              </div>

              <div style={{ paddingLeft: "10px", paddingBottom: "6px" }}>
                <p
                  style={{
                    color: "#1D1E1F",
                    opacity: 0.7,
                    fontSize: "12px",
                    lineHeight: "16px",
                    opacity: 0.7,
                  }}
                >
                  <span style={{ fontWeight: "bold", opacity: 1 }}>
                    {" "}
                    Order Number:{" "}
                  </span>
                  {orderDetails.order_number}
                </p>
                <p
                  style={{
                    color: "#1D1E1F",
                    opacity: 0.7,
                    fontSize: "12px",
                    lineHeight: "16px",
                    opacity: 0.7,
                  }}
                >
                  <span style={{ fontWeight: "bold", opacity: 1 }}>
                    {" "}
                    Seller Name:{" "}
                  </span>
                  {orderDetails.seller_name}
                </p>
                <p
                  style={{
                    color: "#1D1E1F",
                    opacity: 0.7,
                    fontSize: "12px",
                    lineHeight: "16px",
                    opacity: 0.7,
                  }}
                >
                  <span style={{ fontWeight: "bold", opacity: 1 }}>
                    {" "}
                    Society:{" "}
                  </span>
                  {orderDetails.society_name}
                </p>
                <p
                  style={{
                    color: "#1D1E1F",
                    opacity: 0.7,
                    fontSize: "12px",
                    lineHeight: "16px",
                    opacity: 0.7,
                  }}
                >
                  <span style={{ fontWeight: "bold", opacity: 1 }}>
                    {" "}
                    Current Tracking Status:{" "}
                  </span>
                  {orderDetails.order_status}
                </p>
              </div>
            </Panel>
          </Collapse>
        </div>
        <Timeline
          style={{
            backgroundColor: "lightgrey",
            paddingTop: "25px",
            paddingLeft: "20px",
            marginLeft: "10px",
            marginRight: "10px",
            paddingRight: "20px",
            paddingBottom: "25px",
            fontFamily: "sans-serif",
          }}
        >
          {trackingHistory.map((el, i) =>
            el.order_status === "In Transit" ? (
              <Timeline.Item color="green">
                <p>{el.order_status}</p>
                <p>{convertToReadable(el.updated)}</p>
              </Timeline.Item>
            ) : el.current_location_name ? (
              <Timeline.Item
                color="grey"
                dot={<ShopOutlined style={{ fontSize: "24px" }} />}
              >
                <p style={{ fontSize: "18px" }}>{el.current_location_name}</p>
                <p>{el.order_status}</p>
                <p>{convertToReadable(el.updated)}</p>
              </Timeline.Item>
            ) : el.order_status === "New" ? (
              <Timeline.Item
                color="grey"
                dot={
                  el.order_status === "New" ? (
                    <CheckOutlined
                      style={{ fontSize: "24px", color: "green" }}
                    />
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
              >
                <p>Order Placed</p>
                <p>{convertToReadable(el.updated)}</p>
              </Timeline.Item>
            ) : (
              <Timeline.Item
                color="grey"
                dot={
                  el.order_status === "New" ? (
                    <CheckOutlined
                      style={{ fontSize: "24px", color: "green" }}
                    />
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
              >
                <p style={{ fontSize: "18px" }}>{el.order_status}</p>
                <p>{convertToReadable(el.updated)}</p>
              </Timeline.Item>
            )
          )}
        </Timeline>
      </div>
    </div>
  );
};

export default TrackingDetails;
