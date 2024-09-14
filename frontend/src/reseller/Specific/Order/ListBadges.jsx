import React, { useState } from 'react'; // Import useState
import PropTypes from 'prop-types';
import { Dropdown, Menu, Button, Select } from 'antd'; // Import Select component
import 'antd/dist/reset.css'; // Ensure Ant Design styles are included
import { IoCloseCircle } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { addBadges } from '../../Redux/ordersSlice';
const { Option } = Select;

const ListBadges = ({ badges, selectedBadges, productId,customerId, selectedOrder, onBadgeSelect }) => {
  const [selectedSize, setSelectedSize] = useState(null); // State for selected size
  const dispatch = useDispatch();

  const handleBadgeClick = (badge) => {
    onBadgeSelect(badge);
  };

  const handleSizeSelect = (value) => {
    setSelectedSize(value);
  };

  const handleSubmit = () => {
    dispatch(addBadges({
      badges: [{ size: selectedSize, badges: selectedBadges.map(item => item._id) }],
      productId: selectedOrder._id, // Ensure productId is correctly passed
      customerId: customerId // Pass customerId as well if needed
    }));
  };


  const menu = (
    <Menu>
      <div className='max-h-[200px] overflow-y-auto'>
        {badges.map(badge => (
          <Menu.Item
            key={badge._id}
            className={`cursor-pointer ${selectedBadges.some(b => b._id === badge._id) ? 'bg-blue-500 border-red-500' : 'bg-red-500'}`}
            onClick={() => handleBadgeClick(badge)}
          >
            <div className={`cursor-pointer flex ${selectedBadges.some(b => b._id === badge._id) ? 'bg-blue-500 border-red-500' : 'bg-red-500'} flex items-center w-[300px] border rounded-lg p-2`}>
              <img
                alt={badge.name}
                src={badge.image?.url || 'https://via.placeholder.com/150'}
                className="object-cover h-[48px] w-[48px] mr-2"
              />
              <div>
                <div>{badge.name}</div>
                <div>Price: ${badge.price}</div>
              </div>
              <IoCloseCircle className='ms-auto' />
            </div>
          </Menu.Item>
        ))}
      </div>
    </Menu>
  );

  return (
    <div className="rounded-lg p-6 ms-auto">
      <Select
        placeholder="Select size"
        onChange={handleSizeSelect}
        value={selectedSize}
        style={{ width: '100%' }} // Ensure Select takes full width
      >
        {selectedOrder && selectedOrder.orderSizes ? (
          Object.keys(selectedOrder.orderSizes).map((size) => (
            <Option key={size} value={size}>
              {size}
            </Option>
          ))
        ) : (
          <Option disabled>No sizes available</Option>
        )}
      </Select>
      <Dropdown overlay={menu} trigger={['click']} className='w-full'>
        <Button>
          {selectedBadges.length ? `Selected (${selectedBadges.length})` : 'Select Badges'}
        </Button>
      </Dropdown>
      <Button
        type="primary"
        className="mt-4 w-full"
        onClick={handleSubmit} // Ensure that the onClick event is attached to handle form submission
        disabled={selectedBadges.length === 0 || selectedSize === null} // Updated condition
      >
        Submit Badge Selection
      </Button>
    </div>
  );
};

ListBadges.propTypes = {
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedBadges: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedOrder: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    orderSizes: PropTypes.object,
    customerId: PropTypes.string.isRequired, // Add customerId if necessary
  }),
  onBadgeSelect: PropTypes.func.isRequired,
};

ListBadges.defaultProps = {
  badges: [],
  selectedBadges: [],
  selectedOrder: {},
};

export default ListBadges;
