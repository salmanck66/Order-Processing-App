import { useSelector } from 'react-redux';

const useCheckAvailabilityForCustomization = (productId, customerId, selectedSize) => {
  // Get the customer data from the Redux state
  const state = useSelector((state) => state.orders.customer);

  // Find the specific customer by customerId
  const customer = state?.find((item) => item._id === customerId);

  // If the customer exists, find the specific order by productId
  const order = customer?.orders?.find((order) => order._id === productId);
  
  if (order) {
    // Check if the size is available in orderSizes

    // Check for badges in the given size
    const badgeForSize = order?.badges?.find((badge) => badge.size === selectedSize);
    const availableSizeCount = order?.orderSizes[selectedSize] || 0;

    const customizationsForSize = order?.customizations?.filter((customization) => customization.size === selectedSize);
    const customizationCount = customizationsForSize?.length || 0;

    // Size is available if there are less customizations than size count
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
