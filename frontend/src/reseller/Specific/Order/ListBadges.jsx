import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBadges } from '../../Redux/ordersSlice';
import useCheckAvailabilityForCustomization from '../../Utils/useCheckAvailabilityForCustomization';
import { Select, Dropdown, Menu, Button, Divider } from 'antd';
import { IoCloseCircle } from 'react-icons/io5';

const { Option } = Select;

const ListBadges = ({ badges, selectedBadges, customerId, selectedOrder, setSelectedBadges, onBadgeSelect, handleModalCancel }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const dispatch = useDispatch();
  
  // Get availability data
  const availabilityData = useCheckAvailabilityForCustomization(selectedOrder._id, customerId, selectedSize);

  // Handle badge click
  const handleBadgeClick = (badge) => {
    onBadgeSelect(badge);
  };

  // Handle size selection
  const handleSizeSelect = (value) => {
    setSelectedSize(value);
  };

  // Handle submission
  const handleSubmit = () => {
    if (!selectedSize) {
      return; // Exit if no size is selected
    }
    const totalPrice = selectedBadges.reduce((sum, badge) => sum + badge.price, 0);
    console.log(`Total price of selected badges: $${totalPrice}`);

    // Dispatch action to add badges
    dispatch(
      addBadges({
        badges: [{ size: selectedSize, badges: selectedBadges.map((item) => item._id) }],
        productId: selectedOrder._id,
        totalPrice,
        customerId: customerId, 
      })
    );
    setSelectedSize(null); // Reset the size
    setSelectedBadges([]); // Clear selected badges
    handleModalCancel(); // Close modal
  };

  // Calculate the number of selected badges for a specific size
  const calculateSelectedBadgeCountForSize = (size) => {
    return selectedOrder?.badges?.filter((badge) => badge.size === size).length;
  };

  // Check if a badge is available for the selected size
  const isBadgeAvailableForSize = (badge) => {
    const selectedCount = selectedBadges?.filter((b) => b._id === badge._id && b.size === selectedSize).length;
    const availableStock = availabilityData?.customizationsForSize?.find((customization) => customization.badgeId === badge._id)?.stock || 0;
    return availableStock - selectedCount > 0;
  };

  // Create a menu for the badge selection
  const menu = (
    <Menu>
      <div className="max-h-[200px] overflow-y-auto">
        {badges.map((badge) => {
          const isBadgeDisabled = !isBadgeAvailableForSize(badge);
          const isSelected = selectedBadges?.some((b) => b._id === badge._id);

          return (
            <Menu.Item
              key={badge._id}
              className={`cursor-pointer ${isSelected ? 'bg-green-500' : ''}`} // Change background if selected
              onClick={() => handleBadgeClick(badge)}
            >
              <div className={`cursor-pointer flex ${isBadgeDisabled ? 'bg-gray-300' : 'bg-blue-100'} items-center w-[300px] border rounded-lg p-2`}>
                <img
                  alt={badge.name}
                  src={badge.image?.url || 'https://via.placeholder.com/150'}
                  className="object-cover h-[48px] w-[48px] mr-2"
                />
                <div>
                  <div>{badge.name}</div>
                  <div>Price: ${badge.price}</div>
                </div>
                {isSelected && <IoCloseCircle className="ms-auto text-red-600" />}
              </div>
            </Menu.Item>
          );
        })}
      </div>
    </Menu>
  );

  return (
    <div className="rounded-lg w-full">
      <Divider />

      {/* Size selection */}
      <Select
        placeholder="Select size"
        onChange={handleSizeSelect}
        value={selectedSize}
        className='my-3'
        style={{ width: '100%' }}
      >
        {selectedOrder && selectedOrder.orderSizes ? (
          Object.keys(selectedOrder.orderSizes).map((size) => {
            const availableStock = selectedOrder.orderSizes[size];
            const selectedBadgeCount = calculateSelectedBadgeCountForSize(size);

            // Disable the size if the available stock minus the selected badge count for this size is less than or equal to zero
            const isSizeDisabled = availableStock - selectedBadgeCount <= 0;

            return (
              <Option key={size} value={size} disabled={isSizeDisabled}>
                {size} {isSizeDisabled ? '(Unavailable)' : ''}
              </Option>
            );
          })
        ) : (
          <Option disabled>No sizes available</Option>
        )}
      </Select>

      {/* Badge selection dropdown */}
      <Dropdown overlay={menu} trigger={['click']} className="w-full">
        <Button>{selectedBadges.length ? `Selected (${selectedBadges.length})` : 'Select Badges'}</Button>
      </Dropdown>

      {/* Submit button is disabled if no size is selected or selected badges length is zero */}
      <Button
        type="primary"
        className="mt-4  w-full"
        onClick={handleSubmit}
        disabled={selectedBadges.length === 0 || selectedSize === null}
      >
        Submit Badge Selection
      </Button>
    </div>
  );
};

export default ListBadges;
