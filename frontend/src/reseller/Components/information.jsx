import React from 'react';
import { Tooltip } from 'antd';
import { PiInfoLight } from "react-icons/pi";

const Information = ({ tooltipMessage }) => {
  return (
    <div className="p-0 inline-flex items-center h-full  cursor-pointer">
      <Tooltip title={tooltipMessage} placement="top">
<PiInfoLight className='text-gray-400 inline-flex'/>
      </Tooltip>
    </div>
  );
};

export default Information;
