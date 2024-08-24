import React, { useState } from 'react';
import { AutoComplete } from 'antd';
import { SearchProducts } from '../../Api/getApi';
import { LuSearchSlash } from 'react-icons/lu';
import { IoIosSearch } from 'react-icons/io';

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
   <div className='w-full  justify-end flex'>
    
    <AutoComplete
      style={{
        width: 400,
      }}
      options={options}
      placeholder="Search Items..."
      onSearch={handleSearch}
      className='w-full  '
    />
    <IoIosSearch className='text-3xl border bg-white rounded-md'/>
   </div>
  );
};

export default SearchBar;
