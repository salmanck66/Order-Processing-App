import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedFetchProducts = useCallback(
    debounce(async () => {
      try {
        const response = await fetchProducts({
          editions: selectedEditions,
          sizes: selectedSizes,
          inStock: stockOnly,
          searchQuery,
        });
        setProducts(response.products);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }, 300),
    [selectedEditions, selectedSizes, stockOnly, searchQuery]
  );

  useEffect(() => {
    debouncedFetchProducts();
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [debouncedFetchProducts]);

  const onClearFilters = useCallback(() => {
    setSelectedEditions([]);
    setSelectedSizes([]);
    setStockOnly(false);
    setSearchQuery("");
  }, []);

  const onStockToggle = useCallback(() => {
    setStockOnly((prev) => !prev);
  }, []);

  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/5 sticky top-0 self-start overflow-y-auto h-full border-r">
        <FilterBox
          selectedEditions={selectedEditions}
          setSelectedEditions={setSelectedEditions}
          selectedSizes={selectedSizes}
          setSelectedSizes={setSelectedSizes}
          stockOnly={stockOnly}
          setStockOnly={setStockOnly}
        />
      </div>
      <div className="w-full md:w-4/5 flex flex-col ">
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
          products={memoizedProducts} // Pass the memoized products to avoid unnecessary re-renders
        />
      </div>
    </div>
  );
};

export default ResellerProducts;
