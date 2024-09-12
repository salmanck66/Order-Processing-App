import React from 'react';

const CustomizeOrder = ({ selectedOrder }) => {
  return (
    <>
      {selectedOrder ? (
        <div>
          <h3>{selectedOrder.name}</h3>
          {/* Add your customization fields or UI here */}
          <p>Price: {selectedOrder.price}</p>
          {/* Example fields */}
          <div>Customization options can be displayed here</div>
        </div>
      ) : null}
    </>
  );
};

export default CustomizeOrder;
