import React, { useState } from 'react';
import { Form, Button, Upload, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { createBadge } from '../../Api/postApi';

const BadgeForm = ({ onBadgeCreated }) => { // Receive onBadgeCreated prop
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [badgeImage, setBadgeImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  // Handle file upload
  const onImageUpload = (file) => {
    if (file) {
      setBadgeImage(file);
      setValue('badgeImage', file); // Update react-hook-form value

      // Generate image preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setBadgeImage(null);
      setValue('badgeImage', null); // Clear react-hook-form value
      setImagePreview(null); // Clear image preview
    }
    return false; // Prevent upload from triggering
  };

  // Notification helper functions
  const openNotificationWithIcon = (type, messageText, description) => {
    message[type]( {
      content: (
        <>
          <strong>{messageText}</strong>
          <div>{description}</div>
        </>
      ),
      duration: 3,
    });
  };

  const onSubmit = async (data) => {
    if (!badgeImage) {
      openNotificationWithIcon('error', 'Validation Error', 'Please upload a badge image.');
      return;
    }

    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append('name', data.badgeName);
    formData.append('price', data.badgePrice);
    formData.append('badgeImage', badgeImage);

    try {
      const response = await createBadge(formData);
      openNotificationWithIcon('success', 'Badge Created', 'The badge has been successfully created.');
      console.log('Form submitted:', response.data);
      reset();
      setBadgeImage(null);
      setImagePreview(null);
      if (onBadgeCreated) onBadgeCreated(); // Notify parent component
    } catch (error) {
      openNotificationWithIcon('error', 'Error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <Form
    
      onFinish={handleSubmit(onSubmit)}
      style={{ maxWidth: '600px', margin: 'auto' }}
      layout="vertical"
    >
      {/* Badge Name */}
      <Form.Item
        label="Badge Name"
        name="badgeName"
        rules={[{ required: true, message: 'Please input the badge name!' }]}
        validateStatus={errors.badgeName ? 'error' : ''}
        help={errors.badgeName?.message}
      >
        <input
          className='w-full p-1 border rounded-md px-4 border-black'
          {...register('badgeName')}
          placeholder="Enter badge name"
        />
      </Form.Item>

      {/* Badge Price */}
      <Form.Item
        label="Badge Price"
        name="badgePrice"
        rules={[{ required: true, message: 'Please input the badge price!' }]}
        validateStatus={errors.badgePrice ? 'error' : ''}
        help={errors.badgePrice?.message}
      >
        <input
          className='w-full p-1 border rounded-md px-4 border-black'
          type="number"
          {...register('badgePrice')}
          placeholder="Enter badge price"
        />
      </Form.Item>

      {/* Badge Image */}
      <Form.Item
        label="Badge Image"
        name="badgeImage"
        validateStatus={errors.badgeImage ? 'error' : ''}
        help={errors.badgeImage?.message}
      >
        <Upload
          customRequest={({ file }) => onImageUpload(file)}
          showUploadList={false} // Hide default upload list
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        {imagePreview && (
          <div style={{ marginTop: '10px' }}>
            <Image
              src={imagePreview}
              alt="Badge Preview"
              className='rounded-md'
              style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
            />
          </div>
        )}
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Badge
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BadgeForm;
