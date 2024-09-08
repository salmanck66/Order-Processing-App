import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const useCheckoutStatus = () => {
  const [checkoutStatus, setCheckoutStatus] = useState(false);
  const { customer } = useSelector((state) => state.orders);

  useEffect(() => {
    // Disable checkout if:
    // - No customers
    // - Any customer has no orders
    // - Any order has no sizes or all sizes have 0 quantity
    const isCheckoutDisabled = !customer || customer.length === 0 || 
      !customer.every(cust => 
        cust.orders && cust.orders.length > 0 && 
        cust.orders.every(order => 
          order.orderSizes && 
          Object.values(order.orderSizes).some(sizeQuantity => sizeQuantity > 0)
        )
      );

    setCheckoutStatus(isCheckoutDisabled);
  }, [customer]);

  return checkoutStatus;
};

export default useCheckoutStatus;
