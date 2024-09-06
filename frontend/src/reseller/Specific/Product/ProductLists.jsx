import React from 'react';
import { Table, Image } from 'antd';

const ProductLists = ({ products }) => {
  // Define columns for the Ant Design Table
  const columns = [
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      
      render: (images) => (
        images.length > 0 ? 
        <Image
          width={50}
          height={50}
          className=' object-cover'
          src={images[0].url}
          alt={images[0].public_id}
        /> : 
        'No Image'
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
      render: (price) => `$${price}`, // Format price
    },
    {
      title: 'Sizes Available',
      dataIndex: 'sizes',
      key: 'sizes',
      render: (sizes) => Object.keys(sizes).filter((size) => sizes[size]).join(', '),
    },
    {
      title: 'In Stock',
      dataIndex: 'stock',
      key: 'stock',
      responsive: ['sm'],
      render: (stock) => (stock ? 'Yes' : 'No'),
    },
    
    
  ];

  // Define pagination configuration
  const paginationConfig = {
    pageSize: 5, // Number of products per page
    showSizeChanger: true, // Allows user to change page size
    pageSizeOptions: ['5', '10', '20'], // Page size options
  };

  return (
    <Table
    className='overflow-y-auto'
      columns={columns}
      dataSource={products}
      pagination={paginationConfig}
      rowKey="_id"
    />
  );
};

export default ProductLists;
