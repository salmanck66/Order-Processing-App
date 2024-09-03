import React, { useState } from "react";
import { IoIosArrowDown, IoIosClose, IoIosSearch } from "react-icons/io";
import { Dropdown, Menu, Button, Input } from "antd";

const Explore = ({
  selectedEditions,
  setSelectedEditions,
  selectedSizes,
  setSelectedSizes,
  stockOnly,
  setStockOnly,
  onClearFilters,
  onStockToggle,
  setSearchQuery,
}) => {
  const filterActionsMenu = (
    <Menu>
      <Menu.Item key="clearAll" onClick={onClearFilters}>
        Clear All Filters
      </Menu.Item>
      <Menu.Item key="toggleStock">
        <div onClick={onStockToggle}>
          {stockOnly
            ? "Remove In Stock Only Filter"
            : "Add In Stock Only Filter"}
        </div>
      </Menu.Item>
    </Menu>
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-4 flex flex-col md:flex-row md:items-start">
      <div className="flex flex-wrap gap-2 ">
        {/* Editions */}
        {selectedEditions.length > 0 &&
          selectedEditions.map((edition, index) => (
            <div
              key={index}
              className="mb-2 border flex items-center rounded-full w-fit  gap-x-2 px-3 py-1 bg-neutral hover:shadow-xl shadow-md text-white"
            >
              <h1 className="text-sm">{edition}</h1>
              <IoIosClose
                className="text-lg cursor-pointer"
                onClick={() =>
                  setSelectedEditions((prev) =>
                    prev.filter((e) => e !== edition)
                  )
                }
              />
            </div>
          ))}

        {/* Sizes */}
        {selectedSizes.length > 0 &&
          selectedSizes.map((size, index) => (
            <div
              key={index}
              className="mb-2 border flex items-center rounded-full w-fit  gap-x-2 px-3 py-1 bg-neutral hover:shadow-xl shadow-md text-white"
            >
              <h1 className="text-sm">{size}</h1>
              <IoIosClose
                className="text-lg cursor-pointer"
                onClick={() =>
                  setSelectedSizes((prev) => prev.filter((s) => s !== size))
                }
              />
            </div>
          ))}

        {stockOnly && (
          <div className="mb-2 border flex items-center rounded-full w-fit  gap-x-2 px-3 py-1 bg-neutral hover:shadow-xl shadow-md text-white">
            <h1 className="text-sm">Stock Only</h1>
            <IoIosClose
              className="text-lg cursor-pointer"
              onClick={() => setStockOnly(false)}
            />
          </div>
        )}
      </div>

      {/* Stock Only */}

      {/* Search and Filter Actions Section */}
      <div className="flex md:ms-auto flex-col md:flex-row md:justify-end items-center gap-4 ">
        <Input
          placeholder="Search items..."
          value={setSearchQuery((query) => query)}
          onChange={handleSearchChange}
          prefix={<IoIosSearch />}
          className="w-full md:w-64 rounded-full"
        />
        <Dropdown overlay={filterActionsMenu} trigger={["hover"]}>
          <Button
            type="default"
            className="flex items-center rounded-full ms-auto   gap-2"
          >
            Filter Actions <IoIosArrowDown />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default Explore;
