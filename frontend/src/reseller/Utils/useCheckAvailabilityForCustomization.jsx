import { useSelector } from 'react-redux';

const useCheckAvailabilityForCustomization = (productId, customerId, selectedSize) => {
  // Get the customer data from the Redux state
  const state = useSelector((state) => state.orders.customer);

  const customer = state?.find((item) => item._id === customerId);

  const order = customer?.orders?.find((order) => order._id === productId);
  
  if (order && selectedSize) {

    const badgeForSize = order?.badges?.find((badge) => badge?.size === selectedSize);
    const availableSizeCount = order?.orderSizes[selectedSize] || 0;

    const customizationsForSize = order?.customizations?.filter((customization) => customization?.size === selectedSize);
    const customizationCount = customizationsForSize?.length || 0;

    const isSizeAvailable = customizationCount < availableSizeCount;

    

    return {
      isSizeAvailable,
      badgeForSize,
      customizationsForSize,
    };
  }

  return ;
};

export default useCheckAvailabilityForCustomization;
