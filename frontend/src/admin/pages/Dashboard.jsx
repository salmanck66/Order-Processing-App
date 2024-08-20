import React from 'react'
import OrderLists from '../specific/OrderLists'
import OrderSummery from '../specific/orderSummery'
const Dashboard = () => {
  return (
    <div className='grid grid-cols-2  gap-4'>
        <OrderLists/>
        <OrderSummery/>
    </div>
  )
}

export default Dashboard