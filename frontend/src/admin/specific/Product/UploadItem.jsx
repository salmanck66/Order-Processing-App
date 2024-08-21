import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Select, Checkbox, Form } from 'antd';

const { Option } = Select;

const UploadItem = ({ control, index, errors }) => {
  return (
    <div className="bg-gray-50 flex  gap-2 h-full justify-center items-center rounded shadow-md p-6 mb-4">
      <Form.Item
        label={`Product Name ${index + 1}`}
        validateStatus={errors?.products?.[index]?.name ? 'error' : ''}
        help={errors?.products?.[index]?.name ? errors?.products?.[index]?.name?.message : ''}
      >
        <Controller
          name={`products.${index}.name`}
          control={control}
          rules={{ required: 'Product name is required' }}
          render={({ field }) => (
            <Input
              type="text"
              placeholder='Product Name'
              {...field}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={`Edition ${index + 1}`}
        validateStatus={errors?.products?.[index]?.edition ? 'error' : ''}
        help={errors?.products?.[index]?.edition ? errors?.products?.[index]?.edition?.message : ''}
      >
        <Controller
          name={`products.${index}.edition`}
          control={control}
          rules={{ required: 'Edition is required' }}
          render={({ field }) => (
            <Select
              placeholder='Select Edition'
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

      <Form.Item label={`Sizes ${index + 1}`}>
        <Controller
          name={`products.${index}.sizes`}
          control={control}
          render={({ field }) => (
            <Checkbox.Group {...field}>
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <Checkbox key={size} value={size}>
                  {size}
                </Checkbox>
              ))}
            </Checkbox.Group>
          )}
        />
      </Form.Item>

      <Form.Item
        label={`Price ${index + 1}`}
        validateStatus={errors?.products?.[index]?.price ? 'error' : ''}
        help={errors?.products?.[index]?.price ? errors?.products?.[index]?.price?.message : ''}
      >
        <Controller
          name={`products.${index}.price`}
          control={control}
          rules={{ required: 'Price is required' }}
          render={({ field }) => (
            <Input
              type="number"
              placeholder='Price'
              {...field}
            />
          )}
        />
      </Form.Item>
    </div>
  );
};

export default UploadItem;
