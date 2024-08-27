import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete } from 'antd';
import { IoIosSearch } from 'react-icons/io';
import { SearchProducts } from '../../Api/PostApi';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../../Redux/ordersSlice';
import { notification } from 'antd';

const SearchBar = () => {
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debounceTimeout = useRef(null);

  const handleSearch = (inputValue) => {
    setSearchTerm(inputValue); // Update the search term state
  };

  const addToOrder = (product, index) => {
    const productExists = orders.some((item) => item._id === product._id);
  
    if (productExists) {
      notification.info({
        message: `Product Already Added`,
        description: ` ${product.name} is already in your order.`,
        placement: 'topRight',
      });
    } else {
      dispatch(addOrder(product)); // Dispatch the product details to the Redux store
      
    }
  };

  const CustomDropdown = ({ options }) => (
    <ul className="max-h-[80vh] overflow-y-scroll no-scrollbar">
      {options.map((option, index) => (
        <li
          key={index}
          onClick={() => addToOrder(option.product, index)} // Pass the selected product and index to addToOrder
          className="p-2 flex items-center gap-2 hover:bg-gray-200 rounded-lg cursor-pointer"
        >
          <img
            src={option.image}
            alt={option.label}
            className="w-14 h-14 rounded object-cover"
          />
          <span className="text-black text-md">{option.label}</span>
          <span className="text-gray-500 ml-auto">{option.value}</span>
        </li>
      ))}
    </ul>
  );

  useEffect(() => {
    if (!searchTerm) {
      setOptions([]); // Clear options if the search term is empty
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear the previous timeout
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const products = await SearchProducts(searchTerm); // Use the latest searchTerm
        console.log(products.products);
        const formattedResponse = products.products.map(product => ({
          label: product.name,
          value: product.edition,
          image: product?.images[0]?.url,
          product: product,
          _id: product._id,
        }));
        setOptions(formattedResponse);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(debounceTimeout.current); // Clean up timeout on unmount
    };
  }, [searchTerm]); // Only run when searchTerm changes

  return (
    <div className="w-full flex justify-end">
      <AutoComplete
        style={{ width: 400 }}
        dropdownRender={(menu) => (
          <CustomDropdown options={options} />
        )}
        options={options} // Pass options here to make sure AutoComplete knows about them
        placeholder="Search Items..."
        onChange={handleSearch} // Use onChange to trigger handleSearch
        value={searchTerm} // Set the value for AutoComplete
        className="w-full"
      />
      <IoIosSearch className="text-3xl border bg-white rounded-md ml-2" />
    </div>
  );
};

export default SearchBar;
