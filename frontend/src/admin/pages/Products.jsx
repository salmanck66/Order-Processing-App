import { Button, Input } from 'antd'; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import ListProducts from '../specific/Product/ListProducts';

const Products = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  return (
    <div className="w-full p-4 bg-white rounded shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
        <Link to={'/admin/upload'} className="mb-4 md:mb-0">
          <Button 
            type='primary'
            className="px-6 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Upload
          </Button>
        </Link>
        <div className="w-full md:w-auto flex justify-center md:justify-end px-0">
          <Input.Search
            placeholder="Search by product name"
            value={searchText}
            onChange={handleSearch}
            style={{ width: '100%', maxWidth: 300 }}
          />
        </div>
      </div>
      <ListProducts searchText={searchText}/>
    </div>
  );
};

export default Products;
