import React from 'react';
import { Table, Image } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles

const ProductLists = ({ products }) => {
  // Define columns for the Ant Design Table
  const columns = [
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      render: (images) =>
        images && images.length > 0 ? (
          <Image
            width={50}
            height={50}
            className="object-cover"
            src={images[0].url}
            alt={images[0].public_id || 'Product Image'}
            fallback="https://via.placeholder.com/50" // Add fallback image
          />
        ) : (
          <span className="text-gray-500">Not Available</span> // Friendly message
        ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Edition',
      dataIndex: 'edition',
      key: 'edition',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`, // Ensure consistent price format
    },
    {
      title: 'Sizes Available',
      dataIndex: 'sizes',
      key: 'sizes',
      render: (sizes) =>
        Object.keys(sizes)
          .filter((size) => sizes[size])
          .join(', ') || <span className="text-gray-500">No sizes available</span>, // Handle empty sizes
    },
    {
      title: 'In Stock',
      dataIndex: 'stock',
      key: 'stock',
      responsive: ['sm'],
      render: (stock) => (
        <span className={stock ? 'text-green-500' : 'text-red-500'}>
          {stock ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  // Define pagination configuration
  const paginationConfig = {
    pageSize: 5, // Default products per page
    showSizeChanger: true, // Allows user to change page size
    pageSizeOptions: ['5', '10', '20'], // Page size options
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`, // Friendly pagination info
  };

  return (
    <div className="p-4 top-40">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <Table
        className="overflow-x-auto top-10"
        columns={columns}
        dataSource={products}
        pagination={paginationConfig}
        rowKey="_id"
        locale={{ emptyText: 'No products available' }} // Custom empty message
      />
    </div>
  );
};

export default ProductLists;
