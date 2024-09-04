import React from 'react';
import UploadItem from '../specific/Product/UploadItem';
import { Button, Form } from 'antd';
import { useForm, useFieldArray } from 'react-hook-form';

const ProductUpload = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      products: [{ name: '', edition: '', sizes: [], price: '' }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'products',
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission, such as sending the data to the backend API.
  };

  const addProduct = () => {
    append({ name: '', edition: '', sizes: [], price: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Products Upload</h1>
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
        <Button className="my-4 flex ms-auto" type="primary" htmlType="submit">
            Upload
          </Button>
          {fields.map((field, index) => (
            <UploadItem
              key={field.id}
              control={control}
              index={index}
              // errors={errors} // If you want to handle validation errors
            />
          ))}
          <Button onClick={addProduct} className="mt-4" type="primary">
            Add Item
          </Button>
          
        </Form>
      </div>
    </div>
  );
};

export default ProductUpload;
