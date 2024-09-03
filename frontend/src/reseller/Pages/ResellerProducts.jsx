import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash"; 
import FilterBox from "../Specific/Product/FilterBox";
import ProductLists from "../Specific/Product/ProductLists";
import Explore from "../Specific/Product/Explore";
import { Divider } from "antd";
import { fetchProducts } from "../Api/PostApi";

const ResellerProducts = () => {
  const [selectedEditions, setSelectedEditions] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [stockOnly, setStockOnly] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);

  const debouncedFetchProducts = useCallback(
    debounce(() => {
      fetchAndSetProducts();
    }, 500), 
    [selectedEditions, selectedSizes, stockOnly, searchQuery] 
  );

  const fetchAndSetProducts = async () => {
    try {
      const response = await fetchProducts({
        editions: selectedEditions,
        sizes: selectedSizes,
        inStock: stockOnly,
        searchQuery
      });
      console.log(response);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    debouncedFetchProducts();
    return () => {
      debouncedFetchProducts.cancel(); 
    };
  }, [selectedEditions, selectedSizes, stockOnly, searchQuery]);

  const onClearFilters = () => {
    setSelectedEditions([]);
    setSelectedSizes([]);
    setStockOnly(false);
  };

  const onStockToggle = () => {
    setStockOnly(!stockOnly);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
      <div className="col-span-1 md:col-span-1">
        <FilterBox
          selectedEditions={selectedEditions}
          setSelectedEditions={setSelectedEditions}
          selectedSizes={selectedSizes}
          setSelectedSizes={setSelectedSizes}
          stockOnly={stockOnly}
          setStockOnly={setStockOnly}
        />
      </div>
      <div className="col-span-1 md:col-span-4">
        <Explore
          selectedEditions={selectedEditions}
          setSelectedEditions={setSelectedEditions}
          selectedSizes={selectedSizes}
          setSelectedSizes={setSelectedSizes}
          stockOnly={stockOnly}
          setStockOnly={setStockOnly}
          onClearFilters={onClearFilters}
          onStockToggle={onStockToggle}
          setSearchQuery={setSearchQuery}
        />
        <Divider variant="dashed" type="horizontal" className="my-4" />
        <ProductLists
          selectedEditions={selectedEditions}
          selectedSizes={selectedSizes}
          stockOnly={stockOnly}
          products={products}
        />
      </div>
    </div>
  );
};

export default ResellerProducts;
