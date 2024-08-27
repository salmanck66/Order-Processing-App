import React, { useEffect, useState } from "react";
import { Table, Image, Typography } from "antd";
import { fetchOrder } from "../Api/getApi";
import { useParams } from "react-router-dom";

const { Text } = Typography;

const OrderDetailByDate = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const orderId = useParams().orderId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOrder(orderId);
        setOrders(response.orders);
        console.log(response.orders);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const columns = [
    {
      title: "Product Name",
      dataIndex: ["id", "name"],
      key: "name",
    },
    {
      title: "Edition",
      dataIndex: ["id", "edition"],
      key: "edition",
    },
    {
      title: "Price",
      dataIndex: ["id", "price"],
      key: "price",
      render: (price) => <Text>${price}</Text>,
    },
    {
      title: "Size",
      dataIndex: "sizes",
      key: "size",
      render: (sizes) =>
        sizes.map((size) => (
          <div key={size._id}>
            <Text>{size.size}</Text> - <Text>Quantity: {size.quantity}</Text>
          </div>
        )),
    },
    {
      title: "Image",
      dataIndex: ["id", "images"],
      key: "image",
      render: (images) =>
        images.map((image) => (
          <Image
            key={image._id}
            src={image.url}
            alt="product image"
           className="w-10 object-cover rounded-lg"
           width={50}
           height={50}
           
          />
        )),
    },
    
    {
      title: "Created At",
      dataIndex: ["id", "createdAt"],
      key: "createdAt",
      render: (createdAt) =>
        new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table
    className="m-20"
      dataSource={orders.products}
      columns={columns}
      rowKey="_id"
      pagination={false}
    />
  );
};

export default OrderDetailByDate;
