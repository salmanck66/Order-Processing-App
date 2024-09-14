import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert, Image, Switch, message, Popconfirm, Button } from 'antd';
import { fetchBadge } from '../../Api/getApi';
import { badgeStockOut} from '../../Api/postApi'; // Make sure to import your delete API
import { deleteBadge } from '../../Api/DeleteApi';
import { CiTrash } from 'react-icons/ci';

const BadgeList = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockStatus, setStockStatus] = useState({});

  // Fetch badges on component mount
  useEffect(() => {
    const getBadges = async () => {
      try {
        const response = await fetchBadge();
        const fetchedBadges = response.badge; // Assuming the response data is an array of badges
        
        // Initialize stock status
        const initialStockStatus = {};
        fetchedBadges.forEach(badge => {
          initialStockStatus[badge._id] = badge.stock;
        });

        setBadges(fetchedBadges);
        setStockStatus(initialStockStatus);
      } catch (err) {
        setError(err.message || 'Failed to fetch badges.');
      } finally {
        setLoading(false);
      }
    };

    getBadges();
  }, []);

  // Define columns for the Table
  const columns = [
    {
      title: 'Badge Image',
      dataIndex: 'image',
      key: 'image',
      render: image => (
        <Image
          src={image.url}
          alt="Badge"
          style={{ height: '100px', objectFit: 'cover' }}
          preview={false}
        />
      ),
    },
    {
      title: 'Badge Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock, record) => (
        <Switch
          checked={stockStatus[record._id]}
          onChange={checked => handleStockChange(record._id, checked)}
        />
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => `$${price}`, // Format the price as currency
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this badge?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger size="">
            <CiTrash/> Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Handler for stock status change
  const handleStockChange = (id, checked) => {
    badgeStockOut(id)
      .then(() => {
        setStockStatus(prevStatus => ({
          ...prevStatus,
          [id]: checked
        }));
        message.success(`Badge ID ${id} stock status updated to ${checked ? 'In Stock' : 'Out of Stock'}`);
      })
      .catch(err => {
        message.error(`Failed to update stock status: ${err.message}`);
      });
  };

  // Handler for delete action
  const handleDelete = id => {
    deleteBadge(id)
      .then(() => {
        setBadges(prevBadges => prevBadges.filter(badge => badge._id !== id));
        message.success('Badge deleted successfully.');
      })
      .catch(err => {
        message.error(`Failed to delete badge: ${err.message}`);
      });
  };

  // Render loading spinner or error message
  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  // Render badges using Ant Design Table
  return (
    <div style={{ margin: '20px' }}>
      <Table
        dataSource={badges}
        columns={columns}
        rowKey="_id" // Use a unique key from your badge data
      />
    </div>
  );
};

export default BadgeList;
