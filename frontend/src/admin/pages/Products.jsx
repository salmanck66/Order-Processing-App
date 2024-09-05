import { Button, Input } from 'antd'; // Import Input from 'antd'
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // No need to import Input from 'react-router-dom'
import ListProducts from '../specific/Product/ListProducts';

const Products = () => {
  const [searchText, setSearchText] = useState('');
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  return (
    <div className="ms-auto w-full p-4 bg-white p-0 rounded shadow-md">
      <div className="flex justify-end items-center mb-0">
        <Link to={'/admin/upload'}>
          <Button 
            type='primary'
            className="px-6 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Upload
          </Button>
        </Link>
        <div style={{ marginBottom: 16 }} className='w-full flex justify-end px-0 p-2'>
          <Input.Search
            placeholder="Search by product name"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
        </div>
      </div>
      <ListProducts searchText={searchText}/>
    </div>
  );
};

export default Products;
