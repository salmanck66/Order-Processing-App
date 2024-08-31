import React, { useState } from 'react';
import { Button, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { addCustomer } from '../../Redux/ordersSlice';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique id generation
import AddOrders from './AddOrders';

const CreateCustomer = ({ open, onOk, onCancel, title }) => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [customerId, setCustomerId] = useState(''); // State to store the generated unique ID
  const { register, handleSubmit, formState: { errors }, setError, clearErrors, reset } = useForm();
  const dispatch = useDispatch();

  const handleFileChange = (info) => {
    setFileError('');
    const fileList = info.fileList;
    if (fileList.length > 0) {
      const uploadedFile = fileList[0].originFileObj;
      if (info.file) {
        setFile(uploadedFile);
        clearErrors('file');
      } else if (info.file.status === 'removed') {
        setFile(null);
        setError('file', {
          type: 'manual',
          message: 'Please upload a file',
        });
      }
    }
  };

  const onSubmit = (data) => {
    if (!file) {
      setFileError('Please upload a file');
      setError('file', {
        type: 'manual',
        message: 'Please upload a file',
      });
      return;
    }

    const uniqueId = uuidv4(); // Generate a unique ID

    const customer = {
      _id: uniqueId, // Assign the unique ID
      customerName: data.customerName,
      file: file,
    };

    dispatch(addCustomer(customer));

    setCustomerId(uniqueId); // Store the unique ID in state
    setSubmitted(true);
    reset()
  };

  const handleFooterClick = () => {
    onCancel(); // Close the modal
    
    setSubmitted(false); // Reset submission state
  };

  return (
    <Modal
      width={700}
      title={title}
      open={open}
      onCancel={onCancel}
      footer={
      
        submitted ?  (  <Button type="primary" onClick={handleFooterClick}>
          Submit
        </Button>): (
          <></>
        )
      
      }
      bodyStyle={{ maxHeight: '500px', overflowY: 'auto' }} // Ensure scrolling for long content
    >
      <div style={{ padding: '0px' }}>
        {!submitted ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '1px' }}>
              <label>Customer Name</label>
              <input
                className='w-full p-2 border-2 rounded-lg border-blue-400 active:border-blue-500'
                {...register('customerName', { required: 'Please enter the customer name' })}
                placeholder="Enter customer name"
              />
              {errors.customerName && <span style={{ color: 'red' }}>{errors.customerName.message}</span>}
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label>Upload File</label>
              <Upload
                onChange={handleFileChange}
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              {fileError && <span style={{ color: 'red' }}>{fileError}</span>}
            </div>
            
            <div>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </div>
          </form>
        ) : (
          <AddOrders customerId={customerId}/>
        )}
      </div>
    </Modal>
  );
};

export default CreateCustomer;
