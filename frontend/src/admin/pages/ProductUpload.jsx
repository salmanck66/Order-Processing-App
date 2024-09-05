import React, { useState } from "react";
import UploadItem from "../specific/Product/UploadItem";
import { Button, Form, notification, Modal, Spin, Badge } from "antd";
import { useForm, useFieldArray } from "react-hook-form";
import { uploadProducts } from "../Api/postApi";

const ProductUpload = () => {
  const [loading, setLoading] = useState(false); 

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      products: [
        { name: "", edition: "", sizes: ["S", "M", "L", "XL"], price: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const onSubmit = (data) => {
    Modal.confirm({
      title: "Confirm Upload",
      content: "Are you sure you want to upload these products?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        setLoading(true); // Start loading
        const formData = new FormData();
        data.products.forEach((product, index) => {
          formData.append(`products[${index}][name]`, product.name);
          formData.append(`products[${index}][edition]`, product.edition);
          formData.append(`products[${index}][price]`, product.price);
          product.images.forEach((image, i) => {
            formData.append(`products[${index}][images][${i}]`, image);
          });
        });
        uploadProducts(formData)
          .then(() => {
            notification.success({
              message: "Upload Successful",
              description: "Products have been uploaded successfully.",
            });
            reset();
          })
          .catch((error) => {
            notification.error({
              message: "Upload Failed",
              description:
                "There was an error uploading the products. Please try again.",
            });
          })
          .finally(() => {
            setLoading(false); // Stop loading
          });
      },
    });
  };

  const addProduct = () => {
    append({ name: "", edition: "", sizes: ["S", "M", "L", "XL"], price: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white p-8 rounded shadow-md relative">
        {loading && (
          <><Spin
            tip="Uploading..."
            className="absolute inset-0 z-50 bg-white flex items-center justify-center" /><Badge status="processing" className="z-50"  text="Please wait until all products are uploaded.  On average, each product takes about 2 seconds to upload. Do not close this window or press the back button. If you have other tasks to do today, feel free to open them in a new tab" /></>

        )}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Products Upload
        </h1>
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
          {fields.map((field, index) => (
            <div key={field.id} className="relative">
              <UploadItem
                control={control}
                index={index}
                errors={errors.products?.[index]} // Pass specific errors for this product
                remove={remove} // Pass the remove function
              />
              <Button
                onClick={() => remove(index)}
                className="absolute top-0 right-0 mt-4 mr-4"
                type="danger"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={addProduct} className="mt-4" type="primary">
            Add Item
          </Button>
          <Button
            className="my-4 flex ms-auto"
            type="primary"
            htmlType="submit"
          >
            Upload
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ProductUpload;
