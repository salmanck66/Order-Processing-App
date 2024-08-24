import React, { useState } from 'react';
import { AutoComplete } from 'antd';
import { SearchProducts } from '../../Api/getApi';

const SearchBar = () => {
  const [options, setOptions] = useState([]);

  const handleSearch = async (inputValue) => {
    if (!inputValue) {
      setOptions([]);
      return;
    }

    try {
      const products = await SearchProducts(inputValue);
     
      setOptions(products);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <AutoComplete
      style={{
        width: 400,
      }}
      options={options}
      placeholder="Search Items..."
      onSearch={handleSearch}
    />
  );
};

export default SearchBar;
