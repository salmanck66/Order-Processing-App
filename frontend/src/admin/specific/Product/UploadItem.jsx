import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Select, Checkbox, Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const UploadItem = ({ control, index, errors, remove }) => {
  console.log(errors);
  
  const [fileList, setFileList] = useState([]);

  return (
    <div className="grid grid-cols-7 md:flex-row gap-4 h-full justify-center items-center rounded-lg shadow-lg hover:shadow-2xl p-6 mb-4">
      <div className='p-0 col-span-2'>
        <Form.Item
          label={`Product Name ${index + 1}`}
          validateStatus={errors?.name.message ? 'error' : 'enter product name'}
          help={errors?.name  ? errors?.name?.message : ''}
        >
          <Controller
            name={`products.${index}.name`}
            control={control}
            rules={{ required: 'Product name is required' }}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Product Name"
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={`Edition ${index + 1}`}
          validateStatus={errors?.edition.message ? 'error' : 'enter product name'}
          help={errors?.edition  ? errors?.edition?.message : ''}        >
          <Controller
            name={`products.${index}.edition`}
            control={control}
            rules={{ required: 'Edition is required' }}
            render={({ field }) => (
              <Select
                placeholder="Select Edition"
                {...field}
                style={{ minWidth: 200 }}
              >
                <Option value="Fan Version">Fan Version</Option>
                <Option value="Player Version">Player Version</Option>
                <Option value="First Copy Set">First Copy Set</Option>
                <Option value="Default">Default</Option>
              </Select>
            )}
          />
        </Form.Item>
      </div>

      <div className='col-span-2'>
        <Form.Item
          label={`Sizes ${index + 1}`}
          validateStatus={errors?.sizes?.message ? 'error' : 'enter product name'}
          help={errors?.sizes  ? errors?.sizes?.message : ''}        
        >
          <Controller
            name={`products.${index}.sizes`}
            control={control}
            rules={{ required: 'At least one size must be selected' }}
            defaultValue={[]}
            render={({ field: { value, onChange } }) => (
              <Checkbox.Group
                options={['S', 'M', 'L', 'XL', 'XXL']} // Available options for checkboxes
                value={value}
                onChange={onChange} // Update the form state with selected values
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={`Price ${index + 1}`}
          validateStatus={errors?.price?.message ? 'error' : 'enter product name'}
          help={errors?.price  ? errors?.price?.message : ''}        
        >
          <Controller
            name={`products.${index}.price`}
            control={control}
            rules={{ 
              required: 'Price is required',
              pattern: {
                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: 'Invalid price format'
              },
              min: {
                value: 0,
                message: 'Price must be a positive number'
              }
            }}
            render={({ field }) => (
              <Input
                type="number"
                placeholder="Price"
                {...field}
              />
            )}
          />
        </Form.Item>
      </div>

      <Form.Item
        className='col-span-3'
        label={`Images ${index + 1}`}
        validateStatus={errors?.images ? 'error' : ''}
        help={errors?.images ? errors?.images?.message : ''}
      >
        <Controller
          name={`products.${index}.images`} // Ensure the name matches the schema
          control={control}
          rules={{ validate: value => value?.length > 0 || 'At least one image must be uploaded' }}
          render={({ field: { value, onChange } }) => (
           
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  multiple
                  maxCount={3} // Limit to 3 files
                  beforeUpload={(file) => {
                    // Check if fileList length is within the limit
                    if (fileList.length >= 3) {
                      return Upload.LIST_IGNORE; // Ignore file if the limit is reached
                    }
            
                    const updatedFileList = [...fileList, file];
                    setFileList(updatedFileList); // Update file list
                    onChange(updatedFileList.map(file => file.originFileObj)); // Notify react-hook-form
            
                    return false; // Prevent automatic upload
                  }}
                  onChange={({ fileList: newFileList }) => {
                    setFileList(newFileList); // Update file list
                    onChange(newFileList.map(file => file.originFileObj)); // Update form state with files
                  }}
                  customRequest={({ file, onSuccess, onError }) => {
                    // Replace this with your actual upload logic
                    setTimeout(() => {
                      onSuccess(file);
                    }, 1000);
                  }}
                >
                  {fileList.length < 3 && <Button icon={<UploadOutlined />}>Upload </Button>}
                </Upload>
            
  )}
  />
      </Form.Item>
    </div>
  );
};

export default UploadItem;
