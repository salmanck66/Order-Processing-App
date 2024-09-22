import React, { useState, useEffect, useRef } from "react";
import { AutoComplete, Spin, notification } from "antd";
import { IoIosSearch } from "react-icons/io";
import { SearchProducts } from "../../Api/PostApi";
import { useDispatch, useSelector } from "react-redux";
import { addOrder } from "../../Redux/ordersSlice";

const SearchBar = ({ customerId }) => {
  const { customer } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef(null);

  const handleSearch = (inputValue) => {
    setSearchTerm(inputValue); // Update the search term state
  };

  const addToOrder = (product) => {
    const orders = customer.find((item) => item._id === customerId);

    const productExists = orders?.orders?.some((order) => order._id === product._id);

    if (productExists) {
      notification.info({
        message: `Product Already Added`,
        description: `${product.name} is already in your order.`,
        placement: "topRight",
      });
    } else {
      const updatedProduct = { ...product, total: 0 };
    console.log(updatedProduct);
      dispatch(addOrder({ product: updatedProduct, customerId, sum: 0 }));
    }
  };

  const CustomDropdown = ({ options }) => (
    <ul className="max-h-[80vh] overflow-y-scroll no-scrollbar">
      {options.map((option, index) => (
        <li
          key={index}
          onClick={() => addToOrder(option.product)}
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
        setIsLoading(true); // Show loading spinner
        const products = await SearchProducts(searchTerm);
        const formattedResponse = products.products.map((product) => ({
          label: product.name,
          value: product.edition,
          image: product?.images[0]?.url,
          product: product,
          _id: product._id,
        }));
        setOptions(formattedResponse);
        setIsLoading(false); // Hide loading spinner
      } catch (error) {
        console.error("Error fetching search results:", error);
        setIsLoading(false); // Hide loading spinner on error
      }
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(debounceTimeout.current); // Clean up timeout on unmount
    };
  }, [searchTerm]);

  return (
    <div className="w-fit flex gap-2 justify-end h-full items-center">
      <AutoComplete
        style={{ width: 300 }}
        dropdownRender={(menu) =>
          isLoading ? (
            <div className="p-4 flex justify-center items-center">
              <Spin />
            </div>
          ) : (
            <CustomDropdown options={options} />
          )
        }
        options={options}
        placeholder="Search Items..."
        onChange={handleSearch}
        value={searchTerm}
        className="w-full"
        allowClear // Add clear button for input field
      />
    </div>
  );
};

export default SearchBar;
