import React, { useState } from "react";
import FilterBox from "../Specific/Product/FilterBox";
import ProductLists from "../Specific/Product/ProductLists";
import Explore from "../Specific/Product/Explore";
import { Divider } from "antd";

const ResellerProducts = () => {
  const [selectedEditions, setSelectedEditions] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [stockOnly, setStockOnly] = useState(false);

  const onClearFilters = () => {
    setSelectedEditions([]);
    setSelectedSizes([]);
    setPriceRange([0, 100]);
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
          priceRange={priceRange}
          setPriceRange={setPriceRange}
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
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          stockOnly={stockOnly}
          setStockOnly={setStockOnly}
          onClearFilters={onClearFilters}
          onStockToggle={onStockToggle}
        />
        <Divider variant="dashed" type="horizontal" className="my-4" />
        <ProductLists
          selectedEditions={selectedEditions}
          selectedSizes={selectedSizes}
          priceRange={priceRange}
          stockOnly={stockOnly}
        />
      </div>
    </div>
  );
};

export default ResellerProducts;
