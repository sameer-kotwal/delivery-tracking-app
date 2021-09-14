import React, { useState, useEffect } from "react";
import { useRouter, Link } from "next/router";
import BagReceive from "../../components/hub/tables/BagReceive.js";
import OrderReceive from "../../components/hub/tables/OrderReceive";
import TransitBag from "../../components/hub/tables/TransitBag";
import OfdTable from "../../components/hub/tables/OfdTable";
import { getAllHubs } from "../api";
import { Breadcrumb, Alert, Select, Button } from "antd";
const { Option } = Select;

const HubPage = (props) => {
  const router = useRouter();
  const [table, setTable] = useState("receive_o");
  const [allHubs, setAllHubs] = useState([]);
  const [ready, setReady] = useState(false);
  const { id } = router.query;

  useEffect(() => {
    getAllHubs()
      .then((res) => {
        setAllHubs(res.data.data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (!router.isReady) {
      setReady(false);
      return;
    }
    setReady(true);
  }, [router.isReady]);

  const getHubName = () => {
    console.log("router query od", router.query.id);
    const found = allHubs.find((el) => el.id == router.query.id);
    if (found) return found.name;
  };

  const handleSelectTable = (e, type) => {
    setTable(type);
  };

  if (ready)
    return (
      <div style={{ padding: "30px" }}>
        <div
          style={{
            display: "flex",
            paddingLeft: "30px",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ marginRight: "20px", marginBottom: 0 }}>
              {getHubName()}
            </h2>
            <p>hub id: {id}</p>
          </div>
          <Select
            style={{ width: 200 }}
            placeholder="Search Hub"
            onChange={(val) => {
              router.push(`/hub/${val}`);
            }}
          >
            {allHubs.map((el) => (
              <Option value={el.id} key={el.id}>
                {el.name}
              </Option>
            ))}
          </Select>

          <Button
            style={{ marginLeft: "15px" }}
            // onClick={() => setFetching(true)}
          >
            refresh
          </Button>
        </div>
        <div style={{ paddingLeft: "30px" }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <a onClick={(e) => handleSelectTable(e, "receive_o")}>
                Receive orders
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a onClick={(e) => handleSelectTable(e, "receive_b")}>
                Receive Bags
              </a>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <a onClick={(e) => handleSelectTable(e, "transit_b")}>
                Transit Bags
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a onClick={(e) => handleSelectTable(e, "ofd")}>
                Off to Deliveries
              </a>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {table === "receive_o" ? (
          <OrderReceive hubId={id} />
        ) : table === "receive_b" ? (
          <BagReceive hubId={id} />
        ) : table === "transit_b" ? (
          <TransitBag hubId={id} />
        ) : (
          <OfdTable hubId={id} />
        )}
      </div>
    );
  else return <></>;
};

export default HubPage;
