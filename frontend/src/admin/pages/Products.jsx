import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import ListProducts from '../specific/Product/ListProducts';
const Products = () => {
  return (
      <div className=" ms-auto w-full  p-4 bg-white p-0 rounded shadow-md">
        <div className="flex  justify-end items-center mb-0">
          <Link to={'/admin/upload'}>
          <Button type='primary'
            className="px-6 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Upload
          </Button>
          </Link>
      </div>
      <ListProducts/>
    </div>
  );
};

export default Products;
